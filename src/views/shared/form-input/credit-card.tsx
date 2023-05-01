import { Controller } from 'react-hook-form'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import { FormHelperText } from '@mui/material'

import { useState, ChangeEvent } from 'react'

import { Focused } from 'react-credit-cards'

//Credit Card Imports
import Payment from 'payment'
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'

type Props = {
  control: any
  label: string
  name: string
  placeholder?: string
  defaultValue?: string | number
  required?: boolean
  errors?: any
  disabled?: any
  type: string
  cardNumber?: string
}

export default function CreditCard({
  control,
  label,
  name,
  placeholder,
  defaultValue,
  required,
  errors,
  type,
  cardNumber,
  ...props
}: Props) {
  const handleInputChange = (val: any) => {
    let value
    if (type === 'number') {
      value = formatCreditCardNumber(val, Payment)
    } else if (type === 'expiry') {
      value = formatExpirationDate(val)
    } else if (type === 'cvc') {
      value = formatCVC(val, cardNumber ?? '1111111111111111', Payment)
    }
    return value
  }

  return (
    <FormControl fullWidth>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ''}
        rules={{ required: required ?? false }}
        render={({ field: { onChange, value } }) => (
          <TextField
            onChange={(e: ChangeEvent) => {
              const val = handleInputChange(e.target.value)
              onChange(val)
            }}
            value={value}
            label={label}
            error={errors ? Boolean(errors[name]) : false}
            placeholder={placeholder ?? ''}
            {...props}
          />
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
