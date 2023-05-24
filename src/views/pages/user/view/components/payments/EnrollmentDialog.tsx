import { useEffect, useState, memo, useRef } from 'react'

import { useForm, useWatch } from 'react-hook-form'

//MUI
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TablePagination from '@mui/material/TablePagination'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'

//MUI Custom Props
import { styled } from '@mui/material/styles'
import { CardContentProps } from '@mui/material/CardContent'

//Dialog Components
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

//Custom Components
import SelectDate from 'src/views/shared/form-input/date-picker'
import SingleSelect from 'src/views/shared/form-input/single-select'
import TextInput from 'src/views/shared/form-input/text-input'
import Icon from 'src/@core/components/icon'

//Third-Party Packages
import { addWeeks, addMonths, isSameDay } from 'date-fns'

//API
import { useGetEnrollmentPreviewMutation } from 'src/store/api/apiHooks'

//Redux Store
import { useAppSelector } from 'src/store/hooks'
import { selectEnrollmentByProfileId } from 'src/store/enrollmentSlice'

//Utils
import MoneyConverter from 'src/views/shared/utils/money-converter'

//Imported Types
import { SingleSelectOption } from 'src/types/forms/selectOptionTypes'
import { EnrollmentPreviewType } from 'src/store/api/enrollmentApiSlice'
import DateConverter from 'src/views/shared/utils/date-converter'
import { get } from 'http'

//Typing
type EnrollmentModalProps = {
  open: boolean
  handleClose: () => void
  id: string
}

//Custom Styling
const CardContainer = styled(CardContent)<CardContentProps>(({ theme }) => ({
  minWidth: 300,
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: '24px'
  }
}))

//Dropdown Options

const serviceFixedOptions: SingleSelectOption[] = [
  {
    label: '100',
    value: 100
  },
  {
    label: '200',
    value: 200
  },
  {
    label: '300',
    value: 300
  },
  {
    label: '400',
    value: 400
  },
  {
    label: '500',
    value: 500
  }
]

const servicePercentageOptions: SingleSelectOption[] = [
  {
    label: '35%',
    value: 0.35
  },
  {
    label: '36%',
    value: 0.36
  },
  {
    label: '37%',
    value: 0.37
  },
  {
    label: '38%',
    value: 0.38
  },
  {
    label: '39%',
    value: 0.39
  },
  {
    label: '40%',
    value: 0.4
  },
  {
    label: '41%',
    value: 0.41
  },
  {
    label: '42%',
    value: 0.42
  },
  {
    label: '43%',
    value: 0.43
  },
  {
    label: '44%',
    value: 0.44
  },
  {
    label: '45%',
    value: 0.45
  }
]

const recurringOptions: SingleSelectOption[] = [
  {
    label: 'Weekly',
    value: 1
  },
  {
    label: 'Bi-weekly',
    value: 2
  },
  {
    label: 'Monthly',
    value: 0
  }
]

const serviceFeeOptions: SingleSelectOption[] = [
  {
    label: 'Fixed Amount',
    value: 0
  },
  {
    label: 'Percentage',
    value: 1
  }
]

const lengthOptions: SingleSelectOption[] = [
  {
    label: '10 Payments',
    value: 10
  },
  {
    label: '12 Payments',
    value: 12
  },
  {
    label: '14 Payments',
    value: 14
  },
  {
    label: '16 Payments',
    value: 16
  },
  {
    label: '18 Payments',
    value: 18
  }
]

