import { Controller, Control, FieldErrors } from 'react-hook-form'
import InputMask from 'react-input-mask'
import TextField from '@mui/material/TextField'
import React from 'react'
import { FormHelperText } from '@mui/material'
import { PersonalInformationForm } from 'src/views/pages/user/view/create/validators'

interface DateFieldProps {
  control: Control<any, any>
  errors?: FieldErrors<PersonalInformationForm>
  name: keyof PersonalInformationForm
  label: string
  defaultValue?: string
}

const DateField = ({ control, errors, name, label, defaultValue }: DateFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? ''}
      render={({ field: { onChange, value } }) => (
        <InputMask onChange={onChange} value={value} mask='9999-99-99'>
          <div>
            <TextField
              error={errors ? Boolean(errors[name]) : false}
              label={label}
              placeholder='YYYY-MM-DD'
              fullWidth
            />
            {errors
              ? errors[name] && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                    {errors[name]?.message ? `${errors[name]?.message}` : 'This field is required'}
                  </FormHelperText>
                )
              : null}
          </div>
        </InputMask>
      )}
    />
  )
}

export default DateField
