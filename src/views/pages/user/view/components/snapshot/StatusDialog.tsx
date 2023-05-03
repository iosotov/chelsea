import { ReactElement, useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { Grid, Typography, Box } from '@mui/material'
import { useForm, useWatch } from 'react-hook-form'
import TextInput from 'src/views/shared/form-input/text-input'
import SingleSelect from 'src/views/shared/form-input/single-select'
import Button from '@mui/material/Button'
import SelectDate from 'src/views/shared/form-input/date-picker'

import { useAppSelector } from 'src/store/hooks'

type Props = {
  open: boolean
  toggle: () => void
  stage: number
  status: number
}

const statusOptions = [
  {
    value: 0,
    label: 'Status One'
  },
  {
    value: 1,
    label: 'Status Two'
  },
  {
    value: 2,
    label: 'Status Three'
  }
]

const stageOptions = [
  {
    value: 0,
    label: 'Stage One'
  },
  {
    value: 1,
    label: 'Stage Two'
  },
  {
    value: 2,
    label: 'Stage Three'
  }
]

export default function StatusDialog({ open, toggle, stage, status }: Props): ReactElement {
  // call api for status/stage

  console.log(status)
  const statusForm = useForm({ defaultValues: { stage, status } })
  const {
    formState: { errors },
    control,
    watch,
    reset
  } = statusForm

  const onClose = () => {
    toggle()
    statusForm.reset()
  }

  const onSubmit = () => {
    const data = statusForm.getValues()
    console.log(data)
  }

  useEffect(() => {
    console.log(watch('stage'))
    if (stage !== watch('stage')) {
      reset({ stage: watch('stage'), status: status })
    }
  }, [watch])
  return (
    <Dialog open={open} maxWidth='xs' fullWidth onClose={toggle} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>Update Stage & Status</DialogTitle>
      <DialogContent>
        <Box my={2}>
          <form>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <SingleSelect
                  name='stage'
                  label='Stage'
                  options={stageOptions}
                  control={control}
                  errors={errors}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <SingleSelect
                  name='status'
                  label='Status'
                  options={statusOptions}
                  control={control}
                  errors={errors}
                  required
                  disabled={!watch('stage')}
                />
              </Grid>
            </Grid>
          </form>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant='outlined' onClick={onSubmit}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
