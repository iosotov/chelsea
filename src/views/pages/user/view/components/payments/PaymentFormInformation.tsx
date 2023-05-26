import { ReactElement } from 'react'
import SingleSelect from 'src/views/shared/form-input/single-select'
import TextInput from 'src/views/shared/form-input/text-input'
import CreditCard from 'src/views/shared/form-input/credit-card'

import { Typography, Grid } from '@mui/material'

type Props = {
  control: any
  errors: any
  type: number
}

const options = [
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

export default function PaymentFormInformation({ control, errors, type }: Props): ReactElement {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h6'>{type === 0 ? 'Bank' : 'Card'} Information</Typography>
      </Grid>
      {type === 0 ? (
        <>
          <Grid item xs={12} lg={6}>
            <SingleSelect
              name='bankAccountType'
              label='Bank Account Type'
              options={options}
              errors={errors}
              control={control}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              name='bankName'
              label='Bank Name'
              placeholder='ex: Chase'
              errors={errors}
              control={control}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              name='accountName'
              label='Account Holder'
              placeholder='ex: John Smith'
              errors={errors}
              control={control}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput name='bankAccountNumber' label='Account Number' errors={errors} control={control} required />
          </Grid>
          <Grid item xs={6}>
            <TextInput name='bankRoutingNumber' label='Routing Number' errors={errors} control={control} required />
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12} lg={6}>
            <SingleSelect
              name='type'
              label='Card Type'
              options={cardOptions}
              errors={errors}
              control={control}
              required
            />
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
          <Grid item xs={12}>
            <TextInput
              name='name'
              label='Cardholder Name'
              placeholder='ex: John Smith'
              errors={errors}
              control={control}
              required
            />
          </Grid>
        </>
      )}
    </Grid>
  )
}
