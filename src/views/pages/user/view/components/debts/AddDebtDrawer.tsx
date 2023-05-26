//MUI
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

//Custom Styling
import { styled } from '@mui/material'
import { BoxProps } from '@mui/material/Box'

//Icons
import Icon from 'src/@core/components/icon'

//Custom Components
import SingleSelect from 'src/views/shared/form-input/single-select'
import TextInput from 'src/views/shared/form-input/text-input'

//Forms
import { useForm } from 'react-hook-form'
import { useAppSelector } from 'src/store/hooks'
import { selectSettingByTypeOptions } from 'src/store/settingSlice'
import { usePostLiabilityCreateMutation, usePostSettingSearchQuery } from 'src/store/api/apiHooks'
import { LiabilityCreateType } from 'src/store/api/liabilityApiSlice'

type Props = {
  open: boolean
  toggle: () => void
  profileId: string
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

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

export default function AddDebtDrawer({ open, toggle, profileId }: Props) {
  const debtForm = useForm()

  //API Call
  usePostSettingSearchQuery({ length: 10000, start: 0 }, { skip: !open })
  const [createDebt, { isLoading }] = usePostLiabilityCreateMutation()

  //Redux State
  const debtOptions = useAppSelector(state => selectSettingByTypeOptions(state, 4))

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors }
  } = debtForm

  const handleClose = () => {
    reset()
    toggle()
  }

  const onSubmit = () => {
    console.log(getValues())
    const data: LiabilityCreateType = getValues() as LiabilityCreateType
    createDebt({ ...data, profileId })
    handleClose()
  }

  return (
    <>
      <Drawer
        anchor='right'
        open={open}
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
      >
        <Header>
          <Typography variant='h6'>Add Debt</Typography>
          <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 4 }}>
          <Grid container spacing={4} mb={6}>
            <Grid item xs={12}>
              <TextInput name='name' label='Creditor' control={control} errors={errors} required />
            </Grid>
            <Grid item xs={12}>
              <TextInput name='accountNumber' label='Account Number' control={control} errors={errors} required />
            </Grid>
            <Grid item xs={12}>
              <TextInput name='originalBalance' label='Balance' control={control} />
            </Grid>
            <Grid item xs={12}>
              <SingleSelect
                name='type'
                label='Debt Type'
                control={control}
                errors={errors}
                options={debtOptions}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput name='address1' label='Address' control={control} />
            </Grid>
            <Grid item xs={12}>
              <TextInput name='address2' label='Address 2' control={control} />
            </Grid>
            <Grid item xs={12}>
              <TextInput name='city' label='City' control={control} />
            </Grid>
            <Grid item xs={12}>
              <SingleSelect name='state' label='State' control={control} options={stateOptions} />
            </Grid>
            <Grid item xs={12}>
              <TextInput name='zipCode' label='Zipcode' control={control} />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} variant='outlined' onClick={handleSubmit(onSubmit)}>
              {isLoading ? 'Saving...' : 'Confirm'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
