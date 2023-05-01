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

import IncomeTable from 'src/views/pages/user/view/components/budget/IncomeTable'
import ExpenseTable from 'src/views/pages/user/view/components/budget/ExpenseTable'

// import BudgetTableGenerator from './components/budget/BudgetTableGenerator'

//api imports

import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { Profile, selectAllProfiles, useGetProfilesQuery } from 'src/store/api/profileApiSlice'

// import { useGetBudgetsQuery, useGetProfileBudgetsQuery,  } from 'src/store/api/profileBudgetApiSlice'
import { selectAllBudgets, selectAllProfileBudgets } from 'src/store/profileBudgetSlice'
import { left } from '@popperjs/core'
import { ValidationError } from 'yup'
import { useGetProfileBudgetsQuery, useGetBudgetsQuery, usePostProfileBudgetsMutation } from 'src/store/api/apiHooks'

export default function ProfileBudget({ id }: any) {
  //add isLoading?
  console.log(id)
  const [data, setData] = useState<Profile[] | {}>({})
  const [isLoading, setLoading] = useState(false)
  const [allBudgets, setAllBudgets] = useState<any>([])
  const [budgetTypes, setBudgetTypes] = useState<any>([])

  // const [incomeList, setIncomeList] = useState<any>([])
  // const [expenseList, setExpenseList] = useState<any>([])

  const [income, setIncome] = useState<any>([])
  const [expense, setExpense] = useState<any>([])

  // const profiles = useAppSelector(selectAllProfiles)
  // const budgets = useAppSelector(selectAllBudgets)
  // const profileBudgets = useAppSelector(selectAllProfileBudgets)

  // const a = useGetProfileBudgetsQueryMock(profileId)

  // console.log(budgets)

  // //api mock
  const [trigger, { isSuccess: triggerSuccess }] = usePostProfileBudgetsMutation()
  const { data: newProfile } = useGetProfileBudgetsQuery(id)
  const profileId = id
  async function handleClick() {
    const testData = {
      profileId,
      budgets: [
        {
          budgetId: '9da97f8e-6e71-4091-b590-ed22be4cddb2',
          amount: 10
        },
        {
          budgetId: 'a7028bfb-c866-4938-90c0-f245c5909683',
          amount: 20
        }
      ]
    }
    console.log('LMAOOOo')
    console.log(testData)
    await trigger(testData).unwrap()
  }

  // const { data: newProfile } = useGetProfileBudgetsQuery('1327485548')

  // const { data: newProfile } = useGetProfileBudgetsQuery(id)
  // useGetBudgetsQuery({})
  // console.log(newProfile)

  //useeffect data init
  useEffect(() => {
    if (newProfile) {
      console.log(newProfile)
      setBudgetTypes(newProfile.budget)
      dataSplitter()
    }
  }, [newProfile, budgetTypes])
  useEffect(() => {
    if (newProfile) {
      console.log(newProfile)
      setAllBudgets(newProfile.profile)
      dataSplitter()
    }
  }, [newProfile, allBudgets])

  const dataSplitter = () => {
    if (budgetTypes && allBudgets) {
      console.log(budgetTypes)
      console.log(allBudgets)
      const budgetArr: any = []
      const typeArr: any = []
      const incomeList: any = []
      const expenseList: any = []
      let i = 0
      for (i = 0; i < budgetTypes.length; i++) {
        console.log(budgetTypes[i])
        if (budgetTypes[i].active) {
          if (budgetTypes[i].budgetType == 0) {
            const choiceId = budgetTypes[i].budgetId
            const filteredIncome = allBudgets.find(filteredIncome => filteredIncome.budgetId == choiceId)
            if (filteredIncome) {
              console.log(filteredIncome)
              incomeList.push(filteredIncome)
            } else {
              const notFound = { budgetId: choiceId, amount: 0 }

              //                 console.log(notFound)
              //                 incomeList.push(notFound)
              incomeList.push(notFound)
            }
            setIncome(incomeList)
          } else {
            const choiceId = budgetTypes[i].budgetId
            const filteredExpense = allBudgets.find(filteredExpense => filteredExpense.budgetId == choiceId)
            if (filteredExpense) {
              console.log(filteredExpense)
              expenseList.push(filteredExpense)
            } else {
              const notFound = { budgetId: choiceId, amount: 0 }

              //                 console.log(notFound)
              //                 incomeList.push(notFound)
              expenseList.push(notFound)
            }
            setExpense(expenseList)
          }
        }
      }
      console.log(incomeList, expenseList)

      // setIncome(incomeList)
      // setExpense(expenseList)
    }
  }

  // useEffect(() => {
  //   console.log(newProfile)
  //   console.log(data)
  //   if (newProfile) {
  //     console.log(newProfile)
  //     let arr: any = []
  //     let budgeType: any = []
  //     const incomeList: any = []
  //     const expenseList: any = []
  //     console.log(newProfile)
  //     if (newProfile != undefined) {
  //       console.log(newProfile.profile, newProfile.budget)
  //       if (newProfile.profile != undefined) {
  //         arr = newProfile.profile
  //         console.log(arr)

  //         // setAllBudgets(arr)
  //       }
  //       if (newProfile.budget != undefined) {
  //         budgeType = newProfile.budget
  //         console.log(budgeType)

  //         //separting income and expense
  //         let i = 0
  //         for (i = 0; i < budgeType.length; i++) {
  //           console.log(budgeType[i])
  //           if (budgeType[i].active) {
  //             if (budgeType[i].budgetType == 0) {
  //               const choiceId = budgeType[i].budgetId

  //               // console.log(choiceId)
  //               console.log(newProfile.profile)
  //               console.log(newProfile.budget)

  //               //do check outside,
  //               // const filteredIncome = newProfile.budget.find(filteredIncome => filteredIncome.budgetId == choiceId)
  //               const filteredIncome = newProfile.profile.find(filteredIncome => filteredIncome.budgetId == choiceId)

  //               // const findAmount = newProfile.profile.find(findAmount => findAmount.budgetId == choiceId)
  //               // console.log(findAmount)
  //               console.log(filteredIncome)
  //               if (filteredIncome) {
  //                 console.log(filteredIncome)
  //                 incomeList.push(filteredIncome)
  //               } else {
  //                 const notFound = { budgetId: choiceId, amount: 0 }

  //                 console.log(notFound)
  //                 incomeList.push(notFound)

  //                 // arr.push(notFound)
  //                 // arr = [...arr, notFound]
  //                 // console.log(arr)
  //               }

  //               // if (findAmount == undefined) {
  //               //   console.log('not found')
  //               //   const notFound = { budgetId: choiceId, amount: 0 }

  //               //   console.log(notFound)

  //               //   arr.push(notFound)
  //               // }

  //               // incomeList.push(filteredChoice)
  //               // console.log(incomeList)
  //             } else {
  //               const choiceId = budgeType[i].budgetId
  //               console.log(choiceId)

  //               // const filteredExpense = newProfile.budget.find(filteredExpense => filteredExpense.budgetId == choiceId)
  //               const filteredExpense = newProfile.profile.find(filteredExpense => filteredExpense.budgetId == choiceId)

  //               if (filteredExpense) {
  //                 console.log(filteredExpense)
  //                 expenseList.push(filteredExpense)
  //               } else {
  //                 const notFound = { budgetId: choiceId, amount: 0 }
  //                 expenseList.push(notFound)

  //                 // arr.push(notFound)
  //               }

  //               // expenseList.push(budgeType[i])
  //             }
  //           }
  //         }

  //         //separate income and outcome
  //         console.log(arr)
  //         console.log(incomeList)
  //         console.log(expenseList)
  //         console.log(budgeType)

  //         // setAllBudgets(arr)
  //       }

  //       // if (newProfile.profile.length > 0) {
  //       //   newProfile.profile.forEach((e: any) => {
  //       //     arr.push(newProfile.profile[e])
  //       //   })
  //       // }
  //       // newProfile.profile.forEach((i: any) => {
  //       //   console.log(newProfile.profile[i])
  //       //   arr.push(newProfile.profile[i])
  //       // })

  //       // arr = newProfile.profile
  //       // console.log(arr)

  //       // arr = newProfile.profile
  //     }
  //     const joined = incomeList.concat(expenseList)
  //     console.log(joined)

  //     setTimeout(() => {
  //       // setAllBudgets(arr)

  //       //setAllBudgets(joined)
  //       //setBudgetTypes(budgeType)

  //       setIncome(incomeList)
  //       setExpense(expenseList)
  //     }, 1500)

  //     console.log(arr)
  //     console.log(allBudgets)
  //     console.log(incomeList, expenseList)
  //   } else {
  //     console.log('No Data')
  //   }
  // }, [newProfile, allBudgets, budgetTypes])

  console.log(allBudgets, budgetTypes)

  console.log(income, expense)

  console.log(allBudgets)
  console.log(budgetTypes)

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

  // console.log(useGetProfilesQuery(data))
  // useGetProfileBudgetsQuery('1327485548')
  // useGetBudgetsQuery({})

  // console.log(isLoading)

  const LoadData = () => {
    console.log('Loading')
    const newProfile = useGetProfileBudgetsQuery('1327485548')

    useGetBudgetsQuery({})

    // setAllBudgets()
    // setBudgetTypes
    if (newProfile.data) {
      console.log(newProfile.data.budget)
      console.log(newProfile.data.profile)
      const myBudgets = newProfile.data.profile
      const myTypes = newProfile.data.budget
      console.log(myTypes)
      console.log(myBudgets)

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
      console.log(budgetTypes)
      console.log(allBudgets)
    }
  }

  const resetForm = () => {
    console.log(data)
    console.log(budgets, profileBudgets, profiles)

    const formReset = profileBudgets.map(item => {
      if (item.amount != 0) {
        return { ...item, amount: 0 }
      } else {
        return { ...item, amount: item.amount }
      }
    })

    console.log(formReset)

    //set form reset to data and rerender
    setAllBudgets(formReset)

    console.log(allBudgets)
  }

  //api calls
  const createBudget = () => {
    console.log(allBudgets)
    console.log(budgetTypes)
    console.log(income)
    console.log(expense)

    //combine income and expense for payload
    //send profile Id?

    const payload = income.concat(expense)

    // console.log(joined)
  }

  console.log(allBudgets)

  // LoadData()

  // budgetSeparator()

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
          {/* //make sure data coming in isnt object, map */}
          <IncomeTable budgetTypes={budgetTypes} budgetList={allBudgets} income={income}></IncomeTable>
          {/* <BudgetTableGenerator
            budgetTypes={profileBudgets}
            budgetList={budgets}
            incomeList={income}
            expenseList={expense}
          ></BudgetTableGenerator> */}
          {/* <BudgetTableGenerator budgetList={allBudgets} budgetTypes={budgetTypes}></BudgetTableGenerator> */}
        </Grid>
        <Grid item xs={12}>
          <ExpenseTable budgetTypes={budgetTypes} budgetList={allBudgets} expense={expense}></ExpenseTable>
        </Grid>
        <Grid item xs={12} textAlign={'right'}>
          <Button variant='outlined' color='secondary' sx={{ mr: 4 }} onClick={resetForm}>
            Clear Form
          </Button>

          <Button type='submit' variant='contained' onClick={handleClick}>
            Submit Budget
          </Button>
        </Grid>
      </Grid>
    </>
  )
}
