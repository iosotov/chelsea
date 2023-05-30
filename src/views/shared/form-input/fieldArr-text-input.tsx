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
  errMessage?: string | undefined
  disabled?: any
  InputProps?: any
  type?: "text" | "number" | "email" | "password" | "tel" | "date"
}

export default function FieldArrTextInput({
  control,
  label,
  name,
  placeholder,
  defaultValue,
  required = false,
  errors,
  errMessage = "Please try again",
  type,
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
          }
        }}
        render={({ field }) => (
          <TextField
            type={type || 'text'}
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
            {errMessage}
          </FormHelperText>
        )
        : null}
    </FormControl>
  )
}