const EnrollmentDialog = ({ open, handleClose, id: profileId }: EnrollmentModalProps) => {
  //Data
  const enrollmentData = useAppSelector(state => selectEnrollmentByProfileId(state, profileId))
  const [previewData, setPreviewData] = useState<EnrollmentPreviewType | null>(null)

  const [getPreview, previewStatus] = useGetEnrollmentPreviewMutation()

  const defaultValues = {
    maintenanceFee: 80.0,
    programLength: 12,
    serviceFeeType: 1,
    serviceFee: 0.35,
    firstPaymentDate: new Date(),
    recurringType: 1,
    recurringPaymentDate: addMonths(new Date(), 1)
  }

  const enrollmentForm = useForm({ defaultValues, ...enrollmentData })
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors }
  } = enrollmentForm

  const onSubmit = (data: any) => {
    console.log(data)
  }

  const previewRequest = () => {
    getPreview({
      profileId: profileId,
      paymentMethod: 2,
      basePlan: 'Base Plan',
      serviceFeeType: getValues('serviceFeeType'),
      enrollmentFee: getValues('serviceFee'),
      programLength: getValues('programLength'),
      gateway: 'settingservice_paymentprocessor_nacha',
      firstPaymentDate: getValues('firstPaymentDate'),
      recurringType: getValues('recurringType'),
      recurringPaymentDate: getValues('recurringPaymentDate'),
      //if initialFeeAmount is not a null value, check backend to make sure numbers match up.
      //currently returned total service fee is dividing by original plan length rather than plan length - 1 to account for initial down payment

      initialFeeAmount: null,
      additionalFees: [
        {
          feeName: 'Maintenance Fee',
          feeType: 0,
          amount: 80,
          feeStart: 1,
          feeEnd: getValues('programLength')
        }
      ]
    })
      .unwrap()
      .then(res => setPreviewData(res))
      .catch(err => console.error(err))
  }

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  console.log('rerendering enrollmentdialog')

  // Avoid a layout jump when reaching the last page with empty rows.
  //PreviewData !== null when empty rows is checked
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - previewData.transactions.length ?? 0) : 0

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  //onChange
  const [selectedFeeType, selectedRecurringType, selectedFirstPaymentDate] = watch([
    'serviceFeeType',
    'recurringType',
    'firstPaymentDate'
  ])

  //Changes Service Fee
  let serviceOptions: SingleSelectOption[] = []

  if (selectedFeeType === 0) {
    serviceOptions = serviceFixedOptions
  } else if (selectedFeeType === 1) {
    serviceOptions = servicePercentageOptions
  }

  const previousSelected = useRef(getValues('serviceFeeType'))
  useEffect(() => {
    if (previousSelected.current !== getValues('serviceFeeType')) {
      setValue('serviceFee', '')
      previousSelected.current = selectedFeeType
    }
  }, [selectedFeeType])

  useEffect(() => {
    if (getValues('recurringType') === 0) {
      setValue('recurringPaymentDate', addMonths(getValues('firstPaymentDate'), 1))
    } else if (getValues('recurringType') === 1) {
      setValue('recurringPaymentDate', addWeeks(getValues('firstPaymentDate'), 1))
    } else if (getValues('recurringType') === 2) {
      setValue('recurringPaymentDate', addWeeks(getValues('firstPaymentDate'), 2))
    }
  }, [selectedRecurringType, selectedFirstPaymentDate])

  // Will implement preview check to make sure up to date before creating preview
  // const shallow1 = useRef(JSON.stringify(getValues()))

  // useEffect(() => {
  //   if (previewData) {
  //     const shallow2 = JSON.stringify(getValues())
  //     if (shallow1.current !== shallow2) {
  //       console.log('theyre the same, dont refresh')
  //       shallow1.current = shallow2
  //     }
  //   }
  // }, [watch()])

  return (
    <Dialog open={open} maxWidth='xl' fullWidth onClose={handleClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>
        {enrollmentData?.enrollmentId ? 'Update' : 'Create New'} Enrollment Plan
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <CardContainer>
          <form>
            <Box mb={4}>
              <SingleSelect
                label='Plan Length'
                name='programLength'
                errors={errors}
                control={control}
                options={lengthOptions}
              />
            </Box>
            <Box mb={4}>
              <SingleSelect
                label='Service Fee Type'
                name='serviceFeeType'
                errors={errors}
                control={control}
                options={serviceFeeOptions}
              />
            </Box>
            <Box mb={4}>
              <SingleSelect
                label='Service Fee'
                name='serviceFee'
                errors={errors}
                control={control}
                options={serviceOptions}
                required
              />
            </Box>
            <Box mb={4}>
              <TextInput
                label='Maintenance Fee'
                name='maintenanceFee'
                errors={errors}
                control={control}
                InputProps={{ readOnly: true }}
              />
            </Box>
            <Box mb={4}>
              <SelectDate
                name='firstPaymentDate'
                label='First Payment Date'
                errors={errors}
                control={control}
                isClearable={false}
              />
            </Box>
            <Box mb={4}>
              {' '}
              <SingleSelect
                label='Recurring Payment Frequency'
                name='recurringType'
                errors={errors}
                control={control}
                options={recurringOptions}
              />
            </Box>
            <Box mb={4}>
              <SelectDate
                name='recurringPaymentDate'
                label='First Recurring Date'
                errors={errors}
                control={control}
                isClearable={false}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='outlined' size='small' onClick={handleSubmit(previewRequest)}>
                Preview
              </Button>
            </Box>
          </form>
        </CardContainer>
        <Box sx={{ width: '100%', px: { xs: '16px', md: '24px' } }}>
          {previewData ? (
            <>
              <Grid container sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Typography variant='caption'>Total Enrolled Debt</Typography>
                  <Typography variant='h4'>{MoneyConverter(previewData.totalEnrolledDebt)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='caption'>Total Fees</Typography>
                  <Typography variant='h4'>{MoneyConverter(previewData.totalFee)}</Typography>
                </Grid>
              </Grid>
              <Typography variant='h5' sx={{ mb: 2 }}>
                Enrollment Plan Preview
              </Typography>
              <Table sx={{ maxHeight: '500px' }} stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell align='center'>Process Date</TableCell>
                    <TableCell align='center'>Service Fee</TableCell>
                    <TableCell align='center'>Mainentance Fee</TableCell>
                    <TableCell align='center'>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.transactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell align='center'>{DateConverter(row.processDate, 'UTC')}</TableCell>
                        <TableCell align='center'>{MoneyConverter(row.serviceFee)}</TableCell>
                        <TableCell align='center'>{MoneyConverter(row.maintenanceFee)}</TableCell>
                        <TableCell align='center'>{MoneyConverter(row.total)}</TableCell>
                      </TableRow>
                    ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 50 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                page={page}
                component='div'
                count={previewData.transactions.length}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <Typography variant='body1'>Click Preview button on left to view</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={!previewData} variant='outlined' onClick={onSubmit}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(EnrollmentDialog)
