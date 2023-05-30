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
  errors?: boolean
  errMsg?: string
  disabled?: boolean
  placeholder?: string
  InputProps?: any
}

export default function FieldArrSingleSelect({
  name,
  control,
  label,
  options,
  required = false,
  defaultValue,
  errors = false,
  InputProps,
  errMsg = "Please try again",
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
        rules={{
          required: {
            value: required,
            message: "Required"
          }
        }}
        render={({ field }) => (
          <Select
            label={label}
            error={errors}
            inputProps={InputProps}
            {...props}
            {...field}
          >
            {generateOptions()}
          </Select>
        )}
      />
      {errors
        ? (
          <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
            {errMsg}
          </FormHelperText>
        )
        : null}
    </FormControl>
  )
}
