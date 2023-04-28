import { ReactElement } from 'react'
import SingleSelect from 'src/views/shared/form-input/single-select'
import TextInput from 'src/views/shared/form-input/text-input'

import { Typography, Grid } from '@mui/material'

type Props = {
  control: any
  errors: any
  type: string
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
    value: 0
  }
]

export default function PaymentFormInformation({ control, errors, type }: Props): ReactElement {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h6'>{type === 'ach' ? 'Bank' : 'Debit Card'} Information</Typography>
      </Grid>
      {type === 'ach' ? (
        <>
          <Grid item xs={12} md={8} lg={6}>
            <SingleSelect
              name='bankAccountType'
              label='Bank Account Type'
              options={options}
              errors={errors}
              control={control}
              required
            />
          </Grid>
          <Grid item xs={0} lg={6}></Grid>
          <Grid item xs={12} lg={6}>
            <TextInput
              name='bankAccountName'
              label='Account Holder'
              placeholder='ex: John Smith'
              errors={errors}
              control={control}
              required
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextInput
              name='bankName'
              label='Bank Name'
              placeholder='ex: Chase'
              errors={errors}
              control={control}
              required
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextInput name='accountNumber' label='Account Number' errors={errors} control={control} required />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextInput name='routingNumber' label='Routing Number' errors={errors} control={control} required />
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12} md={8} lg={6}>
            <SingleSelect
              name='type'
              label='Card Type'
              options={cardOptions}
              errors={errors}
              control={control}
              required
            />
          </Grid>
          <Grid item xs={0} lg={6}></Grid>
          <Grid item xs={12} lg={6}>
            <TextInput
              name='bankName'
              label='Bank Name'
              placeholder='ex: Chase'
              errors={errors}
              control={control}
              required
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextInput
              name='cardNumber'
              label='Card Number'
              placeholder='0000 0000 0000 0000'
              errors={errors}
              control={control}
              required
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextInput name='routingNumber' label='Routing Number' errors={errors} control={control} required />
          </Grid>
          <Grid item xs={12} lg={6}>
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
