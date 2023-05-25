//hidden for now, consolidated with credit report.

// ** React Imports

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'

// ** Third Party Imports
// import axios from 'axios'

// ** Type Imports
// import { ProjectListDataType } from 'src/types/apps/userTypes'

interface CellType {
  row: any
}
const Img = styled('img')(({ theme }) => ({
  width: 34,
  height: 34,
  borderRadius: '50%',
  marginRight: theme.spacing(3)
}))

const columns = [
  {
    flex: 0.3,
    minWidth: 230,
    field: 'projectTitle',
    headerName: 'Project',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Img src={row.img} alt={`project-${row.projectTitle}`} />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
            {row.projectTitle}
          </Typography>
          <Typography variant='caption'>{row.projectType}</Typography>
        </Box>
      </Box>
    )
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'totalTask',
    headerName: 'Total Tasks',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {row.totalTask}
      </Typography>
    )
  },
  {
    flex: 0.15,
    minWidth: 200,
    headerName: 'Progress',
    field: 'progressValue',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ width: '100%' }}>
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.progressValue}%
        </Typography>
        <LinearProgress
          variant='determinate'
          value={row.progressValue}
          color={row.progressColor}
          sx={{ height: 6, borderRadius: '5px' }}
        />
      </Box>
    )
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'hours',
    headerName: 'Hours',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {row.hours}
      </Typography>
    )
  }
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

const ProfileDebts = () => {
  // ** State
  // const [value, setValue] = useState<string>('')
  // const [pageSize, setPageSize] = useState<number>(7)
  // const [data, setData] = useState<ProjectListDataType[]>([])

  // useEffect(() => {
  //   axios
  //     .get('/apps/users/project-list', {
  //       params: {
  //         q: value
  //       }
  //     })
  //     .then(res => setData(res.data))
  // }, [value])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ mt: 1, mb: 2.5, display: 'flex', alignItems: 'center', width: 1, gap: 5 }}>
          {/* <Card sx={{ width: 1 / 3, mr: 'auto' }}>
            <CardHeader title='Enrolled Debts'></CardHeader>
            <CardContent>
              <Typography variant='body2'>2 of 10</Typography>
            </CardContent>

          </Card> */}
          <Card sx={{ width: 1 / 3, mr: 'auto' }}>
            <CardContent>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='body2'>{`Enrolled Debts`}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                  <Typography variant='h6'>1 of 10 Enrolled</Typography>
                  <Typography variant='body2' sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    Edit Role
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ width: 1 / 3, mr: 'auto' }}>
            <CardContent>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='body2'>{`Enrolled Debts`}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                  <Typography variant='h6'>1 of 10 Enrolled</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ width: 1 / 3, mr: 'auto' }}>
            <CardContent>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='body2'>{`Total Enrolled Balance`}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                  <Typography variant='h6'>$999,999,999</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Projects List' />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant='body2' sx={{ mr: 2 }}>
                Search:
              </Typography>
              {/* <TextField size='small' placeholder='Search Project' value={value} onChange={e => setValue(e.target.value)} /> */}
            </Box>
          </CardContent>
          <DataGrid autoHeight rows={rows} columns={columns} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ProfileDebts
