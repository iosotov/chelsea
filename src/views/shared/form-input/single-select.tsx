import React from 'react'
import { FormControl, InputLabel, MenuItem, Select, FormHelperText } from '@mui/material'
import { Controller } from 'react-hook-form'
import { SingleSelectOption } from 'src/types/forms/selectOptionTypes'

type Props = {
  name: string
  control: any
  label: string
  options?: SingleSelectOption[]
  props?: any
  defaultValue?: string | number | boolean
  defaultLabel?: string
  required?: boolean
  errors?: any
  disabled?: boolean
  placeholder?: string
  InputProps?: any
}

export default function SingleSelect({
  name,
  control,
  label,
  options,
  required,
  defaultValue,
  errors,
  InputProps,
  ...props
}: Props) {
  const generateOptions = () => {
    if (!options) return

    return options.map(option => {
      return (
        <MenuItem key={`${option.label}-${option.value}`} value={option.value} disabled={option.disabled ?? false}>
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
        render={({ field }) => (
          <Select
            label={label}
            error={errors ? Boolean(errors[name]) : false}
            inputProps={InputProps}
            {...props}
            {...field}
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
