import React, { ReactElement } from 'react'

//MUI
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

//Forms
import { useForm } from 'react-hook-form'

//Custom Imports
import TextInput from 'src/views/shared/form-input/text-input'
import SingleSelect from 'src/views/shared/form-input/single-select'
import ToggleSwitch from 'src/views/shared/form-input/toggle-switch'

type Props = {
  type: number
  data: any
  form: any
  paymentMethod: number
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

export default function PaymentFormSubmit({ type, data, form, paymentMethod }: Props): ReactElement {
  const submitForm = useForm({ defaultValues: { ...data } })
  const { control } = submitForm

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h6'>Review</Typography>
        <ToggleSwitch
          control={form.control}
          label='Is this the primary payment method?'
          name='primaryPayment'
          defaultChecked
          disabled={paymentMethod === 2}
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
          InputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='body1'>Payment Information</Typography>
      </Grid>
      {type === 0 ? (
        <>
          <Grid item xs={12} lg={6}>
            <SingleSelect
              name='bankAccountType'
              label='Bank Account Type'
              options={accountTypeOptions}
              control={control}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              name='bankName'
              label='Bank Name'
              placeholder='ex: Chase'
              control={control}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              name='accountName'
              label='Account Holder'
              placeholder='ex: John Smith'
              control={control}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextInput
              name='bankAccountNumber'
              label='Account Number'
              control={control}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextInput
              name='bankRoutingNumber'
              label='Routing Number'
              control={control}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12} lg={6}>
            <SingleSelect
              name='type'
              label='Card Type'
              options={cardOptions}
              control={control}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              name='cardNumber'
              label='Card Number'
              placeholder='0000 0000 0000 0000'
              control={control}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              name='expirationDate'
              label='Expiration Date'
              placeholder='MM/YY'
              control={control}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              name='securityCode'
              label='CVC/CVV'
              placeholder='000'
              control={control}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              name='name'
              label='Cardholder Name'
              placeholder='ex: John Smith'
              control={control}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Typography variant='body1'>Billing Info</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextInput name='address' label='Address' control={control} InputProps={{ readOnly: true }} />
      </Grid>
      <Grid item xs={12}>
        <TextInput name='address2' label='Address 2' control={control} InputProps={{ readOnly: true }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextInput
          name='city'
          label='City'
          placeholder='ex: Churchshire'
          control={control}
          InputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <SingleSelect
          name='state'
          label='State'
          options={stateOptions}
          control={control}
          InputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextInput
          name='zipCode'
          label='Zipcode'
          placeholder='00000'
          control={control}
          InputProps={{ readOnly: true }}
        />
      </Grid>
    </Grid>
  )
}
