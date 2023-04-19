// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

const createData = (type: string, createdBy: string, message: string, emails: string) => {
  return { type, createdBy, message, emails }
}

const rows = [
  createData('General', 'me', 'hi', 'email'),
  createData('NonGeneral', 'you', 'lol', 'email'),
  createData('Type1', 'admin', 'message', 'email'),
  createData('Type2', 'manager', 'oops', 'email'),
  createData('null', 'system', 'yes', 'email')
]

const HistoryTable = () => {
  // console.log(rows)
  // let i = 0
  // for (i = 0; i < rows.length; i++) {
  //   ;<TableContainer component={Paper}></TableContainer>
  // }

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell align='right'>Created By</TableCell>
            <TableCell align='right'>Message</TableCell>
            <TableCell align='right'>CC'd Emails</TableCell>
            <TableCell align='right'>Icons</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow
              key={row.type}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell component='th' scope='row'>
                {row.type}
              </TableCell>
              <TableCell align='right'>{row.createdBy}</TableCell>
              <TableCell align='right'>{row.message}</TableCell>
              <TableCell align='right'>{row.emails}</TableCell>
              <TableCell align='right'>icon</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default HistoryTable
