import Grid from '@mui/material/Grid'

import { useRouter } from 'next/router'

//import views left and right views for page
import UserViewLeft from 'src/views/pages/user/view/UserViewLeft'
import UserViewRight from 'src/views/pages/user/view/UserViewRight'

type Props = {
  tab: string
}

export default function UserProfile({ tab }: Props) {
  const router = useRouter()
  const { profileId } = router.query

  // check to see if valid id
  // if valid id, show view
  // else bounce to contacts list

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft id={profileId} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight id={profileId} tab={tab} />
      </Grid>
    </Grid>
  )
}
