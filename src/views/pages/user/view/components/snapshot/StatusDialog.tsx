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
import IconButton from '@mui/material/IconButton'

import Icon from 'src/@core/components/icon'

import { usePostSettingSearchQuery } from 'src/store/api/apiHooks'

type Props = {
  open: boolean
  toggle: () => void
  stage: number | null
  stageStatus: number | null
}

const statusOptions = [
  {
    value: '',
    label: 'Select One...',
    disabled: true
  }
]

const stageOptions = [
  {
    value: '',
    label: 'Select One...',
    disabled: true
  }
]

export default function StatusDialog({ open, toggle, stage, stageStatus }: Props): ReactElement {
  // call api for status/stage

  const { data: stages } = usePostSettingSearchQuery(
    {
      columns: [
        {
          columnName: 'type',
          displayName: 'type',
          index: 0,
          search: {
            operator: 0,
            value: '2'
          }
        }
      ],
      order: [
        {
          columnName: 'order',
          direction: 0
        }
      ]
    },
    { skip: !open }
  )

  const { data: stageStatuses } = usePostSettingSearchQuery(
    {
      columns: [
        {
          columnName: 'type',
          displayName: 'type',
          index: 0,
          search: {
            operator: 0,
            value: '1'
          }
        }
      ],
      order: [
        {
          columnName: 'order',
          direction: 0
        }
      ]
    },
    { skip: !open }
  )

  console.log({ stage, stageStatuses })

  const statusForm = useForm({ defaultValues: { stage: stage ?? '', stageStatus: stageStatus ?? '' } })
  const {
    formState: { errors },
    control,
    watch,
    reset
  } = statusForm

  console.log(stage, stageStatus)

  const onClose = () => {
    toggle()
    statusForm.reset()
  }

  const onSubmit = () => {
    const data = statusForm.getValues()
    console.log(data)
  }

  // useEffect(() => {
  //   if (stage !== watch('stage')) {
  //     reset({ stage: watch('stage'), status: status })
  //   }
  // }, [watch])
  return (
    <Dialog open={open} maxWidth='xs' fullWidth onClose={toggle} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>
        Update Stage & Status
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogTitle>

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
                  name='stageStatus'
                  label='Status'
                  options={statusOptions}
                  control={control}
                  errors={errors}
                  required
                  disabled={statusForm.getValues('stage') === ''}
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
