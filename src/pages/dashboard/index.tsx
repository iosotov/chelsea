import Grid from '@mui/material/Grid'
import DashboardTabs from 'src/views/pages/dashboard/DashboardTabs'


interface DashboardProps {
  tab: string
}
export default function Dashboard({ tab }: DashboardProps) {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DashboardTabs tab={tab} />
      </Grid>
    </Grid>
  )
}
