// import { useState, useEffect, MouseEvent, useCallback, SyntheticEvent, FC, useRef } from 'react'
import { useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import Button from '@mui/material/Button'

// import Select from '@mui/material/Select'
// import Switch from '@mui/material/Switch'
// import Divider from '@mui/material/Divider'
// import MenuItem from '@mui/material/MenuItem'

// import { styled } from '@mui/material/styles'

// import TextField from '@mui/material/TextField'
// import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import CardContent from '@mui/material/CardContent'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'

// import IncomeTable from 'src/views/pages/user/view/components/budget/IncomeTable'
import ChildComponent from './components/budget/income'
import ExpenseTable from 'src/views/pages/user/view/components/budget/ExpenseTable'

//api imports

import { useAppSelector } from 'src/store/hooks'

// import { Profile, selectAllProfiles, useGetProfilesQuery } from 'src/store/api/profileApiSlice'

// import { useGetBudgetsQuery, useGetProfileBudgetsQuery,  } from 'src/store/api/profileBudgetApiSlice'
import {
  // selectAllBudgets,
  // selectAllProfileBudgets,
  selectProfileBudgetsByProfileId,
  selectIncomeBudgetsByProfileId,
  selectExpenseBudgetsByProfileId,
  selectIncomeTotalByProfileId,
  selectExpenseTotalByProfileId
} from 'src/store/profileBudgetSlice'

// import { left } from '@popperjs/core'
// import { ValidationError } from 'yup'
import {
  useGetProfileBudgetsQuery,

  // useGetBudgetsQuery,

  // useGetBudgetInfoQuery,
  usePutProfileBudgetsUpdateMutation,
  usePostBudgetCreateMutation,

  // usePutBudgetDisableMutation,
  // usePutBudgetEnableMutation,
  // usePutBudgetUpdateMutation,
  useGetEnrollmentQuery
} from 'src/store/api/apiHooks'

import { selectEnrollmentByProfileId } from 'src/store/enrollmentSlice'

// import { usePostEnrollmentSearchQuery } from 'src/store/api/apiHooks'

// import { gridColumnPositionsSelector } from '@mui/x-data-grid'

// interface FormData {
//   name: string
//   amount: number
// }

export default function ProfileBudget({ id }: any) {
  //add isLoading?
  console.log(id)

  const { register, handleSubmit, getValues, setValue, control } = useForm()


  // const [data, setData] = useState<Profile[] | {}>({})

  // const [isLoading, setLoading] = useState(false)
  // const [allBudgets, setAllBudgets] = useState<any>([])
  // const [budgetTypes, setBudgetTypes] = useState<any>([])

  function handleBudgetSubmit(data: Type ){

    const newRes: ProfileBudgetUpdateType = {..data, profileId: id}
    putTrigger

  }

  const profileId = id

  //isFetching, isInitialized
  const profileBudgets = useAppSelector(state => selectProfileBudgetsByProfileId(state, profileId))
  console.log(profileBudgets)

  const incomeBudgets = useAppSelector(state => selectIncomeBudgetsByProfileId(state, profileId))
  console.log(incomeBudgets)

  const expenseBudgets = useAppSelector(state => selectExpenseBudgetsByProfileId(state, profileId))
  console.log(expenseBudgets)

  const incomeTotal = useAppSelector(state => selectIncomeTotalByProfileId(state, profileId))
  console.log(incomeTotal)

  const expenseTotal = useAppSelector(state => selectExpenseTotalByProfileId(state, profileId))
  console.log(expenseTotal)

  useGetEnrollmentQuery(profileId)
  const enrollments = useAppSelector(state => selectEnrollmentByProfileId(state, profileId))
  console.log(enrollments)

  const allTotal = incomeTotal - expenseTotal

  //set data loading to a load Data function?
  //need to validate data loading
  if (enrollments) {
    const totalEnrolledBalance = enrollments.enrolledBalance
    console.log(totalEnrolledBalance)
    const cashFlow = totalEnrolledBalance - allTotal
  } else {
    const totalEnrolledBalance = 0
    console.log(totalEnrolledBalance)
    const cashFlow = totalEnrolledBalance - allTotal
  }
  const cashFlow = 0

  const { isLoading, isSuccess, isError } = useGetProfileBudgetsQuery(profileId, { skip: !profileId })

  console.log(isLoading, isSuccess, isError)

  // const [incomeSnap, setIncomeSnap] = useState<any>(null)
  // const [expenseSnap, setExpenseSnap] = useState<any>(null)

  // const [cashflow, setCashflow] = useState<any>(null)
  // const [totalBalance, setTotalBalance] = useState<any>(null)

  // const childFormRef = useRef<>(null)

  // console.log(budgets)

  //GET BY IDS, GET TOTAL FROM PROIFILE, DELETE OTHER UNEEDED, NEED USE STATE?

  // //api mock
  const [trigger, { isSuccess: triggerSuccess }] = usePostBudgetCreateMutation()
  const [putTrigger, { isSuccess: putTriggerSuccess }] = usePutProfileBudgetsUpdateMutation()

  // const handleIncomeFormSubmit = (formData: FormData) => {
  //   console.log('Data from child:', formData)
  // }

  // const [formDataList, setFormDataList] = useState<FormData[]>([])

  // const { register, handleSubmit } = useForm<FormData>()
  // const handleFormSubmit = (formData: FormData) => {
  //   // Make API call with the form data
  //   // console.log('Form data submitted:', formData)
  //   setFormList([...formList, formData])
  // }

  // const handleChildFormSubmit = () => {
  //   console.log('Child form submitted')
  // }

  // const handleParentButtonClick = () => {
  //   // childFormRef.current.handle
  //   // if (childFormRef.current) {
  //   //   console.log('yoooo')
  //   // }
  //   console.log('OMG WE DID IT')
  // }

  async function handleClick() {
    console.log('click')

    // childFormRef.current.onFormSubmit
    // if (childFormRef.current) {
    //   console.log('doooo')
    //   childFormRef.current.onFormSubmit()
    // }

    // childFormRef.current.submitForm()

    addFormDataToList(formDataList)

    //incomes
    const mapParams = getFormValues()
    console.log(mapParams)

    //combine expenese

    // }

    //dummy expense
    const partialExpense = [
      {
        budgetId: 'c85aae08-58ee-4531-b35d-db1e53de3868',
        amount: 511
      },
      {
        budgetId: 'fb065254-000a-44b4-ab42-de6939938bed',
        amount: 6
      },
      {
        budgetId: '06815f58-25f7-495f-9bcb-e56f60ad25c1',
        amount: 8
      },
      {
        budgetId: 'cf8c14ca-9375-4c87-94d9-6a8e30fb85d4',
        amount: 9
      },
      {
        budgetId: '2ce387bd-9893-4859-ad80-d03e809c115f',
        amount: 1
      },
      {
        budgetId: '185549cc-d0a4-4d64-a948-596669174cbf',
        amount: 0
      },
      {
        budgetId: '909ffbaa-edd1-4f42-b972-e08fb1b2a7fa',
        amount: 11
      },
      {
        budgetId: 'efbe1e6a-25cf-4ebb-86c9-c8ed2f76e28f',
        amount: 0
      },
      {
        budgetId: '757c889d-c562-44a6-a91d-d1fd4a362af9',
        amount: 0
      },
      {
        budgetId: 'f6400ac7-4451-4f4f-a2bf-87df7e3a2660',
        amount: 0
      },
      {
        budgetId: '17ca1546-38ec-49a5-99aa-9141749c7e1e',
        amount: 0
      },
      {
        budgetId: 'a3133f51-23d1-40b0-a8aa-dfd170baf8e6',
        amount: 0
      },
      {
        budgetId: 'ae301956-cd41-477b-b346-e54e669429ff',
        amount: 0
      },
      {
        budgetId: 'ec083c9b-a182-40e3-a8e7-09543d760e7e',
        amount: 0
      },
      {
        budgetId: '4ef5e81e-e3d2-43c2-afc2-55153ca7b38b',
        amount: 0
      },
      {
        budgetId: '4cb707ca-3579-4fb9-aa60-151fd4787ce1',
        amount: 0
      },
      {
        budgetId: '9aaede98-e834-463c-8cde-5cbd61c29628',
        amount: 0
      }
    ]
    console.log(partialExpense)
    const combined = mapParams.concat(partialExpense)
    console.log(combined)

    // handleChildFormSubmit()

    // if (childFormRef.current) {
    //   childFormRef.current.dispatchEvent(new Event("submit", { cancelable: true }));
    // }

    // addFormDataToList(formDataList)
    // if (childFormRef.current) {
    //   console.log('child submit from parent')
    //   childFormRef.current.submit()
    // }

    //need to configure values to set

    const testData = {
      profileId,
      budgets: combined
    }

    console.log(testData)

    // await trigger(testData).unwrap()
    await putTrigger(testData).unwrap()
  }

  // const createBudgetClick = () => {}

  const getFormValues = () => {
    console.log(formDataList)
    const filter: [] = []
    const values = profileBudgets.map(profileBudget => profileBudget.budgetId)
    console.log(values)

    // console.log(values.map(value => value.type))

    // console.log(values)
    // const myValues = values.map(value => formDataList.getAll(value))
    // const myValues = formDataList.map(form => form.getAll(values.forEach()))
    // const lol = values.map(value => value)
    // console.log(lol)
    const check = (item: any) => {
      console.log(item)
      const fields = formDataList.map(el => el.getAll(item))
      console.log(fields)
      fields
        .filter(ele => ele.length > 0)
        .forEach(ele => {
          // filter.push(item)
          filter.push({ budgetId: item, amount: Number(ele[0]) })
        })
      console.log(fields)
      console.log(filter)

      // const hi = fields.map(item => mine.push(item.length > 0))
      // const filter = lol.reduce
      // console.log(hi)

      // const entry = lol.map(item => item.length > 0)
      // entry.map(ent => ent == true)

      // if (lol) {
      //   console.log(lol)
      //   mine.push(lol)
      // }
    }
    values.map(value => check(value))

    // setFormDataList(filter)
    console.log(formDataList)

    console.log(filter)

    //set this filter to the income data and also make an expense one

    return filter
  }

  const addFormDataToList = (formDataList: FormData[]) => {
    console.log(formDataList)

    // handleClick()
    setFormDataList([...formDataList])
    console.log(formDataList.entries)
  }
  console.log(formDataList.entries)

  // const LoadData = () => {
  //   console.log('Loading')
  //   const newProfile = useGetProfileBudgetsQuery('1327485548')

  //   useGetBudgetsQuery({})

  //   // setAllBudgets()
  //   // setBudgetTypes
  //   if (newProfile.data) {
  //     console.log(newProfile.data.budget)
  //     console.log(newProfile.data.profile)
  //     const myBudgets = newProfile.data.profile
  //     const myTypes = newProfile.data.budget
  //     console.log(myTypes)
  //     console.log(myBudgets)

  // myTypes.map(mine => (if (mine.active){
  //   console.log(mine)
  // }

  // ))

  //     const newList = myTypes.filter(mine => mine.active)
  //     const findItem = (myId) => {
  //       return myBudgets.find((item) => item.budgetId === myId);
  //     };
  // newList.map((element)=>findItem(element.budgetId))
  //     myBudgets.filter(yours => yours.budgetId == )
  //     console.log(newList)

  // myList.map(mine => (if(mine.)))
  // {templateDrop.map(temp => (
  //   <MenuItem key={temp.key} value={temp.value}>
  //     {temp.value}
  //   </MenuItem>
  // ))}
  // setBudgetTypes(newProfile.data.budget)
  // setAllBudgets(newProfile.data.profile)
  //   }
  // }

  const resetForm = () => {
    const formReset = profileBudgets.map(item => {
      if (item.amount != 0) {
        return { ...item, amount: 0 }
      } else {
        return { ...item, amount: item.amount }
      }
    })

    console.log(formReset)

    //set form reset to data and rerender
    // setAllBudgets(formReset)
  }

  //api calls

  // LoadData()

  //Snap cards summary functions

  // const getTotalFunds = () => {
  //   const sum = incomeSnap - expenseSnap
  //   setTotalFunds(sum)
  //   console.log(sum)
  //   console.log(totalFunds)
  //   getCashFlow()
  // }

  // const getTotalBalance = () => {
  //   //api call

  //   setTotalBalance(1000)

  //   // getCashFlow()
  // }

  // const getCashFlow = () => {
  //   //call api to get total balance and set it initially

  //   const flow = totalBalance - totalFunds
  //   setCashflow(flow)
  //   console.log(flow)
  // }

  // isSuccess &&

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
                    {/* <Typography variant='h6'>${totalFunds ?? 'No Funds'}</Typography> */}
                    {/* <Typography variant='body2'>{incomeSnap}</Typography> */}
                    <Typography variant='subtitle1'>Income: ${incomeTotal ?? ''}</Typography>
                    <Typography variant='subtitle1'>Expense: ${expenseTotal ?? ''}</Typography>
                    {/* <Typography variant='body2' sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    Edit Role
                  </Typography> */}
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
                    {/* <Typography variant='h6'>{totalBalance ?? 'No Balance'}</Typography> */}
                    <Typography variant='h6'>${allTotal}</Typography>

                    {/* <Typography variant='body2'>""</Typography>
                    <Typography variant='h6'>""</Typography> */}

                    {/* <Typography variant='h6'>{profiles[0].enrolledBalance}</Typography> */}
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
                    {/* <Typography variant='h6'>${cashflow}</Typography> */}
                    <Typography variant='h6'>${cashFlow}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <form onSubmit={handleSubmit}
        <Grid item xs={12}>
          {/* //make sure data coming in isnt object, map */}
          {/* <IncomeTable budgetTypes={budgetTypes} budgetList={allBudgets} income={income}></IncomeTable> */}
          {/* <IncomeTable income={incomeBudgets} onSubmit={handleIncomeFormSubmit}></IncomeTable> */}
          {/* <ChildComponent register={register} onSubmit={handleSubmit(handleFormSubmit)} data={incomeBudgets} /> */}
          {/* <ChildComponent onFormSubmit={addFormDataToList} data={incomeBudgets} /> */}
          {/* <ChildComponent
            onFormSubmit={handleChildFormSubmit}
            // submitForm={handleParentButtonClick}
            data={incomeBudgets}

          /> */}
          <ChildComponent onFormSubmit={addFormDataToList} data={incomeBudgets} />
          {/* <ChildComponent onFormSubmit={handleClick} data={incomeBudgets} ref={childFormRef} /> */}
          {/* <ChildComponent onFormSubmit={handleClick} data={incomeBudgets} ref={childFormRef} /> */}
          {/* <BudgetTableGenerator
            budgetTypes={profileBudgets}
            budgetList={budgets}
            incomeList={income}
            expenseList={expense}
          ></BudgetTableGenerator> */}
          {/* <BudgetTableGenerator budgetList={allBudgets} budgetTypes={budgetTypes}></BudgetTableGenerator> */}
        </Grid>
        <Grid item xs={12}>
          <ExpenseTable expense={expenseBudgets}></ExpenseTable>
          {/* <ExpenseTable budgetTypes={budgetTypes} budgetList={allBudgets} expense={expense}></ExpenseTable> */}
        </Grid>
        <Grid item xs={12} textAlign={'right'}>
          <Button variant='outlined' color='secondary' sx={{ mr: 4 }} onClick={resetForm}>
            Clear Form
          </Button>
          {/*
          <Button type='submit' variant='contained' onClick={handleClick}>
            Submit Budget
          </Button> */}
          <Button type='submit' variant='contained' onClick={handleClick}>
            Submit Budget
          </Button>

          {/* <Button type='submit' variant='contained' onClick={handleParentButtonClick}>
            Submit Budget
          </Button> */}
        </Grid>
      </Grid>
    </>
  )
}
