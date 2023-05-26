import { ReactElement } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { Grid, Box } from '@mui/material'
import { useForm } from 'react-hook-form'
import TextInput from 'src/views/shared/form-input/text-input'
import SingleSelect from 'src/views/shared/form-input/single-select'
import Button from '@mui/material/Button'
import SelectDate from 'src/views/shared/form-input/date-picker'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

type TransactionDialogProps = {
  data: any
  open: boolean
  toggle: () => void
}

const typeOptions = [
  {
    label: 'Bank Account',
    value: 0
  },
  {
    label: 'Debit Card',
    value: 1
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
      <DialogTitle id='form-dialog-title'>
        {data ? 'Update' : 'Create New'} Payment
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ overflow: 'visible' }}>
        <Box my={2}>
          <form>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <SingleSelect
                  name='paymentType'
                  label='Payment Type'
                  defaultValue={data?.paymentType}
                  options={typeOptions}
                  control={control}
                  errors={errors}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput name='amount' label='Amount' control={control} errors={errors} required />
              </Grid>
              <Grid sx={{ overflow: 'visible' }} item xs={12}>
                <SelectDate name='processDate' label='Process Date' control={control} errors={errors} required />
              </Grid>
              <Grid sx={{ overflow: 'visible' }} item xs={12}>
                <SelectDate name='clearedDate' label='Cleared Date' control={control} errors={errors} required />
              </Grid>
              <Grid item xs={12}>
                <TextInput name='memo' label='Memo' control={control} errors={errors} required />
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
