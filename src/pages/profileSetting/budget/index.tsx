// import { MouseEvent, SyntheticEvent, useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { useState } from 'react'
import Button from '@mui/material/Button'
import CreateBudgetDrawer from './CreateBudgetDrawer'

import { useAppSelector } from 'src/store/hooks'

import { selectAllBudgets } from 'src/store/profileBudgetSlice'
import { useGetBudgetsQuery } from 'src/store/api/apiHooks'
import { BudgetEnum } from 'src/store/api/profileBudgetApiSlice'
import { Box, Card, CardContent, CircularProgress } from '@mui/material'

const BudgetSetting = () => {

  const budgets = useAppSelector(selectAllBudgets)
  const [openBudgetDrawer, setOpenBudgetDrawer] = useState<boolean>(false)

  const { isLoading, isError, isSuccess } = useGetBudgetsQuery()
  const toggleDrawer = () => setOpenBudgetDrawer(!openBudgetDrawer)

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Budget Name',
      flex: 1,
      editable: true
    },
    {
      field: 'active',
      headerName: 'Status',
      flex: 1,
      editable: true
    },
    {
      field: 'budgetType',
      headerName: 'Budget Type',
      flex: 1,
      editable: true,
      valueGetter: (params: GridValueGetterParams) =>
        `${BudgetEnum[params.row.budgetType]}`
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      editable: true
    }
  ]

  if (isError) return <div>There was an error on this page</div>

  return (
    <>
      <Card>
        <CardContent >
          <Box sx={{ mb: 7 }}>
            <Button
              size='medium'
              type='submit'
              variant='contained'
              color='secondary'
              onClick={toggleDrawer}
            >
              Create Budget
            </Button>
          </Box>
          {isLoading && <CircularProgress />}
          {isSuccess && <DataGrid getRowId={r => r.budgetId} rows={budgets} columns={columns} checkboxSelection sx={{ height: 400 }} />}
        </CardContent>
      </Card>
      <CreateBudgetDrawer open={openBudgetDrawer} toggle={toggleDrawer} />
    </>
  )


}

export default BudgetSetting
