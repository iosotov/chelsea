import { ReactElement, useEffect, useState } from 'react'

//MUI
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import TextInput from 'src/views/shared/form-input/text-input'

//Dialog
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

//Custom Components
import SingleSelect from 'src/views/shared/form-input/single-select'
import SelectDate from 'src/views/shared/form-input/date-picker'

//Forms
import { useForm } from 'react-hook-form'

//Custom Imports
import Icon from 'src/@core/components/icon'

//API Hooks
import { useAppSelector } from 'src/store/hooks'
import { useGetCampaignsQuery, usePutProfileUpdateMutation } from 'src/store/api/apiHooks'

//API Slices
import { selectAllCampaigns } from 'src/store/campaignSlice'

//Types
import { CampaignType } from 'src/store/api/campaignApiSlice'
import { ProfileInfoType } from 'src/store/api/profileApiSlice'
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

  const [editProfile, editProfileStatus] = usePutProfileUpdateMutation()

  const { isSuccess: editProfileSuccess } = editProfileStatus

  useEffect(() => {
    if (campaigns.length > 0) {
      const mappedCampaigns = campaigns.map((campaign: CampaignType) => {
        const { displayName, campaignId, companyName } = campaign

        return {
          label: `${displayName} - ${companyName}`,
          value: campaignId
        }
      })
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
    gender = 0,
    profileAddresses = [],
    profileContacts = [],
    profileId
  } = data

  // call api for
  const personalForm = useForm({
    defaultValues: {
      campaignId: campaignId,
      firstName,
      lastName,
      middleName,
      ssn,
      gender,
      birthdate: new Date(birthdate),
      address1: profileAddresses?.[0]?.address1,
      address2: profileAddresses?.[0]?.address2,
      city: profileAddresses?.[0]?.city,
      state: profileAddresses?.[0]?.state,
      zipCode: profileAddresses?.[0]?.zipCode,
      email: profileContacts.filter(e => e.contactId === 'c7713ff2-1bea-4f69-84c0-404e0e5fb0bd')?.[0]?.value,
      phoneNumber: profileContacts.filter(e => e.contactId === '5f2421ec-6016-4355-92aa-67dd5f2c8abc')?.[0]?.value,
      phoneNumber2: profileContacts.filter(e => e.contactId === '88262882-9a7e-4a78-b70c-82036b6c3a45')?.[0]?.value
    }
  })

  const {
    formState: { errors },
    control,
    handleSubmit,
    reset,
    setValue,
    getValues
  } = personalForm

  const onClose = () => {
    toggle()
    reset()
  }

  const onSubmit = () => {
    const data = {
      profileId,
      campaignId: getValues('campaignId'),
      firstName: getValues('firstName'),
      lastName: getValues('lastName'),
      middleName: getValues('middleName'),
      ssn: getValues('ssn'),
      birthdate: getValues('birthdate'),
      gender: getValues('gender'),
      profileAddresses: [
        {
          addressId: '133898fc-bbe4-4556-8694-a6291e045907',
          address1: getValues('address1'),
          address2: getValues('address2'),
          city: getValues('city'),
          state: getValues('state'),
          zipCode: getValues('zipCode')
        }
      ],
      profileContacts: [
        {
          contactId: '5f2421ec-6016-4355-92aa-67dd5f2c8abc',
          value: getValues('phoneNumber')
        },
        {
          contactId: '88262882-9a7e-4a78-b70c-82036b6c3a45',
          value: getValues('phoneNumber2')
        },
        {
          contactId: 'c7713ff2-1bea-4f69-84c0-404e0e5fb0bd',
          value: getValues('email')
        }
      ]
    }
    editProfile(data)
      .unwrap()
      .then(res => {
        if (res) {
          onClose()
        }
      })
  }

  //clears entry upon campaign Id that doesnt exist
  useEffect(() => {
    if (isSuccess && campaignOptions.length > 0) {
      if (campaignOptions.filter(c => c.value === campaignId).length === 0) {
        setValue('campaignId', '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  name='campaignId'
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
                <TextInput label='Home Address' name='address1' control={control} errors={errors} required />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextInput label='Address 2' name='address2' control={control} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput label='City' name='city' control={control} errors={errors} required />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <SingleSelect
                  label='State'
                  defaultLabel='Select State'
                  name='state'
                  options={stateOptions}
                  control={control}
                  errors={errors}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextInput label='Zipcode' name='zipCode' control={control} errors={errors} required />
              </Grid>
              <Grid item xs={12} md={6} lg={4}></Grid>
            </Grid>
          </form>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={editProfileSuccess} variant='outlined' onClick={handleSubmit(onSubmit)}>
          {editProfileSuccess ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
