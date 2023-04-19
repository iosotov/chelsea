// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'

const createData = (incomeType: string, amount: number) => {
  return { incomeType, amount }
}

const rows = [
  createData('income1', 100),
  createData('income2', 10),
  createData('income3', 30),
  createData('incomenull', 0)
]

const BudgetTable = () => {
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
            <TableCell>Income Type</TableCell>
            <TableCell>Created By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow
              key={row.incomeType}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell component='th' scope='row'>
                {row.incomeType}
              </TableCell>
              <TableCell align='right'>
                <TextField fullWidth label='Amount' placeholder='Amount'>
                  {' '}
                  {row.amount}
                </TextField>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BudgetTable
