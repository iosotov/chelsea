import { Controller } from 'react-hook-form'
import FormControl from '@mui/material/FormControl'
import { Typography } from '@mui/material'
import Switch from '@mui/material/Switch'

type Props = {
  control: any
  label: string
  name: string
  defaultChecked?: boolean
}

export default function ToggleSwitch({ control, label, name, defaultChecked, ...props }: Props) {
  return (
    <FormControl fullWidth>
      <Typography variant='body1'>{label}</Typography>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultChecked ?? false}
        render={({ field: { onChange, value } }) => (
          <Switch
            onChange={(e, value) => {
              return onChange(value)
            }}
            value={value}
            defaultChecked={defaultChecked ?? false}
            {...props}
          />
        )}
      />
    </FormControl>
  )
}
