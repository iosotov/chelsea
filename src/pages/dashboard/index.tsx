import Grid from '@mui/material/Grid'
import CardWelcomeBack from 'src/views/pages/dashboard/components/CardWelcomeBack'
import DashboardTabs from 'src/views/pages/dashboard/DashboardTabs'


interface DashboardProps {
  tab: string
}
export default function Dashboard({ tab }: DashboardProps) {
  return (
    <Grid container spacing={6}>

      <Grid item xs={12}>
        <CardWelcomeBack />
      </Grid>
      <Grid item xs={12}>
        <DashboardTabs tab={tab} />
      </Grid>
    </Grid>
  )
}
