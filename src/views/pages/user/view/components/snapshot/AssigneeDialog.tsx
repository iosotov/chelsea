import { ReactElement, useEffect, memo } from 'react'

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
  data: { assigneeId: string; assigneeName: string; employeeId: string; employeeAlias: string }
  toggle: () => void
  open: boolean
}

export default function AssigneeDialog({ data, toggle, open }: Props): ReactElement {
  //might need to check to make sure employeeId is a valid employee still (filter for active accounts)
  //if not active, need to default to ''
  const { assigneeId, assigneeName, employeeAlias, employeeId = '' } = data

  // call api for status/stage
  const assigneeForm = useForm({ shouldUnregister: true })
  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
    reset
  } = assigneeForm

  const onClose = () => {
    toggle()
    reset()
  }

  const onSubmit = () => {
    const check = assigneeForm.getValues('assignee')
    if (check !== employeeId) {
      const data = getValues('assignee')
      console.log(data)
    }
    onClose()
  }

  //temp measure until i find the right selector
  const { data: assigneeList } = useGetAssigneeDatasourceQuery(assigneeId, { skip: !assigneeId })
  // use app selector to eventually select the right one
  // const assigneeList = useAppSelector(state => selectAllAssignees(state))

  return (
    <Dialog open={open} maxWidth='xs' fullWidth onClose={onClose} aria-labelledby='form-dialog-title'>
      <Dialog open={open} maxWidth='xs' fullWidth onClose={onClose} aria-labelledby='form-dialog-title'>
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
                    defaultValue={employeeId === 'N/A' ? '' : employeeId}
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

      export default AssigneeDialog
