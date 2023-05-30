import { Controller } from 'react-hook-form'
import FormControl from '@mui/material/FormControl'
import { Typography } from '@mui/material'
import Switch from '@mui/material/Switch'
import Box from '@mui/material/Box'

type Props = {
  control: any
  label: string
  name: string
  defaultChecked?: boolean
  disabled?: boolean
  labelBefore?: string
  labelAfter?: string
}

export default function ToggleSwitch({
  control,
  label,
  name,
  defaultChecked,
  disabled,
  labelAfter,
  labelBefore,
  ...props
}: Props) {
  return (
    <FormControl fullWidth>
      <Typography variant='body1'>{label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {labelBefore && <Typography variant='body1'>{labelBefore}</Typography>}
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
              checked={value}
              disabled={disabled ?? false}
              {...props}
            />
          )}
        />
        {labelAfter && <Typography variant='body1'>{labelAfter}</Typography>}
      </Box>
    </FormControl>
  )
}
