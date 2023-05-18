import { ReactElement, useEffect, useRef } from 'react'

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

import { useAppSelector } from 'src/store/hooks'
import { usePostSettingSearchQuery } from 'src/store/api/apiHooks'
import {
  selectSettingByParentValueOptions,
  selectSettingByType,
  selectSettingByTypeOptions
} from 'src/store/settingSlice'

type Props = {
  open: boolean
  toggle: () => void
  stage: string | null
  stageStatus: string | null
}

export default function StatusDialog({ open, toggle, stage = '', stageStatus = '' }: Props): ReactElement {
  const statusForm = useForm({ defaultValues: { stage, stageStatus } })
  const {
    formState: { errors },
    control,
    watch,
    reset,
    trigger,
    getValues,
    setValue
  } = statusForm

  //tracks previous stages for resetting status value upon change
  const previousStage = useRef(stage)

  //used in place of onchange for uncontrolled components, checks if current value of stage is same as previous set stage
  useEffect(() => {
    if (getValues('stage') !== previousStage.current) {
      previousStage.current = getValues('stage')
      setValue('stageStatus', '')
    }
  }, [watch('stage')])

  //closes dialog, resets form, reassigns ref to prop stage
  const onClose = () => {
    toggle()
    previousStage.current = stage
    previousStage.current = stage
    reset()
  }

  const onSubmit = () => {
    trigger()
    const check = getValues(['stage', 'stageStatus'])
    if (check.every((val: string | null, index: number) => val === [stage, stageStatus][index])) {
      onClose()
    }
    if (getValues('stage') && getValues('stageStatus')) {
      const data = statusForm.getValues()
      console.log(data)
      onClose()
    }
  }

  //api call for all search settings, may need to narrow down later if settings results object too large
  usePostSettingSearchQuery({ length: 10000 }, { skip: !open })
  //api call for all search settings, may need to narrow down later if settings results object too large
  usePostSettingSearchQuery({ length: 10000 }, { skip: !open })

  //options for dropdown, pulled from redux state component
  //options for dropdown, pulled from redux state component
  const stageOptions = [
    {
      value: '',
      label: 'Select One...',
      disabled: true
    },
    ...useAppSelector(state => selectSettingByTypeOptions(state, 2))
  ]

  const statusOptions = [
    {
      value: '',
      label: 'Select One...',
      disabled: true
    },
    ...useAppSelector(state => selectSettingByParentValueOptions(state, String(watch('stage'))))
  ]

  return (
    <Dialog open={open} maxWidth='xs' fullWidth onClose={onClose} aria-labelledby='form-dialog-title'>
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
