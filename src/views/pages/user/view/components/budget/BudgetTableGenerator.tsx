import { useState } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import { Typography } from '@mui/material'
import { string } from 'yup'

const createData = (expenseType: string, amount: number) => {
  return { expenseType, amount }
}

const rows = [
  createData('expense1', 100),
  createData('expense2', 10),
  createData('expense3', 30),
  createData('expensenull', 0)
]

const BudgetTableGenerator = (data: []) => {
  // console.log(rows)
  // let i = 0
  // for (i = 0; i < rows.length; i++) {
  //   ;<TableContainer component={Paper}></TableContainer>
  // }
  const incomeList = []
  const expenseList = []

  const [budgetType, setBudgetType] = useState(data.type)
  console.log(data)
  console.log(data.budgetTypes)
  const myBudgetList = data.budgetList
  let i = 0
  for (i = 0; i < myBudgetList.length; i++) {
    console.log(myBudgetList[i])
    if (myBudgetList[i].active) {
      if (myBudgetList[i].budgetType == 0) {
        incomeList.push(myBudgetList[i])
      } else {
        expenseList.push(myBudgetList[i])
      }
    }
  }
  console.log(incomeList)
  console.log(expenseList)

  // const getExpense = choice => {
  //   console.log(expenseList)
  //   const mine = expenseList.find(element => element.budgetId == choice)
  //   console.log(mine)
  // }
  // getExpense('9da97f8e-6e71-4091-b590-ed22be4cddb2')
  const getBudgetbyId = choice => {
    if (data.budgetTypes != undefined || data.budgetTypes.length != 0) {
      const mine = data.budgetTypes.find(element => element.budgetId == choice)

      console.log(mine)
      if (mine != undefined) {
        console.log(mine.amount)

        return String(mine.amount)
      }
    } else {
      console.log('null')
    }

    //setup so that it is async and loads data into label after determining
  }

  // console.log(getBudgetbyId)

  // console.log(data.budgetTypes)
  // console.log(data.budgetList)

  // console.log(data[0].length)

  // console.log(budgets.length)
  // console.log(budgets)

  //  budgetTypes.map(budgets.filter(budget=> budget.budgetId === budgetTypes.budgetId )

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Income Type</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incomeList.map(budget => (
            <TableRow
              key={budget.budgetId}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell component='th' scope='row'>
                {budget.name}
              </TableCell>
              <TableCell align='right'>
                <TextField fullWidth label='Amount' placeholder='Amount'>
                  {' '}
                  {/* value={getBudgetbyId(budget.budgetId)} */}
                  {/* Map budget data amount to show  */}
                  {/* Trying to grab same budget using budget id to filter and return amount prop */}
                  {getBudgetbyId(budget.budgetId)}
                </TextField>
              </TableCell>
              {/* <Typography>{getBudgetbyId(budget.budgetId)}</Typography> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Expense Type</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenseList.map(budget => (
            <TableRow
              key={budget.budgetId}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell component='th' scope='row'>
                {budget.name}
              </TableCell>
              <TableCell align='right'>
                <TextField fullWidth label='Amount' placeholder='Amount'>
                  {/* {' '} */}
                  {/* {myBudgetList.filter} */}
                  {/* {getBudgetbyId(budget.budgetId)} */}0
                  {/* {myBudgetList.find(element => element.budgetId == budget.budgetId)} */}
                  {/* {expenseList[budgetId]} */}
                  HELLo
                </TextField>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BudgetTableGenerator
