import { useEffect, useState, useMemo } from 'react'

// reenable when type selection enabled
// import { useRef } from 'react'

import { useForm } from 'react-hook-form'

//MUI
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
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

//API
import {
  useGetEnrollmentPreviewMutation,
  usePostEnrollmentCreateMutation,
  usePutEnrollmentUpdateMutation
} from 'src/store/api/apiHooks'

//Redux Store
import { useAppSelector } from 'src/store/hooks'
import { selectEnrollmentByProfileId } from 'src/store/enrollmentSlice'
import { selectPaymentsByProfileId } from 'src/store/bankAccountSlice'

//Utils
import MoneyConverter from 'src/views/shared/utils/money-converter'
import DateConverter from 'src/views/shared/utils/date-converter'

//Imported Types
import { SingleSelectOption } from 'src/types/forms/selectOptionTypes'
import { EnrollmentPreviewMutatedType, EnrollmentSearchResultModel } from 'src/store/api/enrollmentApiSlice'

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

// Reenable when fixed fee options added
// const serviceFixedOptions: SingleSelectOption[] = [
//   {
//     label: '100',
//     value: 100
//   },
//   {
//     label: '200',
//     value: 200
//   },
//   {
//     label: '300',
//     value: 300
//   },
//   {
//     label: '400',
//     value: 400
//   },
//   {
//     label: '500',
//     value: 500
//   }
// ]

const generateServicePercentageOptions = (): SingleSelectOption[] => {
  const options: SingleSelectOption[] = []
  for (let i = 1; i <= 100; i++) {
    options.push({
      label: `${i}%`,
      value: i / 100
    })
  }

  return options
}

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
  // Enable when fixed amount is implemented
  // {
  //   label: 'Fixed Amount',
  //   value: 0
  // },

  {
    label: 'Percentage',
    value: 1
  }
]

const generateLengthOptions = (): SingleSelectOption[] => {
  const options: SingleSelectOption[] = []
  for (let i = 1; i <= 60; i++) {
    options.push({
      label: `${i} Payments`,
      value: i
    })
  }

  return options
}

// const lengthOptions: SingleSelectOption[] = [
//   {
//     label: '10 Payments',
//     value: 10
//   },
//   {
//     label: '12 Payments',
//     value: 12
//   },
//   {
//     label: '14 Payments',
//     value: 14
//   },
//   {
//     label: '16 Payments',
//     value: 16
//   },
//   {
//     label: '18 Payments',
//     value: 18
//   }
// ]

