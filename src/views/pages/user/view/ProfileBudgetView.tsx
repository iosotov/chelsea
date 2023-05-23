import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import { useForm } from 'react-hook-form'

import IncomeTable from './components/budget/IncomeTable'
import ExpenseTable from './components/budget/ExpenseTable'

import { useAppSelector } from 'src/store/hooks'

import {
  selectProfileBudgetsByProfileId,
  selectIncomeBudgetsByProfileId,
  selectExpenseBudgetsByProfileId,
  selectIncomeTotalByProfileId,
  selectExpenseTotalByProfileId
} from 'src/store/profileBudgetSlice'

import {
  useGetProfileBudgetsQuery,
  usePutProfileBudgetsUpdateMutation,
  useGetEnrollmentQuery
} from 'src/store/api/apiHooks'

import { selectEnrollmentByProfileId } from 'src/store/enrollmentSlice'
import { ProfileBudgetItemType, ProfileBudgetUpdateType } from 'src/store/api/profileBudgetApiSlice'

interface ProfileBudgetProps {
  id: string
}
export default function ProfileBudget({ id }: ProfileBudgetProps) {
  const profileId = id
  const { handleSubmit, control } = useForm()

  const onSubmit = (data: Record<string, { amount: string }>) => {
    console.log(data)
    const myForm = Object.entries(data).map(([k, v]) => {
      return { budgetId: k, amount: Number(v.amount) }
    })

    console.log(myForm)
    handleClick(myForm)
  }

  const profileBudgets = useAppSelector(state => selectProfileBudgetsByProfileId(state, profileId))
  const incomeBudgets = useAppSelector(state => selectIncomeBudgetsByProfileId(state, profileId))
  const expenseBudgets = useAppSelector(state => selectExpenseBudgetsByProfileId(state, profileId))
  const incomeTotal = useAppSelector(state => selectIncomeTotalByProfileId(state, profileId))
  const expenseTotal = useAppSelector(state => selectExpenseTotalByProfileId(state, profileId))
  useGetEnrollmentQuery(profileId)
  const enrollments = useAppSelector(state => selectEnrollmentByProfileId(state, profileId))

  const allTotal = incomeTotal - expenseTotal
  let cashFlow = 0
  if (enrollments) {
    cashFlow = enrollments.enrolledBalance - allTotal
  }

  const { isLoading, isSuccess, isError } = useGetProfileBudgetsQuery(profileId, { skip: !profileId })

  const [putTrigger, { isLoading: putTriggerLoading }] = usePutProfileBudgetsUpdateMutation()

  async function handleClick(formValues: ProfileBudgetItemType[]) {
    const testData: ProfileBudgetUpdateType = {
      profileId,
      budgets: formValues
    }
    await putTrigger(testData).unwrap()
  }

  const resetForm = () => {
    const formReset = profileBudgets.map(item => {
      if (item.amount != 0) {
        return { ...item, amount: 0 }
      } else {
        return { ...item, amount: item.amount }
      }
    })
    console.log(formReset)
  }

  if (isError) return <div>An error occured</div>

  if (isLoading) return <div>Loading</div>

  if (isSuccess)
    return (
      <>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant='h5'>Monthly Budget Summary</Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 1, mb: 2.5, display: 'flex', alignItems: 'center', width: 1, gap: 3 }}>
              <Card sx={{ width: 1 / 3, height: 150, mr: 'auto' }}>
                <CardContent>
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='h6'>{`Cash Funds Available`}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                      <Typography variant='subtitle1'>Income: ${incomeTotal ?? ''}</Typography>
                      <Typography variant='subtitle1'>Expense: ${expenseTotal ?? ''}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card sx={{ width: 1 / 3, height: 150, mr: 'auto' }}>
                <CardContent>
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='h6'>{`Total Balance`}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                      <Typography variant='h6'>${allTotal}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card sx={{ width: 1 / 3, height: 150, mr: 'auto' }}>
                <CardContent>
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='h6'>{`Cash Flow`}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                      <Typography variant='h6'>${cashFlow}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <IncomeTable control={control} onSubmit={handleSubmit(onSubmit)} data={incomeBudgets}></IncomeTable>
          </Grid>
          <Grid item xs={12}>
            <ExpenseTable control={control} onSubmit={handleSubmit(onSubmit)} data={expenseBudgets}></ExpenseTable>
          </Grid>
          <Grid item xs={12} textAlign={'right'}>
            <Button variant='outlined' color='secondary' sx={{ mr: 4 }} onClick={resetForm}>
              Clear Form
            </Button>
            <Button disabled={putTriggerLoading} variant='contained' onClick={handleSubmit(onSubmit)}>
              Submit Budget
            </Button>
          </Grid>
        </Grid>
      </>
    )
}
