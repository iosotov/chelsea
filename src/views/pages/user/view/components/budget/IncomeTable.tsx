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

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'

export type FormData = {
  name: string
  amount: number
}

// type Props = {
//   onSubmit: (formData:FormData)=>
// }

// const createData = (incomeType: string, amount: number) => {
//   return { incomeType, amount }
// }

const IncomeTable = (data: any) => {
  console.log(data)
  const dataSource = data.income
  console.log(dataSource)

  //being dfed data object, taht has budget, profile props list
  // var budget

  // let i = 0
  // for (i = 0; i < rows.length; i++) {
  //   ;<TableContainer component={Paper}></TableContainer>
  // }

  const { register, control, handleSubmit } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })
  const [formData, setFormData] = useState({ items: [] })

  const onSubmit = data => {
    console.log(data)
  }

  // const getBudgetById = choice => {
  //   console.log(choice)
  //   if (data) {
  //     console.log(data)

  //     const budgetName = dataSource.find(element => element.budgetId == choice)
  //     if (budgetName.name) {
  //       return budgetName.name
  //     } else {
  //       console.log('no Name')
  //     }

  //     // console.log(budgetAmount.amount)

  //     // return budgetAmount.amount
  //   }
  // }

  // getBudgetById('cf8c14ca-9375-4c87-94d9-6a8e30fb85d4')

  return (
    <TableContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Income Name</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {dataSource.map(budget => (
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
              <TableCell align='right'> */}
            {/* sets to load default value */}
            {/* <TextField fullWidth label='Amount' defaultValue={getBudgetById(budget.budgetId)} placeholder='Amount'>
                  {' '}
                </TextField> */}
            {/* <TextField fullWidth label='Amount' defaultValue={budget.amount} placeholder='Amount'></TextField>
              </TableCell>
            </TableRow>
          ))} */}
            {/* /// */}

            {dataSource.map((budget, index) => (
              <TableRow
                key={budget.budgetId}
                sx={{
                  '&:last-of-type td, &:last-of-type th': {
                    border: 0
                  }
                }}
              >
                <TableCell component='th' scope='row'>
                  {/* {getBudgetById(budget.budgetId)} */}
                  {budget.name}
                </TableCell>
                <TableCell align='right'>
                  {/* sets to load default value */}
                  {/* <TextField fullWidth label='Amount' defaultValue={getBudgetById(budget.budgetId)} placeholder='Amount'>
                  {' '}
                </TextField> */}
                  <TextField
                    fullWidth
                    // name='income-amount'
                    label='Amount'
                    defaultValue={budget.amount}
                    placeholder='Amount'
                    {...register(`items.${index}.amount`)}
                  ></TextField>
                  {/* <input {...register(`items.${index}.amount`)} defaultValue={budget.amount}></input> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <Button type='submit' variant='contained' onClick={handleSubmit}>
            Submit Budget
          </Button> */}
          <input type='submit'></input>
        </Table>
      </form>
    </TableContainer>
  )
}

export default IncomeTable
