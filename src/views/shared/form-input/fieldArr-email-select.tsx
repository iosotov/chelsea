import { Controller } from 'react-hook-form'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import { FormHelperText } from '@mui/material'

type Props = {
  control: any
  label: string
  name: string
  placeholder?: string
  defaultValue?: string | number
  required?: boolean
  errors?: boolean
  errMsg?: string
  disabled?: any
  InputProps?: any
}

export default function FieldArrEmailInput({
  control,
  label,
  name,
  placeholder,
  defaultValue,
  required = false,
  errors,
  errMsg = "Please try again",
  ...props
}: Props) {

  return (
    <FormControl fullWidth>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ''}
        rules={{
          required: {
            value: required,
            message: 'Required'
          },
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: "Invalid email address"
          }
        }}
        render={({ field }) => (
          <TextField
            type={'email'}
            label={label}
            error={errors}
            placeholder={placeholder ?? ''}
            {...props}
            {...field}
          />
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
