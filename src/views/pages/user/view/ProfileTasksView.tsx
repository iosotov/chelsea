import { useState } from 'react'
import { format } from 'date-fns'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'


// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** MUI Imports
import Grid from '@mui/material/Grid'


// ** API hooks
import {
  useGetProfileTasksQuery,
} from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { selectTaskByProfileId } from 'src/store/taskSlice'
import { DrawerTitles, TaskForm } from './components/task/TaskForm'
import { Card, CardContent } from '@mui/material'
import { DataGridPro, GridColDef, GridValueGetterParams } from '@mui/x-data-grid-pro'
import { TaskType } from 'src/store/api/taskApiSlice'
import { store } from 'src/store/store'

export type ProfileTasksProps = {
  id: string
}

const ProfileTasks = ({ id }: ProfileTasksProps) => {
  // ** Hooks
  const profileId = id

  const { isLoading, isError } = useGetProfileTasksQuery(profileId)

  // Global State
  const profileTasks = useAppSelector(state => selectTaskByProfileId(state, profileId))

  //State Management
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [openTaskModal, setOpenTaskModal] = useState<boolean>(false)


  const getCompletedDate = (params: GridValueGetterParams) => {
    if (`${params.row.completedDate}`) {
      return 'Incomplete'
    } else {
      return `${params.row.completedDate}`
    }
  }

  const columns: GridColDef<TaskType>[] = [
    {
      field: 'taskName',
      headerName: 'Task Name',
      width: 200,
    },
    {
      field: 'assignedToName',
      headerName: 'Assigned To ',
      width: 200,
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',

      // type: 'text',
      width: 150,
      editable: true,
      valueGetter: row => {
        const date = new Date(row.value)

        return format(date, 'MM/dd/yyyy')
      }
    },
    {
      field: 'completedDate',
      headerName: 'Completed Date',

      // type: 'text',
      width: 150,
      editable: true,
      valueGetter: row => getCompletedDate(row)
    },
    {
      field: 'statusName',
      headerName: 'Status',

      // type: 'text',
      width: 150,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',

      // type: 'text',
      width: 150,
      valueGetter: row => {
        const date = new Date(row.value)

        return format(date, 'MM/dd/yyyy')
      }
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      width: 110,
      valueGetter: row => {
        const employee = store.getState().employee.entities[row.value]

        return employee?.employeeAlias ? employee.employeeAlias : "SYSTEM"
      }
    }
  ]

  if (isError) return <div>An error occured</div>

  if (isLoading) return <div>Loading</div>


  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>

                <Typography variant='h5'>Tasks</Typography>
                <Button
                  size='medium'
                  type='submit'
                  variant='contained'
                  color='secondary'
                  onClick={() => setOpenTaskModal(true)}
                >
                  {DrawerTitles[selectedTasks.length > 2 ? 2 : selectedTasks.length]}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <DataGridPro checkboxSelection onRowSelectionModelChange={(n) => setSelectedTasks(n as string[])} getRowId={r => r.taskId} rows={profileTasks} columns={columns} sx={!profileTasks.length ? { height: '250px' } : { height: '500px' }} />
            </Grid>
            <Grid item xs={12}>
              <TaskForm formMode={selectedTasks.length} calendarMode={false} openTaskModal={openTaskModal} setOpenTaskModal={setOpenTaskModal} selectedTasks={selectedTasks} profileId={profileId} />
            </Grid>
          </Grid>
        </CardContent>

      </Card>
    </>
  )
}

export default ProfileTasks
