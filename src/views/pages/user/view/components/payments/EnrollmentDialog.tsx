import { useEffect, useState, memo } from 'react'

import { useForm } from 'react-hook-form'

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
import { addWeeks, addMonths } from 'date-fns'
import { useGetEnrollmentPreviewMutation } from 'src/store/api/apiHooks'
import { SingleSelectOption } from 'src/types/forms/selectOptionTypes'
import { getValue } from '@mui/system'
import { EnrollmentPreviewType } from 'src/store/api/enrollmentApiSlice'

//Typing
type EnrollmentModalProps = {
  open: boolean
  handleClose: () => void
  data?: any
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

const EnrollmentDialog = ({ open, handleClose, data, id: profileId }: EnrollmentModalProps) => {
  const defaultValues = {
    maintenanceFee: 80.0,
    programLength: 12,
    serviceFeeType: 1,
    serviceFee: 0.35,
    firstPaymentDate: new Date(),
    recurringType: 1,
    recurringPaymentDate: addMonths(new Date(), 1)
  }

  const enrollmentForm = useForm({ defaultValues, ...data })
  const {
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors }
  } = enrollmentForm

  const onSubmit = (data: any) => {
    console.log(data)
  }

  const preview = []

  // const [getPreview, previewStatus] = useGetEnrollmentPreviewMutation()
  // console.log({ getPreview, previewStatus })

  // const previewRequest = () => {
  //   getPreview({
  //     profileId: profileId,
  //     paymentMethod: 2,
  //     basePlan: 'Base Plan',
  //     serviceFeeType: getValues('serviceFeeType'),
  //     enrollmentFee: getValues('serviceFee'),
  //     programLength: getValues('programLength'),
  //     gateway: 'NACHA',
  //     firstPaymentDate: getValues('firstPaymentDate'),
  //     recurringType: getValues('recurringFrequency'),
  //     recurringPaymentDate: getValues('recurringPaymentDate'),
  //     initialFeeAmount: 0,
  //     additionalFees: [
  //       {
  //         feeName: 'Maintenance Fee',
  //         feeType: 0,
  //         amount: 80,
  //         feeStart: 1,
  //         feeEnd: getValues('programLength')
  //       }
  //     ]
  //   })
  // }
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  console.log('rerendering enrollmentdialog')

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - preview.length) : 0

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

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

  let serviceOptions: SingleSelectOption[] = []

  // const selectType = watch('serviceFeeType')

  // if (selectType === 0) {
  //   serviceOptions = serviceFixedOptions
  // } else if (selectType === 1) {
  //   serviceOptions = servicePercentageOptions
  // }

  // const selectFrequency = watch('recurringType')
  // if (selectFrequency === 0) {
  //   setValue('recurringPaymentDate', addMonths(getValues('firstPaymentDate'), 1))
  // } else if (selectFrequency === 1) {
  //   setValue('recurringPaymentDate', addWeeks(getValues('firstPaymentDate'), 1))
  // } else if (selectFrequency === 2) {
  //   setValue('recurringPaymentDate', addWeeks(getValues('firstPaymentDate'), 2))
  // }

  // useEffect(() => {
  //   if (getValues('firstPaymentDate')) {
  //     setValue('recurringType', getValues('recurringType'))
  //   }
  // }, [watch('firstPaymentDate')])

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

  return (
    <Dialog open={open} maxWidth='xl' fullWidth onClose={handleClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>
        {data ? 'Update' : 'Create New'} Enrollment Plan
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
                required
                control={control}
                options={lengthOptions}
              />
            </Box>
            <Box mb={4}>
              <SingleSelect
                label='Service Fee Type'
                name='serviceFeeType'
                errors={errors}
                required
                control={control}
                options={serviceFeeOptions}
              />
            </Box>
            <Box mb={4}>
              <SingleSelect
                label='Service Fee'
                name='serviceFee'
                errors={errors}
                required
                control={control}
                options={serviceOptions}
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
                required
              />
            </Box>
            <Box mb={4}>
              {' '}
              <SingleSelect
                label='Recurring Payment Frequency'
                name='recurringType'
                errors={errors}
                required
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
                required
              />
            </Box>
          </form>
        </CardContainer>
        <Box sx={{ width: '100%', px: { xs: '16px', md: '24px' } }}>
          <Grid container sx={{ mb: 4 }}>
            <Grid item xs={6}>
              <Typography variant='caption'>Total Enrolled Debt</Typography>
              <Typography variant='h4'>${'10000'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='caption'>Total Fees</Typography>
              <Typography variant='h4'>${'6066.00'}</Typography>
            </Grid>
          </Grid>
          <Typography variant='h5' sx={{ mb: 2 }}>
            Enrollment Plan Preview
          </Typography>
          <Table sx={{ maxHeight: '500px' }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align='left'>Process Date</TableCell>
                <TableCell align='left'>Service Fee</TableCell>
                <TableCell align='left'>Mainentance Fee</TableCell>
                <TableCell align='left'>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {preview.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any, i: number) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell align='left'>{row.processDate}</TableCell>
                  <TableCell align='left'>{row.serviceFee}</TableCell>
                  <TableCell align='left'>{row.maintenanceFee}</TableCell>
                  <TableCell align='left'>{row.total}</TableCell>
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
            count={preview.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant='outlined' onClick={handleSubmit(onSubmit)}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(EnrollmentDialog)
