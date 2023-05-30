import { Box, Grid, } from '@mui/material'
import React from 'react'

// ** Third Party Imports
import { Control, FieldErrors, useFieldArray } from 'react-hook-form'
import { AdditionalInformationForm } from 'src/pages/profiles/create'
import TextInput from 'src/views/shared/form-input/text-input'

interface AdditionalInformationProps {
  control: Control<AdditionalInformationForm, any>
  errors: FieldErrors<AdditionalInformationForm>
}

function AdditionalInformation({ control, errors }: AdditionalInformationProps) {

  const { fields } = useFieldArray({
    name: "customFields",
    control,
  });

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4} mb={6}>
        {fields.map((field, index) => {
          return (
            <Grid key={field.customFieldId} item xs={12} md={6} >
              <TextInput name={`customFields.${index}.value`} label={field.fieldName} control={control} errors={errors} />
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default AdditionalInformation
