import { ReactElement } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { Grid, Typography, Box } from '@mui/material'
import { useForm } from 'react-hook-form'
import TextInput from 'src/views/shared/form-input/text-input'
import SingleSelect from 'src/views/shared/form-input/single-select'
import Button from '@mui/material/Button'
import SelectDate from 'src/views/shared/form-input/date-picker'

type TransactionDialogProps = {
  data: any
  open: boolean
  toggle: () => void
}

const typeOptions = [
  {
    label: 'Bank Account',
    value: 'ach'
  },
  {
    label: 'Debit Card',
    value: 'card'
  }
]

export default function TransactionDialog({ data, open, toggle }: TransactionDialogProps): ReactElement {
  const transForm = useForm()
  const {
    control,
    formState: { errors }
  } = transForm

  const onSubmit = () => {
    console.log(transForm.getValues())
  }

  const onClose = () => {
    transForm.reset()
    toggle()
  }

  return (
    <Dialog
      open={open}
      maxWidth='sm'
      sx={{ minHeight: '450px' }}
      fullWidth
      onClose={toggle}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>{data ? 'Update' : 'Create New'} Payment</DialogTitle>
      <DialogContent>
        <Box my={2}>
          <form>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <SingleSelect
                  name='amount'
                  label='Payment Type'
                  options={typeOptions}
                  control={control}
                  errors={errors}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <SelectDate name='processDate' label='Process Date' control={control} errors={errors} required />
              </Grid>
              <Grid item xs={12}>
                <SelectDate name='clearedDate' label='Cleared Date' control={control} errors={errors} required />
              </Grid>
              <Grid item xs={12}>
                <TextInput name='memo' label='Memo' control={control} errors={errors} required />
              </Grid>
              <Grid item xs={12}>
                <TextInput name='description' label='Description' control={control} errors={errors} required />
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
