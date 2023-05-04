import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { Typography } from '@mui/material'

type Props = {
  open: boolean
  toggle: () => void
  title: string
  textBody: string
  action: () => void
  acceptText?: string
  denyText?: string
}

export default function ConfirmationDialog({ open, toggle, title, textBody, acceptText, denyText, action }: Props) {
  const onAccept = () => {
    action()
    toggle()
  }
  return (
    <>
      <Dialog
        maxWidth='xs'
        open={open}
        disableEscapeKeyDown
        aria-labelledby='confirmation-dialog-title'
        aria-describedby='confirmation-dialog-description'
        onClose={(e, reason) => {
          if (reason !== 'backdropClick') {
            toggle()
          }
        }}
      >
        <DialogTitle id='confirmation-dialog-title'>
          <Typography variant='h5'>{title}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='confirmation-dialog-description'>{textBody}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggle}>{denyText ?? 'Reject'}</Button>
          <Button onClick={onAccept}>{acceptText ?? 'Accept'}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
