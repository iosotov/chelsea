// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { useGetProfilesQuery } from 'src/store/api/apiHooks'
import { ProfileInfoType } from 'src/store/api/profileApiSlice'
import { selectAllProfiles } from 'src/store/profileSlice'
// import SidebarAddUser from 'src/views/pages/user/list/AddUserDrawer'
// import TableHeader from 'src/views/pages/user/list/TableHeader'
// import { useGetBudgetsQuery, useGetProfileBudgetsQuery } from 'src/store/api/profileBudgetApiSlice'
import { selectAllBudgets, selectAllProfileBudgets } from 'src/store/profileBudgetSlice'

interface UserRoleType {
  [key: string]: { icon: string; color: string }
}

interface UserStatusType {
  [key: string]: ThemeColor
}

// ** Vars
// const userRoleObj: UserRoleType = {
//   admin: { icon: 'mdi:laptop', color: 'error.main' },
//   author: { icon: 'mdi:cog-outline', color: 'warning.main' },
//   editor: { icon: 'mdi:pencil-outline', color: 'info.main' },
//   maintainer: { icon: 'mdi:chart-donut', color: 'success.main' },
//   subscriber: { icon: 'mdi:account-outline', color: 'primary.main' }
// }

interface CellType {
  row: ContactType
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

interface ContactType {
  profileId: string
  createdAt: string
  createdCompanyName: string
  stageName: string
  stageStatusName: string
  statusName: string
  submittedDate: string
  enrolledDate: string
  cancelledDate: string

  firstName: string
  lastName: string
  avatar: string
}

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

// action column
const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  const dispatch = useAppDispatch()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    // dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href='/apps/user/view/overview/'
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    minWidth: 175,
    field: 'profileId',
    headerName: 'ID',
    renderCell: ({ row }: CellType) => {
      const { profileId } = row

      return <Typography sx={{ textTransform: 'capitalize' }}>{profileId}</Typography>
    }
  },
  {
    minWidth: 300,
    field: 'firstName',
    headerName: 'User',
    renderCell: ({ row }: CellType) => {
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
    minWidth: 275,
    field: 'createdAt',
    headerName: 'Created Date',
    renderCell: ({ row }: CellType) => {
      const { createdAt } = row

      return <Typography variant='body2'>{createdAt}</Typography>
    }
  },
  {
    minWidth: 200,
    field: 'createdCompanyName',
    headerName: 'Data Point',
    renderCell: ({ row }: CellType) => {
      const { createdCompanyName } = row

      return <Typography sx={{ textTransform: 'capitalize' }}>{createdCompanyName}</Typography>
    }
  },
  {
    minWidth: 175,
    field: 'stageName',
    headerName: 'Stage',
    renderCell: ({ row }: CellType) => {
      return <Typography variant='body2'>{row.stageName}</Typography>
    }
  },
  {
    minWidth: 175,
    field: 'stageStatusName',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return <Typography variant='body2'>{row.stageStatusName}</Typography>
    }
  },
  {
    minWidth: 175,
    field: 'statusName',
    headerName: 'Enrollment Status',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.statusName}
          color={userStatusObj[row.statusName]}
          sx={{ textTransform: 'capitalize', padding: 1 }}
        />
      )
    }
  },
  {
    minWidth: 250,
    field: 'submittedDate',
    headerName: 'Submitted Date',
    renderCell: ({ row }: CellType) => {
      return <Typography variant='body2'>{row.submittedDate}</Typography>
    }
  },
  {
    minWidth: 250,
    field: 'enrolledDate',
    headerName: 'Enrolled Date',
    renderCell: ({ row }: CellType) => {
      return <Typography variant='body2'>{row.enrolledDate}</Typography>
    }
  },
  {
    minWidth: 250,
    field: 'cancelledDate',
    headerName: 'Cancelled Date',
    renderCell: ({ row }: CellType) => {
      return <Typography variant='body2'>{row.cancelledDate}</Typography>
    }
  },
  {
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row.profileId} />
  }
]

const ProfileList = () => {
  // ** State
  // state for search filters
  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [data, setData] = useState<ProfileInfoType[] | {}>({})
  const profiles = useAppSelector(selectAllProfiles)
  const budgets = useAppSelector(selectAllBudgets)
  const profileBudgets = useAppSelector(selectAllProfileBudgets)

  // val stores state for header filters
  const [value, setValue] = useState<string>('')

  useGetProfilesQuery(data)
  // useGetProfileBudgetsQuery('1327485548')
  // useGetBudgetsQuery({})

  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback((e: SelectChangeEvent) => {
    setRole(e.target.value)
  }, [])

  const handlePlanChange = useCallback((e: SelectChangeEvent) => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback((e: SelectChangeEvent) => {
    setStatus(e.target.value)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='role-select'>Select Role</InputLabel>
                  <Select
                    fullWidth
                    value={role}
                    id='select-role'
                    label='Select Role'
                    labelId='role-select'
                    onChange={handleRoleChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                    <MenuItem value='author'>Author</MenuItem>
                    <MenuItem value='editor'>Editor</MenuItem>
                    <MenuItem value='maintainer'>Maintainer</MenuItem>
                    <MenuItem value='subscriber'>Subscriber</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='plan-select'>Select Plan</InputLabel>
                  <Select
                    fullWidth
                    value={plan}
                    id='select-plan'
                    label='Select Plan'
                    labelId='plan-select'
                    onChange={handlePlanChange}
                    inputProps={{ placeholder: 'Select Plan' }}
                  >
                    <MenuItem value=''>Select Plan</MenuItem>
                    <MenuItem value='basic'>Basic</MenuItem>
                    <MenuItem value='company'>Company</MenuItem>
                    <MenuItem value='enterprise'>Enterprise</MenuItem>
                    <MenuItem value='team'>Team</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='status-select'>Select Status</InputLabel>
                  <Select
                    fullWidth
                    value={status}
                    id='select-status'
                    label='Select Status'
                    labelId='status-select'
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    <MenuItem value='pending'>Pending</MenuItem>
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
          {/* <Box sx={{ width: '100%' }}> */}

          <DataGrid
            autoHeight
            rows={profiles}
            getRowId={r => r.profileId}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
          {/* </Box> */}
        </Card>
      </Grid>

      {/* <SidebarAddUser open={addUserOpen} toggle={toggleAddUserDrawer} /> */}
    </Grid>
  )
}

export default ProfileList
