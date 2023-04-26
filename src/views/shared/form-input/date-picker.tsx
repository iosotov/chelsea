import { forwardRef, ChangeEvent } from 'react'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import { Controller } from 'react-hook-form'
import { FormHelperText } from '@mui/material'

type DateType = Date | null | undefined

type Props = {
  name: string
  label: string
  control: any
  placeholder?: string
  required?: boolean
  defaultValue?: Date
  errors?: any
}

interface CustomInputProps {
  value: DateType
  label: string
  error: boolean
  onChange: (event: ChangeEvent) => void
}

const CustomInput = forwardRef(({ ...props }: CustomInputProps, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: '100%' }} />
})

export default function SelectDate({
  name,
  label,
  control,
  errors,
  placeholder,
  required,
  defaultValue,
  ...props
}: Props) {
  return (
    <FormControl fullWidth>
      <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
        <Controller
          name={name}
          control={control}
          rules={{ required: required ?? false }}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              selected={value}
              onChange={e => onChange(e)}
              placeholderText='MM/DD/YYYY'
              isClearable
              customInput={
                <CustomInput
                  value={value}
                  onChange={onChange}
                  label={label}
                  error={errors ? Boolean(errors[name]) : false}
                />
              }
            />
          )}
        />
      </DatePickerWrapper>
      {errors
        ? errors[name] && (
            <FormHelperText sx={{ mx: 3.5, color: 'error.main' }} id='validation-basic-dob'>
              This field is required
            </FormHelperText>
          )
        : null}
    </FormControl>
  )
}