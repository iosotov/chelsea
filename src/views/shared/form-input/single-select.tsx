import React from 'react'
import { FormControl, InputLabel, MenuItem, Select, FormHelperText } from '@mui/material'
import { Controller } from 'react-hook-form'

type Options = {
  label: string
  value: string | number
  disabled?: boolean
}

type Props = {
  name: string
  control: any
  label: string
  options: Options[]
  props?: any
  defaultValue?: string | number
  defaultLabel?: string
  required?: boolean
  errors?: any
  disabled?: boolean
  // onChange?: Function
}

export default function SingleSelect({
  name,
  control,
  label,
  defaultLabel,
  options,
  required,
  defaultValue,
  errors,
  // onChange,
  ...props
}: Props) {
  const generateOptions = () => {
    return options.map(option => {
      return (
        <MenuItem key={option.value} value={option.value} disabled={option.disabled ?? false}>
          {option.label}
        </MenuItem>
      )
    })
  }

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ''}
        rules={{ required: required ?? false }}
        render={({ field: { onChange, value } }) => (
          <Select
            onChange={onChange}
            label={label}
            value={value}
            error={errors ? Boolean(errors[name]) : false}
            {...props}
          >
            {generateOptions()}
          </Select>
        )}
      />
      {errors
        ? errors[name] && (
            <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
              This field is required
            </FormHelperText>
          )
        : null}
    </FormControl>
  )
}
