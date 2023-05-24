// import { MouseEvent, SyntheticEvent, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import { usePostContactSearchQuery } from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { selectAllContacts } from 'src/store/settingSlice'
import { Box, Card, CardContent, CircularProgress } from '@mui/material'

const ContactsSetting = () => {


  const { isLoading, isError, isSuccess } = usePostContactSearchQuery({})
  const contacts = useAppSelector(selectAllContacts)

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'typeName',
      headerName: 'Type',
      flex: 1,
    },
    {
      field: 'required',
      headerName: 'Required',
      flex: 1,
    },
    {
      field: 'createdByName',
      headerName: 'Created By',
      flex: 1,

    },
    {
      field: 'active',
      headerName: 'Active',
      flex: 1,
    },
  ]

  if (isError) return <div>There was error on this page</div>

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
            Create Contact
          </Button>
        </Box>
        {isLoading && <CircularProgress />}
        {isSuccess && <DataGrid getRowId={r => r.contactId} rows={contacts} columns={columns} checkboxSelection sx={{ height: 400 }} />}
      </CardContent>
    </Card>
  )

}

export default ContactsSetting
