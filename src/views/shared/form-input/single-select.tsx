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
  defaultValue?: string | number
  defaultLabel?: string
  required?: boolean
  errors?: any
  disabled?: boolean
  placeholder?: string
}

export default function SingleSelect({
  name,
  control,
  label,
  options,
  required,
  defaultValue,
  errors,
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
