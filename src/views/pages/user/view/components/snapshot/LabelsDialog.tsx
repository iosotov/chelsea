import { Dialog, DialogContent, DialogTitle, IconButton, DialogActions, Button } from '@mui/material'
import Icon from 'src/@core/components/icon'
import SingleSelect from 'src/views/shared/form-input/single-select'

type Props = {
  open: boolean
  toggle: () => void
  data: any
}

export default function LabelsDialog({ open, toggle, data }: Props) {
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
