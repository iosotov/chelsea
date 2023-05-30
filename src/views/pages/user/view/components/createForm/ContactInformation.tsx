import { Box, Grid, Stack, Typography, } from '@mui/material'
import React from 'react'

// ** Third Party Imports
import { Control, FieldArrayWithId, FieldErrors, useFieldArray } from 'react-hook-form'
import { AdditionalInformationForm } from 'src/pages/profiles/create'
import FieldArrSingleSelect from 'src/views/shared/form-input/fieldArr-single-select'
import FieldArrTextInput from 'src/views/shared/form-input/fieldArr-text-input'
import { stateOptions } from '../debts/AddDebtDrawer'
import FieldArrZipCode from 'src/views/shared/form-input/FieldArr-zip-code'
import FieldArrEmailInput from 'src/views/shared/form-input/fieldArr-email-select'
import FieldArrPhoneNumberInput from 'src/views/shared/form-input/fieldArr-phone-number'

interface AdditionalInformationProps {
  control: Control<AdditionalInformationForm, any>
  errors: FieldErrors<AdditionalInformationForm>
}

function ContactInformation({ control, errors }: AdditionalInformationProps) {

  const { fields: contactSettings } = useFieldArray({
    name: "profileContacts",
    control,
  });

  const { fields: addressSettings } = useFieldArray({
    name: "profileAddresses",
    control,
  });

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='body2' sx={{ mb: 4 }}>Contact Information</Typography>
      <Grid container spacing={4} mb={6}>
        {contactSettings.map((field, index) => {
          return field.active ? (
            <Grid key={field.id} item xs={12} md={6} >
              <ContactForm field={field} index={index} errors={errors} control={control} />
            </Grid>
          ) : ""
        })}
      </Grid>
      {addressSettings.map((field, index) => {
        return field.active ? (
          <AddressForm key={field.id} field={field} index={index} errors={errors} control={control} />
        ) : ""
      })}
    </Box>
  )

}

interface ContactFormProps {
  field: FieldArrayWithId<AdditionalInformationForm, "profileContacts", "id">
  index: number
  errors: FieldErrors<AdditionalInformationForm>
  control: Control<AdditionalInformationForm, any>
}

function ContactForm({ field, index, errors, control }: ContactFormProps) {

  return field.type === 1 ? (
    <FieldArrEmailInput
      name={`profileContacts.${index}.value`}
      label={field.name}
      control={control}
      required={field.required}
      errors={errors?.profileContacts && errors?.profileContacts.length && errors?.profileContacts[index]?.value ? true : false}
      errMsg={(errors?.profileContacts && errors?.profileContacts.length && errors?.profileContacts[index]?.value) ? errors?.profileContacts[index]?.value?.message : ""}
    />
  ) : (
    <FieldArrPhoneNumberInput
      name={`profileContacts.${index}.value`}
      label={field.name}
      control={control}
      required={field.required}
      errors={errors?.profileContacts && errors?.profileContacts.length && errors?.profileContacts[index]?.value ? true : false}
      errMsg={(errors?.profileContacts && errors?.profileContacts.length && errors?.profileContacts[index]?.value) ? errors?.profileContacts[index]?.value?.message : ""}
    />
  )
}

interface AddressFormProps {
  field: FieldArrayWithId<AdditionalInformationForm, "profileAddresses", "id">
  index: number
  errors: FieldErrors<AdditionalInformationForm>
  control: Control<AdditionalInformationForm, any>
}

function AddressForm({ field, index, errors, control }: AddressFormProps) {

  return (
    <Stack >
      <Typography variant='body2' sx={{ mb: 4 }}>{field.name}</Typography>
      <Grid container spacing={4} mb={6}>
        <Grid key={field.id} item xs={12} >
          <FieldArrTextInput
            name={`profileAddresses.${index}.address1`}
            label={"Adress 1"}
            required={index === 0}
            control={control}
            errors={errors?.profileAddresses && errors?.profileAddresses.length && errors?.profileAddresses[index]?.address1 ? true : false}
            errMessage={(errors?.profileAddresses && errors?.profileAddresses.length && errors?.profileAddresses[index]?.address1) ? errors?.profileAddresses[index]?.address1?.message : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <FieldArrTextInput
            name={`profileAddresses.${index}.address2`}
            label={"Address 2"}
            control={control}
            errors={errors?.profileAddresses && errors?.profileAddresses.length && errors?.profileAddresses[index]?.address2 ? true : false}
            errMessage={(errors?.profileAddresses && errors?.profileAddresses.length && errors?.profileAddresses[index]?.address2) ? errors?.profileAddresses[index]?.address2?.message : ""}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <FieldArrTextInput
            name={`profileAddresses.${index}.city`}
            label={"City"}
            control={control}
            required={index === 0}
            errors={errors?.profileAddresses && errors?.profileAddresses.length && errors?.profileAddresses[index]?.city ? true : false}
            errMessage={(errors?.profileAddresses && errors?.profileAddresses.length && errors?.profileAddresses[index]?.city) ? errors?.profileAddresses[index]?.city?.message : ""}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FieldArrSingleSelect
            options={stateOptions}
            name={`profileAddresses.${index}.state`}
            label={"State"}
            required={index === 0}
            control={control}
            errors={errors?.profileAddresses && errors?.profileAddresses.length && errors?.profileAddresses[index]?.state ? true : false}
            errMsg={(errors?.profileAddresses && errors?.profileAddresses.length && errors?.profileAddresses[index]?.state) ? errors?.profileAddresses[index]?.state?.message : ""}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FieldArrZipCode
            name={`profileAddresses.${index}.zipCode`}
            label={"Zip Code"}
            required={index === 0}
            control={control}
            errors={errors?.profileAddresses && errors?.profileAddresses.length && errors?.profileAddresses[index]?.zipCode ? true : false}
            errMsg={(errors?.profileAddresses && errors?.profileAddresses.length && errors?.profileAddresses[index]?.zipCode) ? errors?.profileAddresses[index]?.zipCode?.message : ""}
          />
        </Grid>
      </Grid>
    </Stack>

  )
}


export default ContactInformation






