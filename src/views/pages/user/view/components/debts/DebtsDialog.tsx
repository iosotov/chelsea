import { ReactElement } from 'react'

//MUI
import Grid from '@mui/material/Grid'
import TextInput from 'src/views/shared/form-input/text-input'
import SingleSelect from 'src/views/shared/form-input/single-select'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

//Dialog
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

//Forms
import { useForm } from 'react-hook-form'

//Types
import { GridRowId } from '@mui/x-data-grid'
import { useAppSelector } from 'src/store/hooks'
import { selectLiabilityById } from 'src/store/liabilitySlice'

type DebtDialogProps = {
  selected: GridRowId[]
  open: boolean
  handleClose: () => void
}

export default function DebtsDialog({ selected, open, handleClose }: DebtDialogProps): ReactElement {
  const liability = useAppSelector(state => selectLiabilityById(state, selected[0]))

  console.log(liability)

  const defaultValues = {}

  const debtForm = useForm(defaultValues)
  const {
    control,
    trigger,
    formState: { errors }
  } = debtForm

  const onSubmit = async () => {
    const valid = await trigger()
    valid ? console.log(debtForm.getValues()) : console.log('missing fields')
  }

  const onClose = () => {
    debtForm.reset()
    handleClose()
  }

  return (
    <Dialog open={open} maxWidth='lg' fullWidth onClose={onClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>
        {selected.length !== 0 ? 'Edit' : 'Add'} Debt
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput name='name' label='Name' control={control} errors={errors} required />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput name='originalBalance' label='Original Balance' control={control}></TextInput>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <SingleSelect name='type' label='Debt Type' control={control}></SingleSelect>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput name='accountNumber' label='Account Number' control={control}></TextInput>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput name='currentPayment' label='currentPayment' control={control}></TextInput>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput name='accountStatus' label='Account Status' control={control}></TextInput>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput name='name' label='Name' control={control}></TextInput>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput name='name' label='Name' control={control}></TextInput>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput name='name' label='Name' control={control}></TextInput>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TextInput name='name' label='Name' control={control}></TextInput>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button size='small' onClick={onClose}>
          Cancel
        </Button>
        <Button size='small' variant='outlined' onClick={onSubmit}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
