import { Controller, Control } from 'react-hook-form';
import InputMask from 'react-input-mask';
import TextField from '@mui/material/TextField';
import React from 'react';
import { FormHelperText } from '@mui/material';

interface FieldArrZipCodeProps {
  control: Control<any, any>
  errors?: boolean
  errMsg?: string
  name: string
  label: string
  defaultValue?: string
  required?: boolean
}

const FieldArrZipCode = ({ control, errors = false, name, label, defaultValue, required = false, errMsg = "Please try again" }: FieldArrZipCodeProps) => {
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
          mask="99999"
        >
          <div>

            <TextField
              error={errors}
              label={label}
              fullWidth
            />
            {errors
              ? (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                  {errMsg}
                </FormHelperText>
              )
              : null}
          </div>
        </InputMask>
      )}
    />
  );
};

export default FieldArrZipCode;
