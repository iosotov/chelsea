import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Link from 'next/link'
import { useRouter } from 'next/router'

//Imported Views
import ProfileTabs from 'src/views/pages/user/view/ProfileTabs'
import ProfileSnapshot from 'src/views/pages/user/view/ProfileSnapshot'

//API Calls
import { useGetProfileInfoQuery } from 'src/store/api/apiHooks'

//Imported Types
import { useAppSelector } from 'src/store/hooks'
import { selectProfileById } from 'src/store/profileSlice'

type Props = {
  tab: string
}

export default function UserProfile({ tab }: Props) {
  const router = useRouter()
  const { profileId = '' } = router.query

  const data = useAppSelector(state => selectProfileById(state, String(profileId)))

  const { isError, isLoading, isFetching, isSuccess } = useGetProfileInfoQuery(String(profileId), {
    skip: !profileId
  })

  console.log(data)

  if (isError) {
    return (
      <>
        <Typography mb={4} variant='h5'>
          No profile matching the ID of {profileId} could be found.
        </Typography>
        <Typography variant='body1'>
          Click{' '}
          <Link className='text-blue-400' href='/profiles/list'>
            here
          </Link>{' '}
          to return to search.
        </Typography>
      </>
    )
  }

  return (
    <>
      {(isLoading || isFetching) && (
        <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <CircularProgress sx={{ mb: 4 }} />
          <Typography>Loading...</Typography>
        </Box>
      )}
      {isSuccess && data ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} lg={4}>
            {/* pass profileInfo directly into UserViewLeft */}
            <ProfileSnapshot data={data} />
          </Grid>
          <Grid item xs={12} md={8} lg={8}>
            <ProfileTabs id={profileId} tab={tab} />
          </Grid>
        </Grid>
      ) : null}
    </>
  )
}
