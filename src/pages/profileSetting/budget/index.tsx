// import { MouseEvent, SyntheticEvent, useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { useState } from 'react'
import Button from '@mui/material/Button'
import CreateBudgetDrawer from './CreateBudgetDrawer'

import { useAppDispatch, useAppSelector } from 'src/store/hooks'

import { useGetBudgetsQuery, useGetProfileBudgetsQuery } from 'src/store/api/profileBudgetApiSlice'
import { selectAllBudgets, selectAllProfileBudgets } from 'src/store/profileBudgetSlice'

const BudgetSetting = () => {
  // const [data, setData] = useState<Profile[] | {}>({})
  // const profiles = useAppSelector(selectAllProfiles)

  const budgets = useAppSelector(selectAllBudgets)
  const [openBudgetDrawer, setOpenBudgetDrawer] = useState<boolean>(false)

  // const profileBudgets = useAppSelector(selectAllProfileBudgets)

  // val stores state for header filters
  // const [value, setValue] = useState<string>('')

  // useGetProfilesQuery(data)
  // useGetProfileBudgetsQuery('1327485548')
  useGetBudgetsQuery({})
  const toggleDrawer = () => setOpenBudgetDrawer(!openBudgetDrawer)

  console.log(budgets)

  // useEffect(() => {
  //   setData(budgets)
  // }, [])

  console.log('hi')
  console.log(budgets)
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Budget Name',
      width: 150,
      editable: true
    },
    {
      field: 'active',
      headerName: 'Status',
      width: 150,
      editable: true
    },
    {
      field: 'budgetType',
      headerName: 'Budget Type',

      // type: 'text',
      width: 110,
      editable: true
    },
    {
      field: 'description',
      headerName: 'Age',

      // type: 'text',
      width: 110,
      editable: true
    },
    {
      field: 'budgetId',
      headerName: 'budgetId',

      // type: 'text',
      width: 180,
      editable: true
    }

    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params: GridValueGetterParams) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
    // }
  ]

  const rows = [
    { id: 1, type: 'Snow', createdBy: 'Jon', description: 35 },
    { id: 2, type: 'Lannister', createdBy: 'Cersei', description: 42 },
    { id: 3, type: 'Lannister', createdBy: 'Jaime', description: 45 },
    { id: 4, type: 'Stark', createdBy: 'Arya', description: 16 },
    { id: 5, type: 'Targaryen', createdBy: 'Daenerys', description: null },
    { id: 6, type: 'Melisandre', createdBy: null, description: 150 },
    { id: 7, type: 'Clifford', createdBy: 'Ferrara', description: 44 },
    { id: 8, type: 'Frances', createdBy: 'Rossini', description: 36 },
    { id: 9, type: 'Roxie', createdBy: 'Harvey', description: 65 }
  ]

  // const GetRows = () => {
  //   const myRows = budgets.map((budget, index)=> {
  //     return{
  //       id: index,
  //       value: budget
  //     };
  //   })
  // }
  // GetRows()

  const myRows = budgets.map((budget, index) => {
    return {
      id: index,
      budgetId: budget.budgetId,
      name: budget.name,
      budgetType: budget.budgetType,
      description: budget.description,
      active: budget.active
    }
  })

  console.log(myRows)

  return (
    <>
      <Button
        size='medium'
        type='submit'
        variant='contained'
        color='secondary'
        sx={{ mb: 7, position: 'absolute', right: '150px' }}
        onClick={toggleDrawer}
      >
        Create
      </Button>
      <br></br>

      <DataGrid rows={myRows} columns={columns} checkboxSelection sx={{ mt: 7 }} />
      <CreateBudgetDrawer open={openBudgetDrawer} toggle={toggleDrawer} />
    </>
  )
}

export default BudgetSetting
