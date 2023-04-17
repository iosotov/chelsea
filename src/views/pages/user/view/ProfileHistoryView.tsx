// import { MouseEvent, SyntheticEvent, useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'

const ProfileHistory = () => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      editable: true
    },
    {
      field: 'createdBy',
      headerName: 'Created By ',
      width: 150,
      editable: true
    },
    {
      field: 'description',
      headerName: 'Age',

      // type: 'text',
      width: 110,
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

  return (
    <>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} checkboxSelection />
      </Box>
    </>
  )
}

export default ProfileHistory