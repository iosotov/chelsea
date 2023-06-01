import { ReactElement } from 'react'

//MUI
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

//Dialog
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

type CreditReportDialogProps = {
  data: string | undefined
  open: boolean
  handleClose: () => void
}

export default function ViewCreditReportDialog({ data, open, handleClose }: CreditReportDialogProps): ReactElement {
  //Debt Types

  const onClose = () => {
    handleClose()
  }

  return (
    <Dialog open={open} maxWidth='xl' fullWidth onClose={onClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>
        Credit Report
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <PdfViewer pdfData={data}></PdfViewer>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'></DialogActions>
    </Dialog>
  )
}

interface PdfViewerProps {
  pdfData: string | undefined
}

const PdfViewer = ({ pdfData }: PdfViewerProps) => {
  if (pdfData == undefined) {
    pdfData = ''
  }
  const pdfDataConvert = new Uint8Array(
    atob(pdfData)
      .split('')
      .map(char => char.charCodeAt(0))
  )
  const pdfUrl = URL.createObjectURL(new Blob([pdfDataConvert], { type: 'application/pdf' }))

  return <iframe src={pdfUrl} title='PDF Viewer' width='100%' height='800vh' />
}
