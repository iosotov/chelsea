import { Controller, FieldErrors } from 'react-hook-form'
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
  errors?: FieldErrors<any>
  disabled?: any
  InputProps?: any
  type?: "text" | "number" | "email" | "password" | "tel" | "date"
}

export default function EmailInput({
  control,
  label,
  name,
  placeholder,
  defaultValue,
  required = false,
  errors,
  ...props
}: Props) {



  console.log(errors)

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
            message: "invalid email address"
          }
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            type={'email'}
            onChange={onChange}
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
            {errors[name]?.message ? `${errors[name]?.message}` : "This field is required"}
          </FormHelperText>
        )
        : null}
    </FormControl>
  )
}
