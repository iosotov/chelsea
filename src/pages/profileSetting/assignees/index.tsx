// import { MouseEvent, SyntheticEvent, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import { useGetAssigneesQuery } from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { selectAllAssignees } from 'src/store/settingSlice'
import { Box, Card, CardContent, CircularProgress } from '@mui/material'

const AssigneeSetting = () => {


  const { isLoading, isError, isSuccess } = useGetAssigneesQuery()
  const assignees = useAppSelector(selectAllAssignees)

  const columns: GridColDef[] = [
    {
      field: 'assigneeName',
      headerName: 'Name',
      flex: 1,
      editable: true
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      editable: true
    },
    {
      field: 'companyName',
      headerName: 'Company Name',
      flex: 1,
      editable: true
    },
    {
      field: 'createdByName',
      headerName: 'Created By',
      flex: 1,
      editable: true
    },
    {
      field: 'active',
      headerName: 'Active',
      flex: 1,
      editable: true
    }
  ]

  if (isError) return <div>There was an error on this page</div>

  return (
    <Card>
      <CardContent >
        <Box sx={{ mb: 7 }}>
          <Button
            size='medium'
            type='submit'
            variant='contained'
            color='secondary'
          >
            Create Assignee
          </Button>
        </Box>
        {isLoading && <CircularProgress />}
        {isSuccess && <DataGrid getRowId={r => r.assigneeId} rows={assignees} columns={columns} checkboxSelection sx={{ height: 400 }} />}
      </CardContent>
    </Card>
  )
}

export default AssigneeSetting
