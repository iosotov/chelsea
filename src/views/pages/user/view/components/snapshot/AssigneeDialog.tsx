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

import { useAppSelector } from 'src/store/hooks'

import { useGetAssigneeDatasourceQuery } from 'src/store/api/apiHooks'

type Props = {
  data: { assigneeId: string; assigneeName: string; employeeAlias: string; employeeId: string }
  toggle: () => void
  open: boolean
}

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

export default function AssigneeDialog({ data, toggle, open }: Props): ReactElement {
  //might need to check to make sure employeeId is a valid employee still (filter for active accounts)
  //if not active, need to default to ''
  const { assigneeId, assigneeName, employeeAlias, employeeId = '' } = data

  // call api for status/stage
  const assigneeForm = useForm()
  const {
    formState: { errors },
    control,
    handleSubmit,
    setError,
    clearErrors
  } = assigneeForm

  const onClose = () => {
    toggle()
    assigneeForm.reset()
    clearErrors()
  }

  const onSubmit = () => {
    const check = assigneeForm.getValues('assignee')
    console.log(check, employeeId)
    if (check === employeeId) {
      setError('assignee', { type: 'required' }, { shouldFocus: true })
      return
    }
    console.log(`Submitting: ${check}`)
    onClose()
  }

  const { data: assigneeList } = useGetAssigneeDatasourceQuery(assigneeId, { skip: !assigneeId })

  console.log({ assigneeList, assigneeId, assigneeName, employeeAlias, employeeId })
  return (
    <Dialog open={open} maxWidth='xs' fullWidth onClose={toggle} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>
        Update Assignee
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant='caption'>
          Current {assigneeName}: {employeeAlias ?? 'Unassigned'}
        </Typography>
        <Box my={4}>
          <form>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <SingleSelect
                  defaultValue={employeeId}
                  placeholder={employeeId ? `Active: ${employeeAlias}` : `Unassigned`}
                  name='assignee'
                  label={assigneeName}
                  options={assigneeList}
                  control={control}
                  errors={errors}
                  required
                />
              </Grid>
            </Grid>
          </form>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant='outlined' onClick={handleSubmit(onSubmit)}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
