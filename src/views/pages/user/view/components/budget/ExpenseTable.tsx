import { useRef, Ref, useState, ChangeEvent, useEffect, forwardRef, ReactElement, ForwardedRef } from 'react'
import Cards, { Focused } from 'react-credit-cards'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

const ExpenseTable = (data: any) => {
  console.log(data)
  const dataSource = data.expense
  const [selectedBudget, setSelectedBudget] = useState<any>({})
  const [focus, setFocus] = useState<Focused>()
  const amountRef = useRef(null)

  const handleClearForm = () => {
    console.log(amountRef)
    amountRef.current.value = 0
  }

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

  const handleBlur = () => setFocus(undefined)

  const handleBudgetInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    //can do formatting here
    console.log(target)

    // target.value = formatCreditCardNumber(target.value, Payment)
    console.log('BUDGET INPUT CHANGE')

    console.log(target.id)
    const editBudget = dataSource.find(budget => budget.budgetId == target.id)
    console.log(editBudget)
    editBudget.amount == 0
    console.log(editBudget)

    // setSelectedBudget(editBudget)
    // console.log(selectedBudget)
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
                <TextField
                  name='Amount'
                  fullWidth
                  ref={amountRef}
                  label='Amount'
                  placeholder='Amount'
                  id={budget.budgetId}
                  value={budget.amount ?? ''}
                  onBlur={handleBlur}
                  onChange={handleBudgetInputChange}
                  inputProps={{ maxLength: 1000 }}
                  onFocus={e => setFocus(e.target.value as Focused)}
                ></TextField>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant='outlined' color='secondary' sx={{ mr: 4 }} onClick={handleClearForm}>
        Clear Form
      </Button>
    </TableContainer>
  )
}

export default ExpenseTable
