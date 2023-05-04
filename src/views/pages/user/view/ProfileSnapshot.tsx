import { useState, SyntheticEvent, useEffect } from 'react'

//MUI components
import AccordionDetails from '@mui/material/AccordionDetails'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

//Custom Components
import { styled } from '@mui/material/styles'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'

//Imported Components
import StatusDialog from './components/snapshot/StatusDialog'
import ConfirmationDialog from 'src/views/shared/dialog/confirmationDialog'

//Icon Import
import Icon from 'src/@core/components/icon'

//Imported Types
import { ProfileInfoType } from 'src/store/api/profileApiSlice'
import { ProfileContactType } from 'src/store/api/profileApiSlice'
import { ProfileCustomFieldType } from 'src/store/api/profileApiSlice'

//Utils
import { format } from 'date-fns'

//API Calls
import { useAppSelector } from 'src/store/hooks'
import { selectEnrollmentByProfileId } from 'src/store/enrollmentSlice'
import { useGetEnrollmentQuery } from 'src/store/api/apiHooks'
import { Button, Hidden } from '@mui/material'
import PersonalDialog from './components/snapshot/PersonalDialog'

type Props = {
  data: ProfileInfoType
}

const Accordion = styled(MuiAccordion)<AccordionProps>(({ theme }) => ({
  boxShadow: '0px 2px 10px 0px rgba(58, 53, 65, 0.1)',
  transition: 'outline-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  outline: '2px solid transparent',
  '&.Mui-expanded': {
    outlineColor: `${theme.palette.primary.main}`
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

export default function ProfileSnapshot({ data }: Props) {
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
    statusName,
    stage,
    stageName,
    stageStatusName,
    profileAddresses,
    profileAssignees,
    profileContacts,
    profileLabels,
    profileCustomFields
  } = data

  //status dictionary
  const statusDictionary = [
    'secondary',
    'success',
    'info',
    'warning',
    'secondary',
    'error',
    'secondary',
    'secondary',
    'primary',
    'secondary',
    'secondary'
  ]

  //Enrollment info
  useGetEnrollmentQuery(profileId)
  const enrollmentData = useAppSelector(state => selectEnrollmentByProfileId(state, profileId))

  // returns date in mm/dd/yyyy form
  const DateConverter = (date: string | undefined) => {
    if (!date) {
      return 'N/A'
    }
    return new Date(date).toLocaleDateString('en-US')
  }

  // returns money in $xx.xx form
  const MoneyConverter = (money: string | number | undefined) => {
    if (!money) {
      return 'N/A'
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(money))
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

  console.log('rerendered')

  //Stage/Status Edit Dialog
  const [statusDialog, setStatusDialog] = useState<boolean>(false)
  const toggleStatus = () => setStatusDialog(!statusDialog)

  //Update PersonalInfo Dialog
  const [personalDialog, setPersonalDialog] = useState<boolean>(false)
  const togglePersonal = () => setPersonalDialog(!personalDialog)

  //Confirmation Dialog
  const [confirmationDialog, setConfirmationDialog] = useState<boolean>(false)
  const toggleConfirmation = () => setConfirmationDialog(!confirmationDialog)

  //Phone = 0, email = 1, fax = 2
  const generatePhone = () => {
    const contacts: ProfileContactType[] = profileContacts.filter(
      (contact: ProfileContactType) => contact.contactType === 0
    )

    if (contacts.length === 0) {
      return (
        <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Phone:</Typography>
          <Typography variant='body2'>N/A</Typography>
        </Box>
      )
    }

    const contactElement = contacts.map((contact: ProfileContactType, index: number) => {
      return (
        <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
            Phone{contacts.length === 1 ? null : ` ${index + 1}`}:
          </Typography>
          <Typography variant='body2'>{contact.value ?? 'N/A'}</Typography>
        </Box>
      )
    })

    return contactElement
  }

  const generateEmail = () => {
    const contacts: ProfileContactType[] = profileContacts.filter(
      (contact: ProfileContactType) => contact.contactType === 1
    )

    if (contacts.length === 0) {
      return (
        <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Email:</Typography>
          <Typography variant='body2'>N/A</Typography>
        </Box>
      )
    }

    const contactElement = contacts.map((contact: ProfileContactType, index: number) => {
      return (
        <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
            Email{contacts.length === 1 ? null : ` ${index + 1}`}:
          </Typography>
          <Typography variant='body2'>{contact.value ?? 'N/A'}</Typography>
        </Box>
      )
    })

    return contactElement
  }
  const generateFax = () => {
    const contacts: ProfileContactType[] = profileContacts.filter(
      (contact: ProfileContactType) => contact.contactType === 0
    )

    const contactElement = contacts.map((contact: ProfileContactType, index: number) => {
      return (
        <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
            Fax{contacts.length === 1 ? null : ` ${index + 1}`}:
          </Typography>
          <Typography variant='body2'>{contact.value ?? 'N/A'}</Typography>
        </Box>
      )
    })

    return contactElement
  }

  return (
    <>
      <Grid container spacing={6}>
        {/* Name, ID, & Details */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'end', mb: 1 }}>
                <Button size='small' color='error'>
                  Delete
                </Button>
              </Box>
              <Typography mb={2} variant='h4'>
                {firstName ?? ''} {lastName ?? ''}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h6'>ID: {profileId}</Typography>
                <Chip label={statusName?.toUpperCase() ?? ''} color={statusDictionary[status ?? 0]}></Chip>
              </Box>
            </CardContent>

            <CardContent>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'end' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1 }}>
                  <Typography variant='caption'>Stage</Typography>
                  <Chip label={stageName ?? 'None'} color='primary' />
                </Box>
                <Box>
                  <Icon icon='material-symbols:arrow-right-alt' />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1 }}>
                  <Typography variant='caption'>Status</Typography>
                  <Chip label={stageStatusName ?? 'None'} color='warning' />
                </Box>
              </Box>
            </CardContent>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' size='small' onClick={toggleStatus}>
                Change Stage/Status
              </Button>
            </Box>

            <CardContent>
              <Typography mb={2} variant='h6'>
                Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Labels:</Typography>
                  {profileLabels.length > 0 ? (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {profileLabels.map(label => {
                        return <Chip label={String(label)} color='primary' />
                      })}
                    </Box>
                  ) : (
                    <Typography variant='body2' align='right'>
                      None
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Created By:</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant='body2'>{createdByName ?? 'N/A'}</Typography>
                    <Typography variant='body2' sx={{ fontSize: '0.625rem' }}>
                      {format(new Date(createdAt), 'PPp')}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Data Point:</Typography>
                  <Typography variant='body2' align='right'>
                    {createdCompanyName ?? 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Campaign:</Typography>
                  <Typography variant='body2' align='right'>
                    {campaignName ?? 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Account Manager:</Typography>
                  <Typography variant='body2' align='right'>
                    {profileAssignees[0]?.assigneeName ?? 'Unassigned'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Servicing Company:</Typography>
                  <Typography variant='body2' align='right'>
                    {profileAssignees[0]?.assigneeCompanyLabel ?? 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Marketing Agent:</Typography>
                  <Typography variant='body2' align='right'>
                    {profileAssignees[0]?.employeeAlias ?? 'Unassigned'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Marketing Company:</Typography>
                  <Typography variant='body2' align='right'>
                    {profileAssignees[0]?.companyName ?? 'N/A'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mt: 1, justifyContent: 'space-evenly' }}>
                <Button size='small' color='primary' variant='contained'>
                  Submit
                </Button>
                <Button size='small' color='info' variant='contained' onClick={toggleConfirmation}>
                  Approve
                </Button>
                <Button size='small' color='warning' variant='contained' onClick={toggleConfirmation}>
                  Reject
                </Button>
                <Button size='small' color='success' variant='contained' onClick={toggleConfirmation}>
                  Enroll
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Personal Info Accordion */}
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
              <Box mb={4}>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Date of Birth:</Typography>
                  <Typography variant='body2'>{DateConverter(birthdate) ?? 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>SSN:</Typography>
                  <Typography variant='body2'>{ssn ?? 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Gender:</Typography>
                  <Typography variant='body2'>{genderName ?? 'N/A'}</Typography>
                </Box>
                {generatePhone()}
                {generateEmail()}
                {generateFax()}
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Mailing Address:</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant='body2'>
                      {profileAddresses[0]?.address1 ?? ''} {profileAddresses[0]?.address2 ?? ''}
                    </Typography>
                    <Typography variant='body2'>
                      {profileAddresses[0]?.city}, {profileAddresses[0]?.state} {profileAddresses[0]?.zipCode}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={togglePersonal} size='small'>
                  Update Profile
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>
        {/* Enrollment Accordion */}
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
                  <Typography variant='body2' align='right'>
                    {MoneyConverter(enrollmentData?.enrolledBalance)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>% of Enrolled Debt:</Typography>
                  <Typography variant='body2' align='right'>
                    {(enrollmentData?.enrollmentFee ?? 0) * 100}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>First Payment:</Typography>
                  <Typography variant='body2' align='right'>
                    {!enrollmentData?.firstPaymentDate && !enrollmentData?.firstPaymentAmount
                      ? 'N/A'
                      : `${DateConverter(enrollmentData?.firstPaymentDate)} - ${MoneyConverter(
                          enrollmentData?.firstPaymentAmount
                        )}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Last Payment:</Typography>
                  <Typography variant='body2' align='right'>
                    {!enrollmentData?.lastPaymentDate && !enrollmentData?.lastPaymentAmount
                      ? 'N/A'
                      : `${DateConverter(enrollmentData?.lastPaymentDate)} - ${MoneyConverter(
                          enrollmentData?.lastPaymentAmount
                        )}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Last Payment Status:</Typography>
                  <Typography variant='body2' align='right'>
                    {enrollmentData?.lastPaymentStatusName ?? 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Next Payment:</Typography>
                  <Typography variant='body2' align='right'>
                    {!enrollmentData?.nextPaymentDate && !enrollmentData?.nextPaymentAmount
                      ? 'N/A'
                      : `${DateConverter(enrollmentData?.nextPaymentDate)} - ${MoneyConverter(
                          enrollmentData?.nextPaymentAmount
                        )}`}
                  </Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>
        {/* Additional Info Accordion */}
        {profileCustomFields.length > 0 ? (
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
                  {profileCustomFields.map((field: ProfileCustomFieldType) => {
                    return (
                      <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                        <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{field.fieldName}</Typography>
                        <Typography variant='body2' align='right'>
                          {field.value}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ) : null}
      </Grid>
      <StatusDialog open={statusDialog} toggle={toggleStatus} stage={stage} status={status} />
      <PersonalDialog open={personalDialog} toggle={togglePersonal} data={enrollmentData} />
      <ConfirmationDialog
        open={confirmationDialog}
        toggle={toggleConfirmation}
        title='Confirmation'
        textBody='Are you sure you want to continue?'
        action={() => console.log('accepted')}
      />
    </>
  )
}
