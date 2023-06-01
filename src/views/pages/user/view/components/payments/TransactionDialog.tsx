import { ReactElement, useEffect } from 'react'

//MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import SingleSelect from 'src/views/shared/form-input/single-select'
import SelectDate from 'src/views/shared/form-input/date-picker'
import TextInput from 'src/views/shared/form-input/text-input'

//Dialog
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

//Icon Component
import Icon from 'src/@core/components/icon'

//Forms
import { useForm } from 'react-hook-form'

//API Hooks
import { usePostPaymentCreateMutation, usePutPaymentUpdateMutation } from 'src/store/api/apiHooks'

//Types
import { PaymentDetailInfoModel } from 'src/store/api/enrollmentApiSlice'
import { BankingOrCreditCardType } from 'src/store/bankAccountSlice'
import { SingleSelectOption } from 'src/types/forms/selectOptionTypes'

type TransactionDialogProps = {
  data: PaymentDetailInfoModel | null
  open: boolean
  toggle: () => void
  paymentData: BankingOrCreditCardType[]
  profileId: string
}

const EnrollmentOptions: SingleSelectOption[] = [
  { label: 'Select One...', value: '', disabled: true },
  { label: 'Open', value: 0 },
  { label: 'Pending', value: 1, disabled: true },
  { label: 'Cleared', value: 2, disabled: true },
  { label: 'Returned', value: 3, disabled: true },
  { label: 'Paused', value: 4 },
  { label: 'Cancelled', value: 5 },
  { label: 'Reversed', value: 6, disabled: true },
  { label: 'Rejected', value: 7, disabled: true },
  { label: 'Error', value: 8, disabled: true },
  { label: 'Voided', value: 9, disabled: true },
  { label: 'Unknown', value: 10, disabled: true }
]

type ValuesType = {
  processedDate?: string | Date
  paymentMethod?: number | string
  amount?: string
  memo?: string
  description?: string
  clearedDate?: string | Date
  status?: number | string
}

const baseValue: ValuesType = {
  processedDate: '',
  paymentMethod: '',
  amount: '',
  memo: '',
  description: '',
  clearedDate: '',
  status: ''
}

export default function TransactionDialog({
  data,
  open,
  toggle,
  paymentData,
  profileId
}: TransactionDialogProps): ReactElement {
  const transForm = useForm({
    defaultValues: baseValue
  })
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    unregister,
    reset
  } = transForm

  const [postPayment, { isLoading: createLoading }] = usePostPaymentCreateMutation()
  const [editPayment, { isLoading: editLoading }] = usePutPaymentUpdateMutation()

  useEffect(() => {
    if (data) {
      reset({
        processedDate: new Date(data.processedDate),
        paymentMethod: data.paymentMethod,
        amount: String(data.amount),
        memo: data.memo,
        description: data.description ?? '',
        clearedDate: data.clearedDate ? new Date(data.clearedDate) ?? '' : undefined,
        status: data.status
      })
    }
    if (data === null) {
      reset(baseValue)
      unregister(['status', 'clearedDate', 'description'])
    }
  }, [data, reset, unregister])

  const filterGateway = () => {
    const gate = getValues('paymentMethod')

    // grab processors from api once ready
    if (gate === 0) {
      return '53660F30-725B-4484-A70D-C43C35B96362'
    } else if (gate === 1) {
      return '8D9F32FB-DB1A-49CA-9C33-773E660D1397'
    } else {
      return ''
    }
  }

  const onSubmit = () => {
    const [processedDate, amount, memo, paymentMethod, status] = getValues([
      'processedDate',
      'amount',
      'memo',
      'paymentMethod',
      'status'
    ])
    if (data === null) {
      postPayment({
        profileId,
        processedDate,
        amount: Number(amount),
        memo,
        paymentType: 2,
        paymentName: 'Additional Payment',
        processor: '53660F30-725B-4484-A70D-C43C35B96362'

        //hard coded until paymentMethod exists on create - as of now defaults to ach on create
        // processor: filterGateway(),
        // paymentMethod: paymentMethod as number
      })
        .unwrap()
        .then(res => {
          if (res) {
            onClose()
          }
        })
    } else if (data) {
      editPayment({
        profileId,
        paymentId: data.enrollmentDetailId,
        processedDate,
        amount: Number(amount),
        memo,
        paymentType: data.paymentType,
        processor: filterGateway(),
        paymentName: data.paymentName,
        status: status as number,
        paymentMethod: paymentMethod as number
      })
        .unwrap()
        .then(res => {
          if (res) {
            onClose()
          }
        })
    }
  }

  const onClose = () => {
    toggle()
  }

  const typeOptions = [
    { label: 'Select One...', value: '', disabled: true },
    {
      label: 'ACH',
      value: 0,
      disabled: paymentData?.filter(payment => payment.accountType === 'ach').length === 0 ? true : false
    },
    {
      label: 'Card',
      value: 1,
      disabled: paymentData?.filter(payment => payment.accountType === 'card').length === 0 ? true : false
    }
  ]

  return (
    <Dialog
      open={open}
      maxWidth='sm'
      sx={{ minHeight: '450px' }}
      fullWidth
      onClose={onClose}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>
        {data ? 'Update' : 'Create New'} Payment
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogTitle>

      {/* Temp fix, need to find a way to choose a different anchor point for react-datepicker, currently causes scroll if dialog too small */}
      <DialogContent sx={{ minHeight: '375px' }}>
        <Box my={2}>
          <form>
            <Grid container spacing={4}>
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <SelectDate
                  name='processedDate'
                  label='Process Date'
                  control={control}
                  errors={errors}
                  required
                  isClearable
                />
              </Grid>
              {data && (
                <>
                  <Grid item xs={12}>
                    <SelectDate name='clearedDate' label='Cleared Date' control={control} disabled />
                  </Grid>
                  <Grid item xs={12}>
                    <SingleSelect name='status' label='Payment Status' control={control} options={EnrollmentOptions} />
                  </Grid>
                </>
              )}
              {data && (
                <Grid item xs={12}>
                  <SingleSelect
                    name='paymentMethod'
                    label='Payment Method'
                    options={typeOptions}
                    control={control}
                    errors={errors}
                    required
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextInput name='amount' label='Amount' control={control} />
              </Grid>
              <Grid item xs={12}>
                <TextInput name='memo' label='Memo' control={control} />
              </Grid>
              {data && (
                <Grid item xs={12}>
                  <TextInput name='description' label='Description' control={control} disabled />
                </Grid>
              )}
            </Grid>
          </form>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant='outlined' onClick={handleSubmit(onSubmit)}>
          {createLoading || editLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
