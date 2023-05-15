import { ReactElement, useEffect, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { Grid, Typography, Box } from '@mui/material'
import { useForm, useWatch } from 'react-hook-form'
import TextInput from 'src/views/shared/form-input/text-input'
import SingleSelect from 'src/views/shared/form-input/single-select'
import Button from '@mui/material/Button'
import SelectDate from 'src/views/shared/form-input/date-picker'
import IconButton from '@mui/material/IconButton'

import { useAppSelector } from 'src/store/hooks'
import { ProfileInfoType } from 'src/store/api/profileApiSlice'

import format from 'date-fns/format'

import Icon from 'src/@core/components/icon'

import { useGetCampaignsQuery } from 'src/store/api/apiHooks'
import { selectAllCampaigns } from 'src/store/campaignSlice'
import { CampaignType } from 'src/store/api/campaignApiSlice'
import { SingleSelectOption } from 'src/types/forms/selectOptionTypes'

type Props = {
  open: boolean
  toggle: () => void
  data: ProfileInfoType
}

const genderOptions = [
  {
    label: 'Male',
    value: 0
  },
  {
    label: 'Female',
    value: 1
  },
  {
    label: 'Other',
    value: 2
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

export default function PersonalDialog({ open, toggle, data }: Props): ReactElement {
  //assign basevalue of empty string rather than null for react hook forms

  const campaigns = useAppSelector(state => selectAllCampaigns(state))

  const { isSuccess } = useGetCampaignsQuery(
    {
      length: 10000,
      order: [
        {
          columnName: 'campaignName',
          direction: 0
        }
      ],
      start: 0
    },
    { skip: !open }
  )

  const [campaignOptions, setCampaignOptions] = useState<SingleSelectOption[]>([])

  useEffect(() => {
    if (campaigns.length > 0) {
      const mappedCampaigns = campaigns.map((campaign: CampaignType) => {
        const { displayName, campaignId, companyName } = campaign
        return {
          label: `${displayName} - ${companyName}`,
          value: campaignId
        }
      })
      console.log(mappedCampaigns)
      setCampaignOptions(mappedCampaigns)
    }
  }, [campaigns])

  const {
    campaignId = '',
    firstName = '',
    lastName = '',
    middleName = '',
    birthdate = '',
    ssn = '',
    gender = '',
    profileContacts,
    profileAddresses,
    profileCustomFields
  } = data

  // call api for
  const personalForm = useForm({
    defaultValues: {
      campaign: campaignId,
      firstName,
      lastName,
      middleName,
      ssn,
      gender,
      birthdate: new Date(birthdate)
    }
  })

  const {
    formState: { errors },
    control,
    handleSubmit,
    reset,
    setValue
  } = personalForm

  const onClose = () => {
    toggle()
    reset()
  }

  const onSubmit = () => {
    const data = personalForm.getValues()
    console.log(data)
    onClose()
  }

  //clears entry upon campaign Id that doesnt exist
  useEffect(() => {
    if (isSuccess) {
      if (campaignOptions.filter(c => c.value === campaignId).length === 0) {
        setValue('campaign', '')
      }
    }
  }, [isSuccess])

  return (
    <Dialog open={open} maxWidth='xl' fullWidth onClose={onClose} aria-labelledby='profile-personal-dialog'>
      <DialogTitle id='profile-personal-dialog'>
        Update Profile Information
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box my={2}>
          <form>
            <Grid container spacing={4} sx={{ mb: 6 }}>
              <Grid item xs={12} md={6} lg={4}>
                <SingleSelect
                  name='campaign'
                  label='Campaign'
                  defaultLabel='Select Campaign'
                  options={campaignOptions}
                  control={control}
                  errors={errors}
                  required
                />
              </Grid>
              <Grid item xs={0} md={6} lg={8}></Grid>
              <Grid item xs={12}>
                <Typography variant='h6'>Personal Information</Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput label='First Name' name='firstName' control={control} errors={errors} required />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput label='Last Name' name='lastName' control={control} errors={errors} required />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput label='Middle Name' name='middleName' control={control} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <SelectDate label='Birthdate' name='birthdate' errors={errors} control={control} required />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput label='SSN' name='ssn' errors={errors} control={control} required />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <SingleSelect
                  label='Gender'
                  defaultLabel='Select Gender'
                  name='gender'
                  options={genderOptions}
                  control={control}
                  errors={errors}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h6'>Contact Information</Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput
                  label='Primary Phone Number'
                  name='phoneNumber'
                  control={control}
                  placeholder='(123) 456-7890'
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput
                  label='Secondary Phone Number'
                  name='phoneNumber2'
                  control={control}
                  placeholder='(123) 456-7890'
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput label='Email Address' name='email' control={control} placeholder='example@sample.com' />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextInput label='Home Address' name='address1' control={control} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextInput label='Address 2' name='address2' control={control} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput label='City' name='city' control={control} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <SingleSelect
                  label='State'
                  defaultLabel='Select State'
                  name='state'
                  options={stateOptions}
                  control={control}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput label='Zipcode' name='zipCode' control={control} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}></Grid>
              <Grid item xs={12}>
                <Typography variant='h5'>Additional Information</Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput label='Authorized First Name' name='authorizedFirstName' control={control} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput label='Authorized Last Name' name='authorizedLastName' control={control} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput label='Authorized Phone Number' name='authorizedPhoneNumber' control={control} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput label='Authorized Email' name='authorizedEmail' control={control} />
              </Grid>
            </Grid>
          </form>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant='outlined' onClick={handleSubmit(onSubmit)}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
