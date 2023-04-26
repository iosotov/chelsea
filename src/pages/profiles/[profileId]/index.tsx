import Grid from '@mui/material/Grid'
import { Box, CircularProgress, Typography } from '@mui/material'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

//import views left and right views for page
import UserViewLeft from 'src/views/pages/user/view/UserViewLeft'
import UserViewRight from 'src/views/pages/user/view/UserViewRight'

type Props = {
  tab: string
}

export type Snapshot = {
  createdAt?: string
  createdBy?: string
  createdByName?: string
  createdCompany?: string
  createdCompanyName?: string
  campaignId?: string
  campaignName?: string
  profileAssignees?: any[]
  profileAddresses?: any[]
  profileContacts?: any[]
  profileCustomFields?: any[]
  profileId?: string
  firstName?: string
  lastName?: string
  middleName?: string
  gender?: number
  genderName?: string
  birthdate?: string
  ssn?: string
  status?: number
  stage?: string
  stageName?: string
  stageStatus?: string
  stageStatusName?: string
}

//dummy data
const dummyData = {
  createdAt: '2023-04-14T17:51:00.6733759',
  createdBy: '90eb9d4c-3eb4-4f95-95d6-02f97d0f57b7',
  createdByName: 'Test File',
  createdCompany: '9dc05903-65ab-48c1-8073-33bfd6fd8cf5',
  createdCompanyName: 'Test Financial Solutions',
  campaignId: 'fjaipejfiawefaewfa',
  campaignName: 'Test Ones',
  profileAssignees: [],
  profileAddresses: [],
  profileContacts: [],
  profileCustomFields: [],
  profileId: '1235182312',
  firstName: 'John',
  lastName: 'Doe',
  middleName: 'T.',
  gender: 0,
  genderName: 'Male',
  birthdate: '1975-05-23T00:00:00',
  ssn: '123-456-7890',
  status: 0,
  stage: '28912351235123512',
  stageName: 'Sales Flow',
  stageStatus: 'ijfpaisodjfopaoefa',
  stageStatusName: 'New Lead'
}

export default function UserProfile({ tab }: Props) {
  const router = useRouter()
  const { profileId } = router.query
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})

  // check to see if valid id (get profile info)
  // if valid id, show view
  // else bounce to contacts list

  setTimeout(() => {
    setData(dummyData)
    setLoading(false)
  }, 1000)

  return (
    <>
      {loading ? (
        <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <CircularProgress sx={{ mb: 4 }} />
          <Typography>Loading...</Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={5} lg={4}>
            {/* pass profileInfo directly into UserViewLeft */}
            <UserViewLeft data={data} />
          </Grid>
          <Grid item xs={12} md={7} lg={8}>
            <UserViewRight id={profileId} tab={tab} />
          </Grid>
        </Grid>
      )}
    </>
  )
}
