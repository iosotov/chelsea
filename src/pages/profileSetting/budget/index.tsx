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

  // useEffect(() => {
  //   setData(budgets)
  // }, [])

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

  const mapRows = budgets.map((budget, index) => {
    //easier way to add index needed for rows prop?
    return {
      id: index,
      budgetId: budget.budgetId,
      name: budget.name,
      budgetType: budget.budgetType,
      description: budget.description,
      active: budget.active
    }
  })

  console.log(mapRows)

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

      <DataGrid rows={mapRows} columns={columns} checkboxSelection sx={{ mt: 7 }} />
      <CreateBudgetDrawer open={openBudgetDrawer} toggle={toggleDrawer} />
    </>
  )
}

export default BudgetSetting
