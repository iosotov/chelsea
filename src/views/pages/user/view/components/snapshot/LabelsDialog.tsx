//MUI
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

//Dialog
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

//Custom Import
import Icon from 'src/@core/components/icon'

type Props = {
  open: boolean
  toggle: () => void
  data: any
}

export default function LabelsDialog({ open, toggle, data }: Props) {
  //needs data to create labels, need multiselect dropdown with chips
  console.log(data)

  return (
    <>
      <Dialog open={open} maxWidth='xs' fullWidth onClose={toggle}>
        <DialogTitle id='form-dialog-title'>
          Add Labels
          <IconButton
            aria-label='close'
            onClick={toggle}
            sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={toggle}>Cancel</Button>
          <Button variant='outlined' onClick={toggle}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
