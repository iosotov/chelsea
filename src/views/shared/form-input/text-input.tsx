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
  errors?: any
  disabled?: any
  InputProps?: any
}

export default function TextInput({
  control,
  label,
  name,
  placeholder,
  defaultValue,
  required,
  errors,
  ...props
}: Props) {
  return (
    <FormControl fullWidth>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ''}
        rules={{ required: required ?? false }}
        render={({ field: { onChange, value } }) => (
          <TextField
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
              This field is required
            </FormHelperText>
          )
        : null}
    </FormControl>
  )
}
