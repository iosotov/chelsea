import Grid from '@mui/material/Grid'

import { useRouter } from 'next/router'

//import views left and right views for page
import UserViewLeft from 'src/views/pages/user/view/UserViewLeft'
import UserViewRight from 'src/views/pages/user/view/UserViewRight'

export default function UserProfile() {
  const router = useRouter()
  const { profileId } = router.query

  // check to see if valid id
  // if valid id, show view
  // else bounce to contacts list

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={3}>
        <UserViewRight id={profileId} />
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        <UserViewLeft id={profileId} tab='credit' />
      </Grid>
    </Grid>
  )
}
