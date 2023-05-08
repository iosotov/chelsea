// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'

const ExpenseTable = (data: any) => {
  console.log(data)
  const dataSource = data.expense

  const getBudgetById = choice => {
    console.log(choice)
    if (data) {
      console.log(data)
      const budgetName = dataSource.find(element => element.budgetId == choice)
      if (budgetName) {
        return budgetName.name
      } else {
        console.log('no Name')
      }

      // console.log(budgetAmount.amount)

      // return budgetAmount.amount
    }
  }

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Expense Type</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataSource.map(budget => (
            <TableRow
              key={budget.budgetId}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell component='th' scope='row'>
                {getBudgetById(budget.budgetId)}
              </TableCell>
              <TableCell align='right'>
                <TextField fullWidth label='Amount' defaultValue={budget.amount} placeholder='Amount'></TextField>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ExpenseTable
