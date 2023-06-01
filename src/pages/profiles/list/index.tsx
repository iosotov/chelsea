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
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports
import { useAppSelector } from 'src/store/hooks'
import { ProfileInfoType } from 'src/store/api/profileApiSlice'
import { selectAllProfiles, selectProfilesByStatus } from 'src/store/profileSlice'
import { useGetCampaignsQuery, useGetCompaniesQuery, usePostProfilesSearchQuery, usePostSettingSearchQuery } from 'src/store/api/apiHooks'
import { format } from 'date-fns'
import { selectAllCompanies } from 'src/store/companySlice';
import { selectAllCampaigns } from 'src/store/campaignSlice';
import { selectSettingByType } from 'src/store/settingSlice';

export function capitalizeWords(s: string): string {
  return s.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function formatCurrency(value: number): string {
  return value
    .toFixed(2) // always two decimal digits
    .replace(/\d(?=(\d{3})+\.)/g, '$&,') // replace every group of three digits before a dot with that group and a comma
    .replace(/^/, '$'); // prepend a dollar sign
}
interface UserStatusType {
  [key: string]: ThemeColor
}

const userStatusObj: UserStatusType = {
  Active: 'success',
  Pending: 'warning',
  Inactive: 'error'
}

export const paymentStatusColor: ThemeColor[] = ["primary", "info", "success", "error", "error", "error", "error", "error", "error", "error", "warning"]

export const paymentStatus = ["Open", "Pending", "Cleared", "Returned", "Paused", "Cancelled", "Reversed", "Rejected", "Error", "Voided", "Unknown"]



export const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// avatar
// ** renders client column
const renderClient = (row: ProfileInfoType) => {
  const avatar = ''
  if (avatar.length) {
    return <CustomAvatar src={avatar} sx={{ mr: 3, width: 30, height: 30 }} />
  } else {
    return (
      <CustomAvatar skin='light' color={'primary'} sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}>
        {row.firstName[0] + row.lastName[0]}
      </CustomAvatar>
    )
  }
}


