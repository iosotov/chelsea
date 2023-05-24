// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { useAppSelector } from 'src/store/hooks'
import { selectCompletedTasksForCurrentWeek } from 'src/store/taskSlice'



const DashboardCardWidgetsWeeklyOverview = () => {
  // ** Hook
  const theme = useTheme()

  const data = useAppSelector(state => selectCompletedTasksForCurrentWeek(state))

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: true,
        columnWidth: '40%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
    legend: { show: false },
    grid: {
      strokeDashArray: 7,
      padding: { left: -9 },
      borderColor: theme.palette.divider
    },
    dataLabels: { enabled: false },
    colors: [
      theme.palette.customColors.trackBg,
      theme.palette.customColors.trackBg,
      theme.palette.customColors.trackBg,
      theme.palette.primary.main,
      theme.palette.customColors.trackBg,
      theme.palette.customColors.trackBg
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      tickPlacement: 'on',
      labels: { show: true, style: { colors: theme.palette.text.primary } },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 3,
      forceNiceScale: true,
      labels: {
        offsetY: 2,
        offsetX: -12,

        style: { colors: theme.palette.text.primary },
        formatter: val => {
          if (val !== Math.floor(val)) return ""

          return `${val}`
        }
      }
    }
  }

  console.log(data)

  return (
    <Card sx={{ height: '100%' }} >
      <CardHeader
        title='Weekly Completed Task'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <ReactApexcharts type='bar' height={275} series={[{ name: 'Completed Tasks', data }]} options={options} />
      </CardContent>
    </Card >
  )
}

export default DashboardCardWidgetsWeeklyOverview
