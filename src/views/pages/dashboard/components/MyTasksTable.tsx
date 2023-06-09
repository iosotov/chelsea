import { useCallback, useState } from 'react'
import { format } from 'date-fns'

import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import CustomChip from 'src/@core/components/mui/chip'


// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** MUI Imports
import Grid from '@mui/material/Grid'


// ** API hooks
import {
  usePostProfilesSearchQuery,
} from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { selectTasksByStatusAndAssignee } from 'src/store/taskSlice'
import { Card, CardContent, FormControl, InputLabel, MenuItem, SelectChangeEvent } from '@mui/material'
import { DataGridPro, GridColDef, GridToolbar } from '@mui/x-data-grid-pro'
import { store } from 'src/store/store'
import { LinkStyled, capitalizeWords } from 'src/pages/profiles/list'
import { taskStatusColor } from 'src/pages/tasks/list'
import { selectAllProfiles } from 'src/store/profileSlice'


const MyTasksTable = () => {

  // API HOOKS
  usePostProfilesSearchQuery({})

  // LOCAL STATE
  const [paginationModel, setPaginationModel] = useState({ pageSize: 25, page: 0 })
  const [status, setStatus] = useState<string>("0")

  // GLOBAL STATE
  const employee = useAppSelector(state => state.auth.employee)
  const profiles = useAppSelector(selectAllProfiles)
  const urgentTasks = useAppSelector(state => selectTasksByStatusAndAssignee(state, +status, employee.employeeId))

  // HANDLE STATUS CHANGE
  const handleStatusChange = useCallback((e: SelectChangeEvent) => {
    setStatus(e.target.value)
  }, [])

  const columns: GridColDef[] = [
    {
      minWidth: 350,
      field: 'taskId',
      headerName: 'ID',
      renderCell: ({ row }) => {
        const { taskId } = row

        return <Typography variant='body2' sx={{}}>{taskId}</Typography>
      }
    },
    {
      minWidth: 300,
      field: 'taskName',
      headerName: 'Name',
      renderCell: ({ value }) => {
        return <Typography>{capitalizeWords(value)}</Typography>
      }
    },
    {
      minWidth: 175,
      field: 'profileId',
      headerName: 'Profile ID',
      type: 'singleSelect',
      valueOptions: profiles.map(({ firstName, lastName, profileId }) => ({ label: `${firstName} ${lastName}`, value: profileId })),
      renderCell: ({ value }) => {
        const profile = store.getState().profile.entities[value]

        const name = profile ? `${profile.firstName} ${profile.lastName}` : value

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LinkStyled href={`/profiles/${value}/debts`}>{name}</LinkStyled>
          </Box>
        )
      }
    },
    {
      minWidth: 200,
      field: 'status',
      headerName: 'Status',
      align: 'center',
      headerAlign: 'center',
      type: 'singleSelect',
      valueOptions() {
        return [
          { value: 0, label: "Open" },
          { value: 1, label: "Processed" },
          { value: 2, label: "Completed" },
          { value: 3, label: "Closed" },
        ]
      },
      renderCell: ({ row }) => {
        return (
          <CustomChip
            skin='light'
            label={capitalizeWords(row.statusName)}
            color={taskStatusColor[row.status]}
            sx={{ textTransform: 'capitalize', padding: 1, width: '80%' }}
          />
        )
      }
    },
    {
      minWidth: 200,
      field: 'assignedTo',
      filterable: false,
      headerName: 'Assigned',
      renderCell: ({ row }) => {
        const { assignedToName } = row

        return <Typography variant='body2' sx={{ textTransform: 'capitalize', whiteSpace: 'normal', wordWrap: 'normal' }}>{assignedToName ? capitalizeWords(assignedToName) : ""}</Typography>
      }
    },
    {
      minWidth: 250,
      field: 'notes',
      headerName: 'Notes',
      renderCell: ({ value }) => {
        return <Typography variant='body2'>{value}</Typography>
      }
    },
    {
      minWidth: 150,
      type: 'date',
      field: 'dueDate',
      headerName: 'Due Date',
      valueGetter: (({ value }) => {
        return value ? new Date(value) : null
      }),
      renderCell: ({ value }) => {
        return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
      }
    },
    {
      minWidth: 150,
      field: 'completedDate',
      headerName: 'Completed Date',
      type: 'date',
      valueGetter: (({ value }) => {
        return value ? new Date(value) : null
      }),
      renderCell: ({ value }) => {
        return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
      }
    },
    {
      minWidth: 150,
      field: 'rescheduledDate',
      headerName: 'Rescheduled Date',
      type: 'date',
      valueGetter: (({ value }) => {
        return value ? new Date(value) : null
      }),
      renderCell: ({ value }) => {
        return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
      }
    },
    {
      minWidth: 175,
      field: 'liabilityId',
      headerName: 'Liability ID',
      renderCell: ({ value }) => {
        return <Typography variant='body2'>{value}</Typography>
      }
    },
  ]

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Box>
                <Typography variant='h5'>My Tasks</Typography>
              </Box>
            </Grid>

            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor='status'>Task Status</InputLabel>
                <Select
                  fullWidth
                  value={status}
                  id='status'
                  label='Task Status'
                  labelId='status'
                  onChange={handleStatusChange}
                >
                  {[
                    "All",
                    "Open",
                    "Attempted",
                    "Completed",
                    "Closed"
                  ].map((s, i) => (
                    <MenuItem key={`${s}-${i}`} value={i - 1}>{s}</MenuItem>
                  ))}

                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <DataGridPro
                slots={{
                  toolbar: GridToolbar
                }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    sx: { padding: 2 }
                  },
                }}
                columns={columns}
                pagination
                sx={{ height: '500px' }}
                paginationModel={paginationModel}
                hideFooterSelectedRowCount
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[25, 50, 100]}
                getRowId={row => row.taskId}
                rows={urgentTasks}
                componentsProps={{
                  baseButton: {
                    variant: 'outlined'
                  },
                }}
                initialState={{
                  sorting: {
                    sortModel: [{ field: 'dueDate', sort: 'asc' }]
                  },
                  pagination: {
                    paginationModel: { pageSize: 25 }
                  },
                  columns: {
                    columnVisibilityModel: {
                      // Hide columns status and traderName, the other columns will remain visible
                      taskId: false,

                    },
                  }
                }}
              />
            </Grid>
          </Grid>
        </CardContent>

      </Card>
    </>
  )
}

export default MyTasksTable
