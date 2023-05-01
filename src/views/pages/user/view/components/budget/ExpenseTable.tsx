// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'

// const createData = (expenseType: string, amount: number) => {
//   return { expenseType, amount }
// }

// const rows = [
//   createData('expense1', 100),
//   createData('expense2', 10),
//   createData('expense3', 30),
//   createData('expensenull', 0)
// ]

const ExpenseTable = (data: any) => {
  const expense = data.expense

  // console.log(rows)
  // let i = 0
  // for (i = 0; i < rows.length; i++) {
  //   ;<TableContainer component={Paper}></TableContainer>
  // }
  // const getBudgetbyId = () => {

  // }
  const getBudgetById = choice => {
    console.log(choice)
    if (data) {
      console.log(data)
      const budgetAmount = data.budgetList.find(element => element.budgetId == choice)
      if (budgetAmount) {
        return budgetAmount.amount
      } else {
        return 0
      }

      console.log(budgetAmount)

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
          {expense.map(budge => (
            <TableRow
              key={budge.budgeId}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell component='th' scope='row'>
                {budge.name}
              </TableCell>
              <TableCell align='right'>
                <TextField
                  fullWidth
                  label='Amount'
                  defaultValue={getBudgetById(budge.budgetId)}
                  placeholder='Amount'
                ></TextField>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ExpenseTable
