import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

//MUI Imports
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

//Third Party Imports
import { useForm } from 'react-hook-form'

//Custom Components
import SingleSelect from 'src/views/shared/form-input/single-select'
import TextInput from 'src/views/shared/form-input/text-input'
import SelectDate from 'src/views/shared/form-input/date-picker'

//API Imports
import { useGetCampaignsQuery, usePostProfileCreateMutation } from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { selectAllCampaigns } from 'src/store/campaignSlice'

//Imported Types
import { CampaignType } from 'src/store/api/campaignApiSlice'
import { SingleSelectOption } from 'src/types/forms/selectOptionTypes'

//Dropdown Options
import { stateOptions, genderOptions } from 'src/views/shared/options/shared'

export default function CreateProfile() {
  const router = useRouter()
  const profileForm = useForm()

  const {
    handleSubmit,
    getValues,
    control,
    formState: { errors }
  } = profileForm

  const [postProfile, postProfileStatus] = usePostProfileCreateMutation()

  const { isLoading } = postProfileStatus

  const onSubmit = async () => {
    const data = {
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
    const profile = await postProfile(data).unwrap()

    if (typeof profile === 'string') {
      router.push({
        pathname: `/profiles/${profile}/debts/`
      })
      profileForm.reset()
    }
  }

  const campaigns = useAppSelector(state => selectAllCampaigns(state))

  useGetCampaignsQuery({
    length: 10000,
    order: [
      {
        columnName: 'campaignName',
        direction: 0
      }
    ],
    start: 0
  })

  const [campaignOptions, setCampaignOptions] = useState<SingleSelectOption[]>([])

  //Maps campaigns data to usable label/value for campaign select dropdown
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

  return (
    <Card>
      <CardContent>
        <Typography variant='h5'>Create New Profile</Typography>
        <Divider sx={{ my: 4 }}></Divider>

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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button disabled={isLoading} color='primary' variant='outlined' onClick={handleSubmit(onSubmit)}>
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}
