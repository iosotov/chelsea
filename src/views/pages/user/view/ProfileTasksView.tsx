import { useState, ChangeEvent } from 'react'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import Checkbox from '@mui/material/Checkbox'

// ** Types
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

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

export type ProfileTasksProps = {
  id: string
}

const ProfileTasks = ({ id }: ProfileTasksProps) => {
  // ** Hooks
  const profileId = id

  const { isLoading, isSuccess, isError } = useGetProfileTasksQuery(profileId)

  // Global State
  const profileTasks = useAppSelector(state => selectTaskByProfileId(state, profileId))

  //State Management
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [openTaskModal, setOpenTaskModal] = useState<boolean>(false)

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

  const getCompletedDate = (params: GridValueGetterParams) => {
    if (`${params.row.completedDate}`) {
      return 'Incomplete'
    } else {
      return `${params.row.completedDate}`
    }
  }

  const handleCheckboxChange = ({ target: { checked, value } }: ChangeEvent<HTMLInputElement>) => {
    if (checked) {
      setSelectedTasks(state => [...state, value])
    } else {
      setSelectedTasks(state => state.filter(t => t !== value))
    }

  }

  const renderEditTaskCheckbox = (params: any) => {
    return <Checkbox {...label} value={params.row.taskId} onChange={handleCheckboxChange} />
  }

  const columns: GridColDef[] = [
    { field: 'taskId', headerName: ' ', width: 60, renderCell: renderEditTaskCheckbox },
    {
      field: 'taskName',
      headerName: 'Task Name',
      width: 130,
      editable: true
    },
    {
      field: 'assignedToName',
      headerName: 'Assigned To ',
      width: 120,
      editable: true
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',

      // type: 'text',
      width: 120,
      editable: true
    },
    {
      field: 'completedDate',
      headerName: 'Completed Date',

      // type: 'text',
      width: 110,
      editable: true,
      valueGetter: row => getCompletedDate(row)
    },
    {
      field: 'statusName',
      headerName: 'Status',

      // type: 'text',
      width: 90,
      editable: true
    },
    {
      field: 'createdAt',
      headerName: 'Created At',

      // type: 'text',
      width: 110,
      editable: true
    },
    {
      field: 'createdBy',
      headerName: 'Created By',

      // type: 'text',
      width: 110,
      editable: true
    }
  ]

  if (isError) return <div>An error occured</div>

  if (isLoading) return <div>Loading</div>

  if (isSuccess)
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
                <DataGrid getRowId={r => r.taskId} rows={profileTasks} columns={columns} sx={!profileTasks.length ? { height: '250px' } : { height: '500px' }} />
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
