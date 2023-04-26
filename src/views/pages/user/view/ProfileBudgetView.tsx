import { useState, useEffect, MouseEvent, useCallback, SyntheticEvent } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import Button from '@mui/material/Button'

import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'

import { styled } from '@mui/material/styles'

import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import AlertTitle from '@mui/material/AlertTitle'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import BudgetTable from 'src/views/pages/user/view/components/budget/BudgetTable'
import ExpenseTable from 'src/views/pages/user/view/components/budget/ExpenseTable'
import BudgetTableGenerator from './components/budget/BudgetTableGenerator'

//api imports

import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { Profile, selectAllProfiles, useGetProfilesQuery } from 'src/store/api/profileApiSlice'

import { useGetBudgetsQuery, useGetProfileBudgetsQuery } from 'src/store/api/profileBudgetApiSlice'
import { selectAllBudgets, selectAllProfileBudgets } from 'src/store/profileBudgetSlice'

export default function ProfileBudget() {
  //addc isLoading?
  const [data, setData] = useState<Profile[] | {}>({})
  const [isLoading, setLoading] = useState(false)
  const profiles = useAppSelector(selectAllProfiles)
  const budgets = useAppSelector(selectAllBudgets)
  const profileBudgets = useAppSelector(selectAllProfileBudgets)

  // val stores state for header filters
  // const [value, setValue] = useState<string>('')

  // const handleChange = (e: SyntheticEvent, value: string) => {
  //   setLoading(true)
  //   setActiveTab(value)
  //   setTimeout(() => {
  //     router
  //       .push({
  //         pathname: `/profiles/${id}/${value.toLowerCase()}`
  //       })
  //       .then(() => setLoading(false))
  //   },300)
  // }
  // useEffect(() => {
  //   async function fetchData(){
  //     const result = await useGetProfilesQuery(data)
  //   }
  // })

  console.log(useGetProfilesQuery(data))
  useGetProfileBudgetsQuery('1327485548')
  useGetBudgetsQuery({})
  console.log(isLoading)

  // setLoading(true)

  // if (isLoading) {
  //   setLoading(false)
  // }
  console.log(isLoading)



  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>Monthly Budget Summary</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ mt: 1, mb: 2.5, display: 'flex', alignItems: 'center', width: 1, gap: 3 }}>
            <Card sx={{ width: 1 / 3, mr: 'auto' }}>
              <CardContent>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2'>{`Cash Funds Available`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                    <Typography variant='h6'>1 of 10 Enrolled</Typography>
                    {/* <Typography variant='body2' sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    Edit Role
                  </Typography> */}
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ width: 1 / 3, mr: 'auto' }}>
              <CardContent>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2'>{`Total Balance`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                    <Typography variant='h6'>$1,000,000</Typography>
                    {/* <Typography variant='h6'>{profiles[0].enrolledBalance}</Typography> */}
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ width: 1 / 3, mr: 'auto' }}>
              <CardContent>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2'>{`Cash Flow`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                    <Typography variant='h6'>$999,999,999</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12}>
          {/* <BudgetTable {...profileBudgets}></BudgetTable> */}
          <BudgetTableGenerator budgetTypes={profileBudgets} budgetList={budgets} type={1}></BudgetTableGenerator>
        </Grid>
        {/* <Grid item xs={12}>
          <ExpenseTable></ExpenseTable>
        </Grid> */}
        <Grid item xs={12} textAlign={'right'}>
          <Button variant='outlined' color='secondary' sx={{ mr: 4 }}>
            Clear Form
          </Button>

          <Button type='submit' variant='contained'>
            Submit Budget
          </Button>
        </Grid>
      </Grid>
    </>
  )
}