const EnrollmentDialog = ({ open, handleClose, id: profileId }: EnrollmentModalProps) => {
  //Data
  const enrollmentData: EnrollmentSearchResultModel | undefined = useAppSelector(state =>
    selectEnrollmentByProfileId(state, profileId)
  )

  const paymentData = useAppSelector(state => selectPaymentsByProfileId(state, String(profileId)))

  const [previewData, setPreviewData] = useState<EnrollmentPreviewMutatedType | null>(null)

  const [getPreview, previewStatus] = useGetEnrollmentPreviewMutation()
  const { isLoading: previewLoading } = previewStatus

  const [createEnrollment, createEnrollmentStatus] = usePostEnrollmentCreateMutation()
  const { isLoading: createEnrollmentLoading } = createEnrollmentStatus

  const [editEnrollment, editEnrollmentStatus] = usePutEnrollmentUpdateMutation()
  const { isLoading: editEnrollmentLoading } = editEnrollmentStatus

  const lengthOptions = useMemo(generateLengthOptions, [profileId])
  const servicePercentageOptions = useMemo(generateServicePercentageOptions, [profileId])

  const enrollmentForm = useForm({
    defaultValues: {
      paymentMethod: 2,
      maintenanceFee: 80.0,
      programLength: 12,
      serviceFeeType: 1,
      serviceFee: 0.35,
      firstPaymentDate: new Date(),
      recurringType: 1,
      recurringPaymentDate: addMonths(new Date(), 1)
    }
  })

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    reset,
    unregister,
    formState: { errors }
  } = enrollmentForm

  // function to check and return hardcoded gateways based on paymentMethod selected
  const checkGateway = () => {
    const method = getValues('paymentMethod')

    switch (method) {
      case 0:
        //ach
        return '53660F30-725B-4484-A70D-C43C35B96362'
      case 1:
        //cc
        return '8D9F32FB-DB1A-49CA-9C33-773E660D1397'
      default:
        return 'EA3EDF07-4706-405A-B9A2-8263001E06F8'
    }
  }

  //disables options based on paymentmethods provided
  const paymentMethodOptions: SingleSelectOption[] = [
    {
      label: 'ACH',
      value: 0,
      disabled: paymentData?.filter(payment => payment.accountType === 'ach').length === 0 ? true : false
    },
    {
      label: 'CC',
      value: 1,
      disabled: paymentData?.filter(payment => payment.accountType === 'card').length === 0 ? true : false
    },
    {
      label: 'None',
      value: 2
    }
  ]

  const onSubmit = () => {
    const data = {
      profileId: profileId,
      paymentMethod: getValues('paymentMethod') ?? 2,
      basePlan: 'Base Plan',
      serviceFeeType: getValues('serviceFeeType'),
      recurringType: getValues('recurringType'),
      enrollmentFee: getValues('serviceFee'),
      programLength: getValues('programLength'),
      gateway: checkGateway(),
      firstPaymentDate: getValues('firstPaymentDate'),
      recurringPaymentDate: getValues('recurringPaymentDate'),
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
    }

    enrollmentData?.enrollmentId
      ? editEnrollment(data)
          .unwrap()
          .then(res => {
            if (res) {
              reset()
              handleClose()
            }
          })
      : createEnrollment(data)
          .unwrap()
          .then(res => {
            if (res) {
              reset()
              handleClose()
            }
          })
  }

  const previewRequest = () => {
    getPreview({
      profileId: profileId,
      paymentMethod: getValues('paymentMethod') ?? 2,
      basePlan: 'Base Plan',
      serviceFeeType: getValues('serviceFeeType'),
      enrollmentFee: getValues('serviceFee'),
      programLength: getValues('programLength'),
      gateway: checkGateway(),
      firstPaymentDate: getValues('firstPaymentDate'),
      recurringType: getValues('recurringType'),
      recurringPaymentDate: getValues('recurringPaymentDate'),

      //if initialFeeAmount is not a null value, check backend to make sure numbers match up.
      //currently returned total service fee is dividing by original plan length rather than plan length - 1 to account for initial down payment

      // initialFeeAmount: null,
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
      .then(res => {
        if (res) {
          setPreviewData(res)
        }
      })
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
    // reenable when fixed fee type enabled
    // serviceOptions = serviceFixedOptions
  } else if (selectedFeeType === 1) {
    serviceOptions = servicePercentageOptions
  }

  // reenable when fixed fee type enabled
  // resets the serviceFee value upon switching feetypes
  // const previousSelected = useRef(getValues('serviceFeeType'))
  // useEffect(() => {
  //   if (previousSelected.current !== getValues('serviceFeeType')) {
  //     setValue('serviceFee', '')
  //     previousSelected.current = selectedFeeType
  //   }
  // }, [selectedFeeType])

  useEffect(() => {
    if (getValues('recurringType') === 0) {
      setValue('recurringPaymentDate', addMonths(getValues('firstPaymentDate'), 1))
    } else if (getValues('recurringType') === 1) {
      setValue('recurringPaymentDate', addWeeks(getValues('firstPaymentDate'), 1))
    } else if (getValues('recurringType') === 2) {
      setValue('recurringPaymentDate', addWeeks(getValues('firstPaymentDate'), 2))
    }
  }, [selectedRecurringType, selectedFirstPaymentDate, setValue, getValues])

  useEffect(() => {
    if (!enrollmentData?.enrollmentId) {
      unregister('paymentMethod')
    }
  }, [enrollmentData, unregister])

  useEffect(() => {
    if (enrollmentData?.enrollmentId) {
      reset({
        paymentMethod: enrollmentData.paymentMethod,

        // maint fee hardcoded, will need to grab from enrollment api another time
        maintenanceFee: 80,
        programLength: enrollmentData.programLength,
        serviceFeeType: 1,
        serviceFee: enrollmentData.enrollmentFee,
        firstPaymentDate: new Date(enrollmentData.firstPaymentDate),
        recurringType: 1,
        recurringPaymentDate: addMonths(new Date(enrollmentData.firstPaymentDate), 1)
      })
    }
  }, [enrollmentData, reset])

  // Will implement preview check to make sure up to date before creating preview
  // const shallow1 = useRef(JSON.stringify(getValues()))

  // useEffect(() => {
  //   if (previewData) {
  //     const shallow2 = JSON.stringify(getValues())
  //     if (shallow1.current !== shallow2) {
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
            {enrollmentData?.enrollmentId && (
              <Box mb={4}>
                <SingleSelect
                  label='Payment Method'
                  name='paymentMethod'
                  errors={errors}
                  control={control}
                  options={paymentMethodOptions}
                />
              </Box>
            )}
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
              <Button disabled={previewLoading} variant='outlined' size='small' onClick={handleSubmit(previewRequest)}>
                {previewLoading ? 'Generating...' : 'Preview'}
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
                  {previewData.transactions.length <= 9
                    ? previewData.transactions.map((row: any, i: number) => (
                        <TableRow key={i + 1}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell align='center'>{DateConverter(row.processDate, 'UTC')}</TableCell>
                          <TableCell align='center'>{MoneyConverter(row.serviceFee)}</TableCell>
                          <TableCell align='center'>{MoneyConverter(row.maintenanceFee)}</TableCell>
                          <TableCell align='center'>{MoneyConverter(row.total)}</TableCell>
                        </TableRow>
                      ))
                    : null}
                  {previewData.transactions.length > 9
                    ? previewData.transactions.slice(0, 5).map((row: any, i: number) => (
                        <TableRow key={i + 1}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell align='center'>{DateConverter(row.processDate, 'UTC')}</TableCell>
                          <TableCell align='center'>{MoneyConverter(row.serviceFee)}</TableCell>
                          <TableCell align='center'>{MoneyConverter(row.maintenanceFee)}</TableCell>
                          <TableCell align='center'>{MoneyConverter(row.total)}</TableCell>
                        </TableRow>
                      ))
                    : null}
                  {previewData.transactions.length > 9 && (
                    <TableRow
                      style={{
                        height: 50
                      }}
                    >
                      <TableCell align='center' colSpan={6}>
                        .........
                      </TableCell>
                    </TableRow>
                  )}
                  {previewData.transactions.length > 9
                    ? previewData.transactions.slice(previewData.transactions.length - 4).map((row: any, i: number) => (
                        <TableRow key={previewData.transactions.length - 3 + i}>
                          <TableCell>{previewData.transactions.length - 3 + i}</TableCell>
                          <TableCell align='center'>{DateConverter(row.processDate, 'UTC')}</TableCell>
                          <TableCell align='center'>{MoneyConverter(row.serviceFee)}</TableCell>
                          <TableCell align='center'>{MoneyConverter(row.maintenanceFee)}</TableCell>
                          <TableCell align='center'>{MoneyConverter(row.total)}</TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
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
        <Button
          disabled={!previewData || createEnrollmentLoading || editEnrollmentLoading}
          variant='outlined'
          onClick={onSubmit}
        >
          {createEnrollmentLoading || editEnrollmentLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EnrollmentDialog
