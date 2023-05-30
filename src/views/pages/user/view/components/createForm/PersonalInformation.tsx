import { Box, Grid, } from '@mui/material'
import React from 'react'

// ** Third Party Imports
import { Control, FieldErrors } from 'react-hook-form'
import FallbackSpinner from 'src/@core/components/spinner'
import { PersonalInformationForm } from 'src/pages/profiles/create/validators'
import { useGetCampaignsQuery } from 'src/store/api/apiHooks'
import { selectAllCampaignOptions } from 'src/store/campaignSlice'
import { useAppSelector } from 'src/store/hooks'
import SingleSelect from 'src/views/shared/form-input/single-select'
import SSNInput from 'src/views/shared/form-input/ssn-input'
import TextInput from 'src/views/shared/form-input/text-input'



interface PersonalInformationProps {
  control: Control<PersonalInformationForm, any>
  errors: FieldErrors<PersonalInformationForm>
}
function PersonalInformation({ control, errors }: PersonalInformationProps) {

  const { isSuccess, isError } = useGetCampaignsQuery({})
  const options = useAppSelector(state => selectAllCampaignOptions(state))
  const genders = ["Male", "Female", "Other"].map((g, i) => ({ label: g, value: i }))

  if (isError) return <div>error</div>

  if (isSuccess) return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4} mb={6}>
        <Grid item xs={12} md={6} >
          <SingleSelect options={options} name='campaignId' label='Campaign' control={control} errors={errors} />
        </Grid>
        <Grid item xs={0} md={6} >
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput name='firstName' label='First Name' control={control} errors={errors} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput name='middleName' label='Middle Name' control={control} errors={errors} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput name='lastName' label='Last Name' control={control} errors={errors} />
        </Grid>
        <Grid item xs={12} md={6}>
          <SingleSelect name='gender' label='Gender' options={genders} control={control} errors={errors} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput type='date' name="birthdate" label="" errors={errors} control={control} />
        </Grid>
        <Grid item xs={12} md={6}>
          <SSNInput name='ssn' label='Social Security' control={control} errors={errors} />
        </Grid>
      </Grid>
    </Box>

  )

  return <FallbackSpinner />
}

export default PersonalInformation
