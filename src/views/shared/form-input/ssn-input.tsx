import { Controller, Control, FieldErrors } from 'react-hook-form';
import InputMask from 'react-input-mask';
import TextField from '@mui/material/TextField';
import React from 'react';
import { FormHelperText } from '@mui/material';

interface SSNInputProps {
  control: Control<any, any>
  errors?: FieldErrors<any>
  name: string
  label: string
  defaultValue?: string
}

const SSNInput = ({ control, errors, name, label, defaultValue }: SSNInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? ''}
      render={({ field: { onChange, value } }) => (
        <InputMask
          onChange={onChange}
          value={value}
          mask="999-99-9999"
        >
          <div>
            <TextField
              error={errors ? Boolean(errors[name]) : false}
              label={label}
              fullWidth
            />
            {errors
              ? errors[name] && (
                <FormHelperText sx={{ color: 'error.main', ml: 4 }} id='validation-basic-select'>
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

export default SSNInput;
