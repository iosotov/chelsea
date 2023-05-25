import { ReactElement, useEffect, useRef } from 'react'

//MUI
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'

//Dialog
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

//Custom Components
import SingleSelect from 'src/views/shared/form-input/single-select'

//Forms
import { useForm } from 'react-hook-form'

//Custom Imports
import Icon from 'src/@core/components/icon'

//API Hooks
import { useAppSelector } from 'src/store/hooks'
import { usePostSettingSearchQuery, usePutProfileStatusUpdateMutation } from 'src/store/api/apiHooks'

//API Slices
import { selectSettingByParentValueOptions, selectSettingByTypeOptions } from 'src/store/settingSlice'

type Props = {
  open: boolean
  toggle: () => void
  stage: string
  stageStatus: string
  profileId: string
}

export default function StatusDialog({ open, toggle, stage = '', stageStatus = '', profileId }: Props): ReactElement {
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

  const previousStage = useRef(stage)

  const [updateStageStatus, updateStatus] = usePutProfileStatusUpdateMutation()

  const { isLoading } = updateStatus

  //used in place of onchange for uncontrolled components, checks if current value of stage is same as previous set stage
  useEffect(() => {
    if (getValues('stage') !== previousStage.current) {
      previousStage.current = getValues('stage')
      setValue('stageStatus', '')
    }
  }, [getValues, setValue])

  //closes dialog, resets form, reassigns ref to prop stage
  const onClose = () => {
    toggle()
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
      updateStageStatus({ ...data, profileId })
        .unwrap()
        .then(res => {
          if (res) {
            onClose()
          }
        })
    }
  }

  //api call for all search settings, may need to narrow down later if settings results object too large
  usePostSettingSearchQuery({ length: 10000 }, { skip: !open })

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
        <Button disabled={isLoading} variant='outlined' onClick={onSubmit}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
