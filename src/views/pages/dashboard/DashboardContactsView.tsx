// ** Styled Component Import
import { Grid } from '@mui/material'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import FallbackSpinner from 'src/@core/components/spinner'
import { usePostProfilesSearchQuery } from 'src/store/api/apiHooks'
import MyContactsTable from './components/TestMyContactsTable'

export default function DashboardContactsView() {
  const { isLoading, isSuccess } = usePostProfilesSearchQuery({})

  return (
    <>
      {isLoading && <FallbackSpinner />}
      {isSuccess && <DashboardContact />}
    </>
  )
}

function DashboardContact() {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6} alignItems={'stretch'}>
        <Grid item xs={12}>
          <MyContactsTable />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}
