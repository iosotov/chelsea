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
import Button from '@mui/material/Button'

type EditPaymentDialogProps = {
  data: any
  open: boolean
  handleClose: () => void
}

const paymentTypeOptions = [
  {
    label: 'Bank Account',
    value: 'ach'
  },
  {
    label: 'Debit Card',
    value: 'card'
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
    value: 0
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
    trigger,
    formState: { errors }
  } = editForm

  useEffect(() => {
    if (data) {
      for (let prop in data) {
        setValue(prop, data[prop])
      }
    }
  }, [data])

  const type = data.bankName ? true : false
  const onSubmit = async () => {
    const valid = await trigger()
    valid ? console.log(editForm.getValues()) : console.log('missing fields')
  }

  const onClose = () => {
    editForm.reset()
    handleClose()
  }

  return (
    <Dialog open={open} maxWidth='md' fullWidth onClose={onClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>{data ? 'Update' : 'Create New'} Enrollment Plan</DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <ToggleSwitch
              control={control}
              label='Is this the primary payment method?'
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
                  name='bankAccountName'
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
                <TextInput
                  name='cardNumber'
                  label='Card Number'
                  placeholder='0000 0000 0000 0000'
                  control={control}
                  errors={errors}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextInput
                  name='expiryDate'
                  label='Expiration Date'
                  placeholder='MM/YYYY'
                  control={control}
                  errors={errors}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextInput
                  name='securityCode'
                  label='CVC/CVV'
                  placeholder='000'
                  control={control}
                  errors={errors}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name='name'
                  label='Cardholder Name'
                  placeholder='ex: John Smith'
                  control={control}
                  errors={errors}
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
            <TextInput name='zipCode' label='Zipcode' placeholder='00000' control={control} errors={errors} required />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant='outlined' onClick={onSubmit}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}