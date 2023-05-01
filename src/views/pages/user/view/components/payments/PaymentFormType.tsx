import { ReactElement } from 'react'
import SingleSelect from 'src/views/shared/form-input/single-select'

import { Typography, Box, Grid } from '@mui/material'

type Props = {
  control: any
  errors: any
}

const options = [
  {
    label: 'Bank Account',
    value: 'ach'
  },
  {
    label: 'Debit Card',
    value: 'card'
  }
]

export default function PaymentFormType({ control, errors }: Props): ReactElement {
  return (
    <Grid container sx={{ width: '100%' }} spacing={4}>
      <Grid item xs={12}>
        <Typography variant='body2'>Select a type to continue</Typography>
      </Grid>
      <Grid item xs={12} md={8} lg={6}>
        <SingleSelect
          name='paymentType'
          label='Payment Type'
          options={options}
          errors={errors}
          control={control}
          required
        />
      </Grid>
    </Grid>
  )
}
