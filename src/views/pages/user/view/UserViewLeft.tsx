import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

import { useRouter } from 'next/router'
import { Chip, Icon } from '@mui/material'
import { flexbox } from '@mui/system'

type Props = {
  id: string | string[] | undefined
}

type Snapshot = {
  createdAt: string
  cratedBy: string
  createdByName: string
  createdCompany: string
  createdCompanyName: string
  campaignId: string
  campaignName: string
  profileAssignees: any[]
  profileAddresses: any[]
  profileContacts: any[]
  profileCustomFields: any[]
  profileId: string
  firstName: string
  lastName: string
  middleName: string
  gender: number
  genderName: string
  birthdate: string
  ssn: string
  status: number
  stage: string
  stageName: string
  stageStatus: string
  stageStatusName: string
}

export default function UserViewRight({ id }: Props) {
  const router = useRouter()

  //temp dictionary
  const enrollmentStatus = ['inactive', 'active']

  // async await for data
  // const data = await getData(id);
  let data = {
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

  const DateConverter = (date: string) => {
    return new Date(date).toLocaleDateString('en-US')
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography mb={2} variant='h4'>
              {data.firstName ?? ''} {data.lastName ?? ''}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6'>ID: {data.profileId}</Typography>
              <Chip label={enrollmentStatus[data.status].toUpperCase() ?? 'blank'} color='primary'></Chip>
            </Box>
          </CardContent>

          <CardContent>
            <Box>
              <Typography sx={{ mb: 4 }} variant='body1'>
                Profile Stage:{' '}
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <Chip label={data.stageName} color='primary' />
                <Typography sx={{ mx: 3 }} variant='body1'>
                  &#8594;
                </Typography>
                <Chip label={data.stageStatusName} color='warning' />
              </Box>
            </Box>
          </CardContent>

          <CardContent>
            <Typography mb={2} variant='h6'>
              Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Created By:</Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant='body2'>{data.createdByName}</Typography>
                  <Typography variant='body2' sx={{ fontSize: '0.625rem' }}>
                    {DateConverter(data.createdAt)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Data Point:</Typography>
                <Typography variant='body2'>{data.createdCompanyName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Campaign:</Typography>
                <Typography variant='body2'>{data.campaignName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Account Manager:</Typography>
                <Typography variant='body2'>{'Unassigned'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Servicing Company:</Typography>
                <Typography variant='body2'>{data.campaignName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Marketing Agent:</Typography>
                <Typography variant='body2'>{data.createdByName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Marketing Company:</Typography>
                <Typography variant='body2'>{data.createdCompanyName}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography mb={2} variant='h6'>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Date of Birth:</Typography>
                <Typography variant='body2'>{DateConverter(data.birthdate)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Social Security Number:</Typography>
                <Typography variant='body2'>{data.ssn}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Gender:</Typography>
                <Typography variant='body2'>{data.genderName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Primary Phone:</Typography>
                <Typography variant='body2'>{'(949)-111-1234'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Secondary Phone:</Typography>
                <Typography variant='body2'>{''}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Email Address:</Typography>
                <Typography variant='body2'>{'johntest@gmail.com'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Mailing Address:</Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant='body2'>{'123 Test Street'}</Typography>
                  <Typography variant='body2'>{'Dayton, New Jersey 20510'}</Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography mb={2} variant='h6'>
              Enrollment Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Total Enrolled Balance:</Typography>
                <Typography variant='body2'>{'$10000'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Enrolled Debts:</Typography>
                <Typography variant='body2'>{'$10000'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>% of Enrolled Debt:</Typography>
                <Typography variant='body2'>{'40%'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>First Payment Date:</Typography>
                <Typography variant='body2'>{'12/1/2023'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>First Payment Amount:</Typography>
                <Typography variant='body2'>{'$350'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Last Payment Date:</Typography>
                <Typography variant='body2'>{'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Last Payment Amount:</Typography>
                <Typography variant='body2'>{'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Last Payment Status:</Typography>
                <Typography variant='body2'>{'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Next Payment Date:</Typography>
                <Typography variant='body2'>{'12/1/2023'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Next Payment Amount:</Typography>
                <Typography variant='body2'>{'$350'}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
