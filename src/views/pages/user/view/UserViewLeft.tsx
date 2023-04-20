import { useState, SyntheticEvent } from 'react'

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
import AccordionDetails from '@mui/material/AccordionDetails'

import { useRouter } from 'next/router'
import { Chip } from '@mui/material'
import { flexbox } from '@mui/system'

import { Snapshot } from 'src/pages/profiles/[profileId]'

import Icon from 'src/@core/components/icon'

import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'

type Props = {
  data: Snapshot
}

const Accordion = styled(MuiAccordion)<AccordionProps>(({ theme }) => ({
  boxShadow: '0px 2px 10px 0px rgba(58, 53, 65, 0.1)',
  transition: 'outline-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  outline: '2px solid transparent',
  '&.Mui-expanded': {
    'outline-color': `${theme.palette.primary.main}`
  }
}))

const AccordionSummary = styled(MuiAccordionSummary)<AccordionSummaryProps>(({ theme }) => ({
  '&.Mui-expanded': {
    minHeight: theme.spacing(12)
  },
  '& .MuiAccordionSummary-content.Mui-expanded': {
    margin: '10px 0'
  }
}))

export default function UserViewRight({ data }: Props) {
  const router = useRouter()

  const {
    createdAt,
    createdByName,
    createdCompanyName,
    campaignName,
    profileId,
    firstName,
    lastName,
    genderName,
    birthdate,
    ssn,
    status,
    stageName,
    stageStatusName
  } = data

  //temp dictionary
  const enrollmentStatus = ['inactive', 'active']

  //use profileId to get enrollment info snapshot

  const DateConverter = (date: string | undefined) => {
    if (!date) {
      return null
    }
    return new Date(date).toLocaleDateString('en-US')
  }

  // states for accordion toggle
  const [personal, setPersonal] = useState<boolean>(true)
  const [enrollment, setEnrollment] = useState<boolean>(false)
  const [additional, setAdditional] = useState<boolean>(false)

  // handles toggle logic for accordion
  const toggleAccordion = (panel: string) => (event: SyntheticEvent) => {
    if (panel === 'personal') {
      setPersonal(!personal)
    }

    if (panel === 'enrollment') {
      setEnrollment(!enrollment)
    }

    if (panel === 'additional') {
      setAdditional(!additional)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography mb={2} variant='h4'>
              {firstName ?? ''} {lastName ?? ''}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6'>ID: {data.profileId}</Typography>
              <Chip label={enrollmentStatus[status ?? 0].toUpperCase() ?? 'blank'} color='primary'></Chip>
            </Box>
          </CardContent>

          <CardContent>
            <Box>
              <Typography sx={{ mb: 4 }} variant='body1'>
                Profile Stage:{' '}
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <Chip label={stageName} color='primary' />
                <Typography sx={{ mx: 3 }} variant='body1'>
                  &#8594;
                </Typography>
                <Chip label={stageStatusName} color='warning' />
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
                  <Typography variant='body2'>{createdByName}</Typography>
                  <Typography variant='body2' sx={{ fontSize: '0.625rem' }}>
                    {DateConverter(createdAt)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Data Point:</Typography>
                <Typography variant='body2'>{createdCompanyName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Campaign:</Typography>
                <Typography variant='body2'>{campaignName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Account Manager:</Typography>
                <Typography variant='body2'>{'Unassigned'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Servicing Company:</Typography>
                <Typography variant='body2'>{campaignName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Marketing Agent:</Typography>
                <Typography variant='body2'>{createdByName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Marketing Company:</Typography>
                <Typography variant='body2'>{createdCompanyName}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Accordion expanded={personal} onChange={toggleAccordion('personal')}>
          <AccordionSummary
            id='controlled-panel-header-1'
            aria-controls='controlled-panel-content-1'
            expandIcon={<Icon icon='mdi:chevron-down' />}
          >
            <Typography sx={{ py: 1 }} variant='h6'>
              Personal Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Divider sx={{ mb: 4 }} />
            <Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Date of Birth:</Typography>
                <Typography variant='body2'>{DateConverter(birthdate)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Social Security Number:</Typography>
                <Typography variant='body2'>{ssn}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Gender:</Typography>
                <Typography variant='body2'>{genderName}</Typography>
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
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item xs={12}>
        <Accordion expanded={enrollment} onChange={toggleAccordion('enrollment')}>
          <AccordionSummary
            id='controlled-panel-header-1'
            aria-controls='controlled-panel-content-1'
            expandIcon={<Icon icon='mdi:chevron-down' />}
          >
            <Typography sx={{ py: 2 }} variant='h6'>
              Enrollment Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Divider sx={{ mb: 4 }} />
            <Box>
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
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item xs={12}>
        <Accordion expanded={additional} onChange={toggleAccordion('additional')}>
          <AccordionSummary
            id='controlled-panel-header-1'
            aria-controls='controlled-panel-content-1'
            expandIcon={<Icon icon='mdi:chevron-down' />}
          >
            <Typography sx={{ py: 2 }} variant='h6'>
              Additional Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Divider sx={{ mb: 4 }} />
            <Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Authorized First Name:</Typography>
                <Typography variant='body2'>{'John'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Authorized Last Name:</Typography>
                <Typography variant='body2'>{'Doe'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Authorized Email:</Typography>
                <Typography variant='body2'>{'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Authroized Phone Number:</Typography>
                <Typography variant='body2'>{'N/A'}</Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  )
}
