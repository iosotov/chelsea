import { ReactElement } from 'react'

//MUI
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

//API Hooks
import { useAppSelector } from 'src/store/hooks'

//Redux Store
import { selectPaymentsByProfileId } from 'src/store/bankAccountSlice'

//Custom Import
import SingleSelect from 'src/views/shared/form-input/single-select'

type Props = {
  control: any
  errors: any
  profileId: string
}

export default function PaymentFormType({ control, errors, profileId }: Props): ReactElement {
  const paymentData = useAppSelector(state => selectPaymentsByProfileId(state, String(profileId)))
  const options = [
    {
      label: 'Bank Account',
      value: 0,
      disabled: paymentData?.filter(payment => payment.accountType === 'ach').length > 0 ? true : false
    },
    {
      label: 'Debit Card',
      value: 1,
      disabled: paymentData?.filter(payment => payment.accountType === 'card').length > 0 ? true : false
    }
  ]

  console.log(paymentData)

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
