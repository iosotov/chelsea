
// ** Styled Component Import
import { Grid } from '@mui/material'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CardWidgetsTotalRevenue from './components/DashboardCardWidgetsTotalTasks'
import DashboardCardWidgetsWeeklyOverview from './components/DashboardCardWidgetsWeeklyOverview'
import FallbackSpinner from 'src/@core/components/spinner'
import { usePostTaskSearchQuery } from 'src/store/api/apiHooks'
import DashboardCalendar from './components/DashboardCalendar'
import MyTasksTable from './components/MyTasksTable'

export default function DashboardTasksView() {

  const { isLoading, isSuccess } = usePostTaskSearchQuery({})


  return (
    <>
      {isLoading && <FallbackSpinner />}
      {isSuccess && <DashboardTasksWidgets />}
    </>
  )
}


function DashboardTasksWidgets() {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6} alignItems={'stretch'}>
        <Grid item xs={12}>
          <MyTasksTable />
        </Grid>

        {/* WIDGETS */}
        <Grid item xs={12} md={6}>
          <CardWidgetsTotalRevenue />
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardCardWidgetsWeeklyOverview />
        </Grid>

        {/* CALENDAR */}
        <Grid item xs={12}>
          <DashboardCalendar />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}
