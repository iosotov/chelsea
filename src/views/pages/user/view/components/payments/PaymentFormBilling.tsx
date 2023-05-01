import { Grid, Typography } from '@mui/material'
import { ReactElement } from 'react'
import SingleSelect from 'src/views/shared/form-input/single-select'
import TextInput from 'src/views/shared/form-input/text-input'

type Props = {
  control: any
  errors: any
}

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

export default function PaymentFormBilling({ control, errors }: Props): ReactElement {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant='h6'>Billing Info</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextInput
          name='address'
          label='Address'
          placeholder='ex: 123 Abingdon Way'
          errors={errors}
          control={control}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextInput name='address2' label='Address 2' errors={errors} control={control} />
      </Grid>
      <Grid item xs={6}>
        <TextInput name='city' label='City' placeholder='ex: Churchshire' errors={errors} control={control} required />
      </Grid>
      <Grid item xs={3}>
        <SingleSelect name='state' label='State' options={stateOptions} errors={errors} control={control} required />
      </Grid>
      <Grid item xs={3}>
        <TextInput name='zipCode' label='Zipcode' placeholder='00000' errors={errors} control={control} required />
      </Grid>
    </Grid>
  )
}