const ProfileList = () => {

  // API HOOKS
  useGetCompaniesQuery({})
  useGetCampaignsQuery({})
  usePostSettingSearchQuery({})
  usePostProfilesSearchQuery({})

  // LOCAL STATE
  const [paginationModel, setPaginationModel] = useState({ pageSize: 25, page: 0 })
  const [status, setStatus] = useState<string>("0")

  // HANDLE FILTER CHANGE
  const handleStatusChange = useCallback((e: SelectChangeEvent) => {
    setStatus(e.target.value)
  }, [])

  // GLOBAL STATE
  const companies = useAppSelector(selectAllCompanies)
  const campaigns = useAppSelector(selectAllCampaigns)
  const statusSettings = useAppSelector(state => selectSettingByType(state, 1))
  const stageSettings = useAppSelector(state => selectSettingByType(state, 2))

  // DATA GRID COLUMNS DEFINITION
  const columns: GridColDef[] = [
    {
      minWidth: 175,
      field: 'profileId',
      headerName: 'ID',
      renderCell: ({ row }) => {
        const { profileId } = row

        return <Typography sx={{ textTransform: 'capitalize' }}>{profileId}</Typography>
      }
    },
    {
      minWidth: 300,
      field: 'name',
      headerName: 'Name',
      valueGetter: (params) => {
        return `${params.row.firstName} ${params.row.lastName}`
      },
      renderCell: ({ row }) => {
        const { firstName, lastName, profileId } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <LinkStyled href={`/profiles/${profileId}/debts`}>{firstName + ' ' + lastName}</LinkStyled>
            </Box>
          </Box>
        )
      }
    },
    {
      minWidth: 200,
      field: 'statusName',
      headerName: 'Enrollment Status',
      type: 'singleSelect',
      valueOptions(params) {
        console.log(params)

        return ['Active', 'Cancelled', 'Inactive']
      },
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <CustomChip
            skin='light'
            label={row.statusName}
            color={userStatusObj[row.statusName]}
            sx={{ textTransform: 'capitalize', padding: 1, width: '80%' }}
          />
        )
      }
    },
    {
      minWidth: 150,
      type: 'date',
      field: 'createdAt',
      headerName: 'Created Date',
      valueGetter: (({ value }) => {
        return value ? new Date(value) : null
      }),
      renderCell: ({ value }) => {
        return <Typography variant='body2'>{value ? format(new Date(value), 'MM/dd/yy') : ""}</Typography>
      }
    },
    {
      minWidth: 300,
      field: 'createdCompanyName',
      type: 'singleSelect',
      valueOptions: companies.map(c => c.name),
      headerName: 'Data Point',
      valueFormatter(params) {
        return capitalizeWords(params.value)
      },
      renderCell: (params) => {
        const createdCompanyName: string = params.value

        return <Typography variant='body2' sx={{ textTransform: 'capitalize', whiteSpace: 'normal', wordWrap: 'normal' }}>{capitalizeWords(createdCompanyName)}</Typography>
      }
    },
    {
      minWidth: 150,
      field: 'stageStatusName',
      headerName: 'Status',
      type: 'singleSelect',
      valueOptions: statusSettings.map(s => s.value),
      renderCell: ({ row }) => {
        return <Typography variant='body2'>{row.stageStatusName}</Typography>
      }
    },
    {
      minWidth: 150,
      field: 'stageName',
      headerName: 'Stage',
      type: 'singleSelect',
      valueOptions: stageSettings.map(s => s.value),
      renderCell: ({ row }) => {
        return <Typography variant='body2'>{row.stageName}</Typography>
      }
    },
    {
      minWidth: 150,
      field: 'submittedDate',
      headerName: 'Submitted Date',
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
      field: 'enrolledDate',
      headerName: 'Enrolled Date',
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
      field: 'cancelledDate',
      headerName: 'Cancelled Date',
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
      field: 'campaignName',
      headerName: 'Campaign',
      type: 'singleSelect',
      valueOptions: campaigns.map(c => c.campaignName),
      renderCell: ({ row }) => {
        return <Typography variant='body2'>{row.campaignName}</Typography>
      }
    },
    {
      minWidth: 150,
      field: 'firstPaymentDate',
      headerName: 'First Payment Date',
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
      field: 'firstPaymentClearedDate',
      headerName: 'First Payment Cleared Date',
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
      field: 'firstPaymentAmount',
      headerName: 'First Payment Amount',
      type: 'number',
      renderCell: ({ value }) => {
        return <Typography variant='body2'>{value ? formatCurrency(value) : ""}</Typography>
      }
    },
    {
      minWidth: 150,
      field: 'firstPaymentClearedAmount',
      headerName: 'First Payment Cleared Amount',
      renderCell: ({ value }) => {
        return <Typography variant='body2'>{value ? formatCurrency(value) : ""}</Typography>
      }
    },
    {
      minWidth: 150,
      field: 'lastPaymentAmount',
      headerName: 'Last Payment Amount',
      type: 'number',
      renderCell: ({ value }) => {
        return <Typography variant='body2'>{value ? formatCurrency(value) : ""}</Typography>
      }
    },
    {
      minWidth: 175,
      field: 'lastPaymentStatus',
      headerName: 'Last Payment Status',
      type: 'singleSelect',
      valueOptions: paymentStatus,
      valueGetter({ value }) {
        return paymentStatus[value]
      },
      renderCell: ({ value }) => {
        return value ? (
          <CustomChip
            skin='light'
            label={paymentStatus[value]}
            color={paymentStatusColor[value]}
            sx={{ textTransform: 'capitalize', padding: 1, width: '100%' }}
          />
        ) : ""
      }
    },
    {
      minWidth: 150,
      field: 'lastStageStatusModifiedDate',
      headerName: 'Status Modified Data',
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
      field: 'timeInStatus',
      headerName: 'Time in Status',
      type: 'number',
      renderCell: ({ value }) => {
        return <Typography variant='body2'>{value}</Typography>
      }
    },
    {
      minWidth: 150,
      field: 'legalStatus',
      headerName: 'Legal Status',
      type: "boolean",
      renderCell: ({ value }) => {
        return value ? <CustomChip
          skin='light'
          label={"Active"}
          color={'error'}
          sx={{ textTransform: 'capitalize', padding: 1, width: '100%' }}
        /> : ""
      }
    },
  ]

  // FOR DYNAMIC RENDERING OF PRESET LIST FILTERS
  const profiles = [
    useAppSelector(selectAllProfiles),
    useAppSelector(state => selectProfilesByStatus(state, 0)),
    useAppSelector(state => selectProfilesByStatus(state, 1)),
    useAppSelector(state => selectProfilesByStatus(state, 2)),
    useAppSelector(state => selectProfilesByStatus(state, 3)),
    useAppSelector(state => selectProfilesByStatus(state, 4)),
    useAppSelector(state => selectProfilesByStatus(state, 5)),
    useAppSelector(state => selectProfilesByStatus(state, 6)),
    useAppSelector(state => selectProfilesByStatus(state, 7)),
    useAppSelector(state => selectProfilesByStatus(state, 8)),
    useAppSelector(state => selectProfilesByStatus(state, 9)),
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Preset List' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='status'>Enrollment Status</InputLabel>
                  <Select
                    fullWidth
                    value={status}
                    id='status'
                    label='Enrollment Status'
                    labelId='status'
                    onChange={handleStatusChange}
                  >
                    {[
                      "All Profiles",
                      "Pending",
                      "Submitted",
                      "Enrolled",
                      "Paused",
                      "Re-enrolled",
                      "Cancelled",
                      "Resume",
                      "Approved",
                      "Returned",
                      "Created"
                    ].map((s, i) => (

                      <MenuItem key={`${s}-${i}`} value={i}>{s}</MenuItem>
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
              paginationModel={paginationModel}
              hideFooterSelectedRowCount
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[25, 50, 100]}
              getRowId={row => row.profileId}
              rows={profiles[+status]}
              componentsProps={{
                baseButton: {
                  variant: 'outlined'
                },
              }}
              initialState={{
                sorting: {
                  sortModel: [{ field: 'statusName', sort: 'asc' }]
                },
                pagination: {
                  paginationModel: { pageSize: 25 }
                },
                columns: {
                  columnVisibilityModel: {
                    // Hide columns status and traderName, the other columns will remain visible
                    profileId: false,
                    createdCompanyName: false,
                    submittedDate: false,
                    enrolledDate: false,
                    cancelledDate: false,
                    firstPaymentDate: false,
                    firstPaymentClearedDate: false,
                    firstPaymentAmount: false,
                    firstPaymentClearedAmount: false,
                    lastPaymentAmount: false,
                    lastPaymentStatus: false,
                    lastStageStatusModifiedDate: false,
                    timeInStatus: false,
                    legalStatus: false

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

export default ProfileList
