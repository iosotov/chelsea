import { Controller, Control, FieldErrors } from 'react-hook-form';
import InputMask from 'react-input-mask';
import TextField from '@mui/material/TextField';
import React from 'react';
import { FormHelperText } from '@mui/material';

interface PhoneNumberInputProps {
  control: Control<any, any>
  errors?: FieldErrors<any>
  name: string
  label: string
  defaultValue?: string
  required?: boolean
}

const PhoneNumberInput = ({ control, errors, name, label, defaultValue, required = false }: PhoneNumberInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required,
          message: 'Required'
        }
      }}
      defaultValue={defaultValue ?? ''}
      render={({ field: { onChange, value } }) => (
        <InputMask
          onChange={onChange}
          value={value}
          mask="(999) 999-9999"
        >
          <div>

            <TextField
              error={errors ? Boolean(errors[name]) : false}
              label={label}
              type='tel'
              fullWidth
            />
            {errors
              ? errors[name] && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                  {errors[name]?.message ? `${errors[name]?.message}` : "This field is required"}
                </FormHelperText>
              )
              : null}
          </div>
        </InputMask>
      )}
    />
  );
};

export default PhoneNumberInput;
