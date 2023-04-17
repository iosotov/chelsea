import { MouseEvent, SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import Box from '@mui/material/Box'

// import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

import AccessRoles from './roles'
import AccessTeams from './teams'
import AccessUsers from './users'

// import Tasks from './tasks'

// const columns: GridColDef[] = [
//   { field: 'id', headerName: 'ID', width: 90 },
//   {
//     field: 'firstName',
//     headerName: 'First name',
//     width: 150,
//     editable: true
//   },
//   {
//     field: 'lastName',
//     headerName: 'Last name',
//     width: 150,
//     editable: true
//   },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 110,
//     editable: true
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (params: GridValueGetterParams) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
//   }
// ]

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
// ]

const AccessManagement = () => {
  // ** State
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label='nav tabs example'>
        <Tab
          value='1'
          component='a'
          label='Users'
          href='/accessManagement/users'
          onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
        />
        <Tab
          value='2'
          component='a'
          label='Roles'
          href='/accessManagement/roles'
          onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
        />
        <Tab
          value='3'
          component='a'
          label='Teams'
          href='/accessManagement/teams'
          onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
        />
      </TabList>
      <Divider sx={{ my: theme => `${theme.spacing(5)} !important` }}></Divider>
      <TabPanel value='1'>
        <Box sx={{ height: 400, width: '100%' }}>
          <AccessUsers></AccessUsers>
        </Box>
      </TabPanel>
      <TabPanel value='2'>
        <Box sx={{ height: 400, width: '100%' }}>
          <AccessRoles></AccessRoles>
        </Box>
      </TabPanel>
      <TabPanel value='3'>
        <Box sx={{ height: 400, width: '100%' }}>
          <AccessTeams></AccessTeams>
        </Box>
      </TabPanel>
    </TabContext>
  )
}

export default AccessManagement
