// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { useAppSelector } from 'src/store/hooks'
import { selectTaskCountByStatus } from 'src/store/taskSlice'

const DashboardCardWidgetsWeeklyOverview = () => {
  // ** Hook
  const theme = useTheme()
  const data = useAppSelector(state => selectTaskCountByStatus(state))

  console.log(data)

  const options: ApexOptions = {
    chart: {
      sparkline: { enabled: true }
    },
    labels: ['Open Tasks', 'Attempted Tasks', 'Completed Tasks'],
    legend: { show: false },
    stroke: { lineCap: 'round' },
    colors: [theme.palette.error.main, theme.palette.primary.main, theme.palette.success.main,],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '40%'
        },
        track: {
          margin: 10,
        },
        dataLabels: {
          name: {
            offsetY: 28,
            fontSize: '0.75rem',
            color: theme.palette.text.secondary
          },
          value: {
            offsetY: -12,
            fontWeight: 500,
            fontSize: '2.125rem',
            color: theme.palette.text.primary,
            formatter(value) {
              return `${value}`
            }
          },
          total: {
            show: true,
            fontWeight: 400,
            fontSize: '0.75rem',
            color: theme.palette.text.secondary,
            label: `Total Tasks`,
            formatter(value) {
              return `${value.globals.seriesTotals.reduce((total: number, num: number) => total + num)}`
            }
          }
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Task Overview'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
      />
      <CardContent>
        <ReactApexcharts type='radialBar' height={243} series={data} options={options} />
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-around' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <Box
              sx={{
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& svg': { mr: 1.25, color: 'error.main' }
              }}
            >
              <Icon icon='mdi:circle' fontSize='0.75rem' />
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{data[0]}</Typography>
            </Box>
            <Typography variant='caption'>Open Tasks</Typography>
          </Box>
          <Divider orientation='vertical' sx={{ m: 0, height: 'auto' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <Box
              sx={{
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& svg': { mr: 1.25, color: 'primary.main' }
              }}
            >
              <Icon icon='mdi:circle' fontSize='0.75rem' />
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{data[1]}</Typography>
            </Box>
            <Typography variant='caption'>Attempted Tasks</Typography>
          </Box>
          <Divider orientation='vertical' sx={{ m: 0, height: 'auto' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <Box
              sx={{
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& svg': { mr: 1.25, color: 'success.main' }
              }}
            >
              <Icon icon='mdi:circle' fontSize='0.75rem' />
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{data[2]}</Typography>
            </Box>
            <Typography variant='caption'>Completed Tasks</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default DashboardCardWidgetsWeeklyOverview
