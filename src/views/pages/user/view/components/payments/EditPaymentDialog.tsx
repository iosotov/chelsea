import { ReactElement, useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { Grid, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import TextInput from 'src/views/shared/form-input/text-input'
import SingleSelect from 'src/views/shared/form-input/single-select'
import ToggleSwitch from 'src/views/shared/form-input/toggle-switch'
import CreditCard from 'src/views/shared/form-input/credit-card'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import {
  usePutBankAccountUpdateMutation,
  usePutCreditCardUpdateMutation,
  usePutEnrollmentPaymentMethodMutation
} from 'src/store/api/apiHooks'
import { BankAccountUpdateType } from 'src/store/api/bankAccountApiSlice'
import { CreditCardUpdateType } from 'src/store/api/creditCardApiSlice'

type EditPaymentDialogProps = {
  data: any
  open: boolean
  handleClose: () => void
}

const paymentTypeOptions = [
  {
    label: 'Bank Account',
    value: 0
  },
  {
    label: 'Debit Card',
    value: 1
  }
]

const accountTypeOptions = [
  {
    label: 'Savings Account',
    value: 0
  },
  {
    label: 'Checking Account',
    value: 1
  }
]
const cardOptions = [
  {
    label: 'Debit Card',
    value: 1
  }
]

const stateOptions = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'District Of Columbia', value: 'DC' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' }
]

export default function EditPaymentDialog({ data, open, handleClose }: EditPaymentDialogProps): ReactElement {
  const editForm = useForm()

  const {
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors }
  } = editForm

  const type = data.bankName ? true : false

  const [editBank, { isLoading: bankLoading }] = usePutBankAccountUpdateMutation()
  const [editCard, { isLoading: cardLoading }] = usePutCreditCardUpdateMutation()
  const [setMethod, { isLoading: methodLoading }] = usePutEnrollmentPaymentMethodMutation()

  useEffect(() => {
    if (data) {
      setValue('expirationDate', `${data.expirationMonth}/${data.expirationYear}`)
      for (const prop in data) {
        setValue(prop, data[prop])
      }
    }
  }, [data, setValue])

  useEffect(() => {
    if (open) {
      setValue('paymentType', type ? 0 : 1)
    }
  }, [open, type, setValue])

  const onSubmit = () => {
    const { profileId } = data
    const formData = getValues()
    const makePrimary: boolean = formData.primaryPayment
    const paymentMethod: number = formData.paymentType

    if (type) {
      const bankData: BankAccountUpdateType = {
        bankAccountId: formData.bankAccountId,
        bankRoutingNumber: formData.bankRoutingNumber,
        bankName: formData.bankName,
        bankAccountNumber: formData.bankAccountNumber,
        bankAccountType: formData.bankAccountType,
        address: formData.address,
        address2: formData.address2,
        city: formData.city,
        zipcode: formData.zipcode,
        state: formData.state,
        accountName: formData.accountName
      }

      editBank(bankData)
        .unwrap()
        .then(res => {
          if (res) {
            if (makePrimary) {
              setMethod({ profileId, paymentMethod })
                .unwrap()
                .then(res => {
                  if (res) {
                    onClose()
                  }
                })
            } else {
              onClose()
            }
          }
        })
    } else if (!type) {
      formData.cardNumber = formData.cardNumber.split(' ').join('')

      const [month, year] = formData.expirationDate.split('/')
      formData.expirationMonth = month
      formData.expirationYear = year

      const creditData: CreditCardUpdateType = {
        creditCardId: formData.creditCardId,
        name: formData.name,
        type: formData.type,
        cardNumber: formData.cardNumber,
        expirationMonth: month,
        expirationYear: year,
        securityCode: formData.securityCode,
        address: formData.address,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode
      }

      editCard(creditData)
        .unwrap()
        .then(res => {
          if (res) {
            if (makePrimary) {
              setMethod({ profileId, paymentMethod })
                .unwrap()
                .then(res => {
                  if (res) {
                    onClose()
                  }
                })
            } else {
              onClose()
            }
          }
        })
    }
  }

  const onClose = () => {
    editForm.reset()
    handleClose()
  }

  return (
    <Dialog open={open} maxWidth='md' fullWidth onClose={onClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>
        Edit {data.accountType === 'ach' ? 'Bank ' : 'Card '}
        Information
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <ToggleSwitch
              control={control}
              label='Set as primary payment method?'
              name='primaryPayment'
              defaultChecked={false}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body1'>Payment Type</Typography>
          </Grid>
          <Grid item xs={12} lg={6}>
            <SingleSelect
              name='paymentType'
              label='Payment Type'
              options={paymentTypeOptions}
              control={control}
              errors={errors}
              InputProps={{ readOnly: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body1'>Payment Information</Typography>
          </Grid>
          {type ? (
            <>
              <Grid item xs={12} lg={6}>
                <SingleSelect
                  name='bankAccountType'
                  label='Bank Account Type'
                  options={accountTypeOptions}
                  control={control}
                  errors={errors}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name='bankName'
                  label='Bank Name'
                  placeholder='ex: Chase'
                  control={control}
                  errors={errors}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name='accountName'
                  label='Account Holder'
                  placeholder='ex: John Smith'
                  control={control}
                  errors={errors}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput name='bankAccountNumber' label='Account Number' control={control} errors={errors} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput name='bankRoutingNumber' label='Routing Number' control={control} errors={errors} required />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} lg={6}>
                <SingleSelect name='type' label='Card Type' options={cardOptions} control={control} errors={errors} />
              </Grid>
              <Grid item xs={12}>
                <CreditCard
                  name='cardNumber'
                  label='Card Number'
                  placeholder='0000 0000 0000 0000'
                  errors={errors}
                  control={control}
                  type='number'
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <CreditCard
                  name='expirationDate'
                  label='Expiration Date'
                  placeholder='MM/YY'
                  errors={errors}
                  control={control}
                  type='expiry'
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <CreditCard
                  name='securityCode'
                  label='CVC/CVV'
                  placeholder='000'
                  errors={errors}
                  control={control}
                  type='cvc'
                  required
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Typography variant='body1'>Billing Info</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextInput name='address' label='Address' control={control} errors={errors} required />
          </Grid>
          <Grid item xs={12}>
            <TextInput name='address2' label='Address 2' control={control} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              name='city'
              label='City'
              placeholder='ex: Churchshire'
              control={control}
              errors={errors}
              required
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <SingleSelect
              name='state'
              label='State'
              options={stateOptions}
              control={control}
              errors={errors}
              required
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextInput name='zipcode' label='Zipcode' placeholder='00000' control={control} errors={errors} required />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={bankLoading || cardLoading || methodLoading}
          variant='outlined'
          onClick={handleSubmit(onSubmit)}
        >
          {bankLoading || cardLoading || methodLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
