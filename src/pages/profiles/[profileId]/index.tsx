import Grid from '@mui/material/Grid'
import { Box, CircularProgress, Typography } from '@mui/material'

import Link from 'next/link'

import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

//Imported Views
import UserViewLeft from 'src/views/pages/user/view/UserViewLeft'
import UserViewRight from 'src/views/pages/user/view/UserViewRight'

//API Calls
import { useGetProfileInfoQuery } from 'src/store/api/apiHooks'

//Imported Types
import { ProfileInfoType } from 'src/store/api/profileApiSlice'

type Props = {
  tab: string
}

export default function UserProfile({ tab }: Props) {
  const router = useRouter()
  const { profileId } = router.query
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({} as ProfileInfoType)

  let { data: profile, isError } = useGetProfileInfoQuery(profileId !== undefined ? profileId.toString() : '', {
    skip: profileId === undefined || profileId === ''
  })

  useEffect(() => {
    if (profile !== undefined) {
      setTimeout(() => {
        setLoading(false)
        setData(profile)
      }, 500)
    }
  }, [profile])

  //needs error handling

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
      {loading ? (
        <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <CircularProgress sx={{ mb: 4 }} />
          <Typography>Loading...</Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} lg={4}>
            {/* pass profileInfo directly into UserViewLeft */}
            <UserViewLeft data={data} />
          </Grid>
          <Grid item xs={12} md={8} lg={8}>
            <UserViewRight id={profileId} tab={tab} />
          </Grid>
        </Grid>
      )}
    </>
  )
}
