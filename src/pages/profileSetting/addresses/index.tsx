import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import { usePostAddressSearchQuery } from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { selectAllAddresses } from 'src/store/settingSlice'
import { Box, Card, CardContent, CircularProgress } from '@mui/material'


const AddressSetting = () => {

  const { isLoading, isError, isSuccess } = usePostAddressSearchQuery({})
  const addressSettings = useAppSelector(selectAllAddresses)

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
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
            Create Address
          </Button>
        </Box>
        {isLoading && <CircularProgress />}
        {isSuccess && <DataGrid getRowId={r => r.addressId} rows={addressSettings} columns={columns} checkboxSelection sx={{ height: 400 }} />}
      </CardContent>
    </Card>
  )
}

export default AddressSetting
