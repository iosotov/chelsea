
// ** Styled Component Import
import { Grid, Stack } from '@mui/material'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CardWidgetsTotalRevenue from './components/DashboardCardWidgetsTotalTasks'
import DashboardCardWidgetsWeeklyOverview from './components/DashboardCardWidgetsWeeklyOverview'
import FallbackSpinner from 'src/@core/components/spinner'
import { usePostTaskSearchQuery } from 'src/store/api/apiHooks'
import DashboardCalendar from './components/DashboardCalendar'

export default function DashboardTasksView() {

  const { isLoading, isSuccess, isFetching } = usePostTaskSearchQuery({})

  return (
    <>
      <Stack>
        {isLoading || isFetching && <FallbackSpinner />}
        {isSuccess && <DashboardTasksWidgets />}
      </Stack>
    </>
  )

}


function DashboardTasksWidgets() {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6} alignItems={'stretch'}>
        <Grid item xs={12} md={6}>
          <CardWidgetsTotalRevenue />
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardCardWidgetsWeeklyOverview />
        </Grid>
        <Grid item xs={12}>
          <DashboardCalendar />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}
