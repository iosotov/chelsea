// ** React Imports
import React, { useState, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGridPro, GridColDef, GridToolbar } from '@mui/x-data-grid-pro'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports
import { useAppSelector } from 'src/store/hooks'
import { useGetCompaniesQuery, usePostEmployeeSearchQuery, usePostTaskSearchQuery } from 'src/store/api/apiHooks'
import { format } from 'date-fns'
import { selectAllCompanies } from 'src/store/companySlice';
import { selectAllEmployeeSelectOptions } from 'src/store/employeeSlice'
import { selectTasksByStatus } from 'src/store/taskSlice'
import { capitalizeWords } from 'src/pages/profiles/list'


export const taskStatusColor: ThemeColor[] = ["primary", "info", "success", "secondary"]


const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))


const TaskList = () => {

  // API HOOKS
  usePostEmployeeSearchQuery({})
  usePostTaskSearchQuery({})
  useGetCompaniesQuery({})

  // LOCAL STATE
  const [paginationModel, setPaginationModel] = useState({ pageSize: 25, page: 0 })
  const [status, setStatus] = useState<string>("-1")

  // HANDLE FILTER CHANGE
  const handleStatusChange = useCallback((e: SelectChangeEvent) => {
    setStatus(e.target.value)
  }, [])

  // GLOBAL STATE
  const employees = useAppSelector(state => selectAllEmployeeSelectOptions(state))
  const companies = useAppSelector(selectAllCompanies)

  // DATA GRID COLUMNS DEFINITION
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
      type: 'singleSelect',
      valueOptions: employees,
      headerName: 'Assigned',
      renderCell: ({ row }) => {
        const { assignedToName } = row

        return <Typography variant='body2' sx={{ textTransform: 'capitalize', whiteSpace: 'normal', wordWrap: 'normal' }}>{assignedToName ? capitalizeWords(assignedToName) : ""}</Typography>
      }
    },
    {
      minWidth: 175,
      field: 'profileId',
      headerName: 'Profile ID',
      renderCell: ({ value }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LinkStyled href={`/profiles/${value}/debts`}>{value}</LinkStyled>
          </Box>
        )
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
    {
      minWidth: 150,
      field: 'createdAt',
      headerName: 'Created At',
      type: 'date',
      valueGetter: (({ value }) => {
        return value ? new Date(value) : null
      }),
      renderCell: ({ value }) => {
        return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
      }
    },
    {
      minWidth: 200,
      field: 'createdBy',
      headerName: 'Created',
      type: 'singleSelect',
      valueOptions: employees,
      renderCell: ({ row }) => {
        return <Typography variant='body2' sx={{ textTransform: 'capitalize', whiteSpace: 'normal', wordWrap: 'normal' }}>{row.createdByName}</Typography>
      }
    },
    {
      minWidth: 200,
      field: 'createdCompanyId',
      headerName: 'Created Company',
      type: 'singleSelect',
      valueOptions: companies.map(c => ({ label: c.name, value: c.companyId })),
      renderCell: ({ row }) => {
        return <Typography variant='body2' sx={{ textTransform: 'capitalize', whiteSpace: 'normal', wordWrap: 'normal' }}>{row.createdCompanyName}</Typography>
      }
    },
    {
      minWidth: 200,
      field: 'assignedCompanyId',
      headerName: 'Assigned Company',
      type: 'singleSelect',
      valueOptions: companies.map(c => ({ label: c.name, value: c.companyId })),
      renderCell: ({ row }) => {
        return <Typography variant='body2' sx={{ textTransform: 'capitalize', whiteSpace: 'normal', wordWrap: 'normal' }}>{row.assignedCompanyName}</Typography>
      }
    },
  ]

  // FOR DYNAMIC RENDERING OF PRESET LIST FILTERS
  const tasks = useAppSelector(state => selectTasksByStatus(state, +status))

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Preset List' />
          <CardContent>
            <Grid container spacing={6}>
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
                      "Processing",
                      "Completed",
                      "Closed"
                    ].map((s, i) => (
                      <MenuItem key={`${s}-${i}`} value={i - 1}>{s}</MenuItem>
                    ))}

                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <DataGridPro
              rowHeight={75}
              disableRowSelectionOnClick
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
              sx={{ height: 600 }}
              columns={columns}
              pagination
              paginationModel={paginationModel}
              hideFooterSelectedRowCount
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[25, 50, 100]}
              getRowId={row => row.taskId}
              rows={tasks}
              componentsProps={{
                baseButton: {
                  variant: 'outlined'
                },
              }}
              initialState={{
                sorting: {
                  sortModel: [{ field: 'status', sort: 'asc' }, { field: 'dueDate', sort: 'asc' }]
                },
                pagination: {
                  paginationModel: { pageSize: 25 }
                },
                columns: {
                  columnVisibilityModel: {
                    // Hide columns status and traderName, the other columns will remain visible

                    taskId: false,
                    liabilityId: false,
                    createdAt: false,
                    createdCompanyId: false,
                    assignedCompanyId: false,
                  },
                }
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default TaskList




