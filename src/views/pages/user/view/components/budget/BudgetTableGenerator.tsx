import { useState, React, useEffect } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Box from '@mui/material/Box'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import { Typography } from '@mui/material'
import { string } from 'yup'
import { callbackify } from 'util'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { Profile, selectAllProfiles, useGetProfilesQuery } from 'src/store/api/profileApiSlice'

import { useGetBudgetsQuery, useGetProfileBudgetsQuery } from 'src/store/api/profileBudgetApiSlice'
import { selectAllBudgets, selectAllProfileBudgets } from 'src/store/profileBudgetSlice'

const createData = (expenseType: string, amount: number) => {
  return { expenseType, amount }
}

const rows = [
  createData('expense', 100),
  createData('expenses', 10),
  createData('expensing', 30),
  createData('expensenull', 0)
]

const BudgetTableGenerator = (data: []) => {
  // console.log(rows)
  // let i = 0
  // for (i = 0; i < rows.length; i++) {
  //   ;<TableContainer component={Paper}></TableContainer>
  // }
  // const [, setState] = React.useState<any>()

  // const forceUpdate = React.useCallback(() => setState({}), [])
  // const [isLoading, setLoading] = useState(false)
  // const [myAmount, setAmount] = useState(0)
  console.log(data)
  const [myData, setmyData] = useState(null)
  const [allBudgets, setAllBudgets] = useState([])
  const [budgetTypes, setBudgetTypes] = useState([])
  const budgets = useAppSelector(selectAllBudgets)
  const profileBudgets = useAppSelector(selectAllProfileBudgets)
  useGetProfileBudgetsQuery('1327485548')
  useGetBudgetsQuery({})
  console.log(budgets, profileBudgets)

  // setAllBudgets(profileBudgets)
  // setBudgetTypes(budgets)

  // async function fetchData() {
  //   if (data) {
  //     setAllBudgets(data.budgetTypes)
  //     setBudgetTypes(data.budgetList)
  //   }
  // }
  // fetchData()

  // setAllBudgets(data.budgetList)
  // setBudgetTypes(data.budgetTypes)
  console.log(allBudgets)
  console.log(budgetTypes)

  const incomeList = []
  const expenseList = []

  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await myData
  //     console.log(response), setmyData(response)
  //   }
  //   fetchData()
  // }, [])

  // const [budgetType, setBudgetType] = useState(data.type)
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

  // forceUpdate()

  // const getExpense = choice => {
  //   console.log(expenseList)
  //   const mine = expenseList.find(element => element.budgetId == choice)
  //   console.log(mine)
  // }
  // getExpense('9da97f8e-6e71-4091-b590-ed22be4cddb2')
  const GetBudgetbyId = choice => {
    console.log('rendering...')
    if (data.budgetTypes != undefined || data.budgetTypes.length != 0) {
      const mine = data.budgetTypes.find(element => element.budgetId == choice)

      console.log(mine)
      if (mine != undefined) {
        console.log(mine.amount)
        console.log('dude')

        // setLoading(true)

        // console.log(isLoading)
        // setAmount(mine.amount)
        // console.log(myAmount)

        return String(mine.amount)
      }
    } else {
      console.log('null')

      // setLoading(true)
    }

    // setLoading(true)

    //setup so that it is async and loads data into label after determining
  }

  //  budgetTypes.map(budgets.filter(budget=> budget.budgetId === budgetTypes.budgetId )
  // if (isLoading) {
  //   return <div>Loading...</div>
  // } else {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Income Type</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>

        {/* {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Loading...</Typography>
          </Box>
        ) : ( */}

        <TableBody>
          {incomeList.map(budget => (
            //use index and profile list to mathch index and print
            // var me = getBudgetbyId(budget.budgetId);
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
                {/* {getBudgetbyId(budget.budgetId)} */}
              </TableCell>
              <TableCell align='right'>
                <TextField fullWidth label='Amount' defaultValue={GetBudgetbyId(budget.budgetId)} placeholder='Amount'>
                  {' '}
                  {/* getBudgetbyId(budget.budgetId) */}
                  {/* value={getBudgetbyId(budget.budgetId)} */}
                  {/* Map budget data amount to show  */}
                  {/* Trying to grab same budget using budget id to filter and return amount prop */}
                  {/* {getBudgetbyId(budget.budgetId)} */}
                </TextField>
              </TableCell>
              {/* <Typography>{getBudgetbyId(budget.budgetId)}</Typography> */}
            </TableRow>
          ))}
        </TableBody>

        {/* )} */}
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
                <TextField fullWidth label='Amount' defaultValue='0' placeholder='Amount'>
                  {/* {' '} */}
                  {/* {myBudgetList.filter} */}
                  {/* {getBudgetbyId(budget.budgetId)} */}
                  {/* {myBudgetList.find(element => element.budgetId == budget.budgetId)} */}
                  {/* {expenseList[budgetId]} */}
                </TextField>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

// }
export default BudgetTableGenerator
