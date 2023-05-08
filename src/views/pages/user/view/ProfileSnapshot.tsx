import { useState, SyntheticEvent, useEffect, ReactElement } from 'react'

//MUI components
import AccordionDetails from '@mui/material/AccordionDetails'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomChip from 'src/@core/components/mui/chip'
import IconButton from '@mui/material/IconButton'

//Custom Components
import { styled } from '@mui/material/styles'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'

//Imported Components
import AssigneeDialog from './components/snapshot/AssigneeDialog'
import StatusDialog from './components/snapshot/StatusDialog'
import PersonalDialog from './components/snapshot/PersonalDialog'

//Icon Import
import Icon from 'src/@core/components/icon'

//Imported Types
import { ProfileInfoType, ProfileLabelsType } from 'src/store/api/profileApiSlice'
import { ProfileContactType } from 'src/store/api/profileApiSlice'
import { ProfileCustomFieldType } from 'src/store/api/profileApiSlice'

//Utils
import { format } from 'date-fns'

//API Calls
import { useAppSelector } from 'src/store/hooks'
import { selectEnrollmentByProfileId } from 'src/store/enrollmentSlice'
import { useGetEnrollmentQuery } from 'src/store/api/apiHooks'
import { Button, Fade, Menu, MenuItem } from '@mui/material'

import { useConfirm } from 'material-ui-confirm'

//Entire View
type Props = {
  data: ProfileInfoType
}

//Profile Info/Details
type ProfileInfoProps = {
  firstName: string
  lastName: string
  profileId: string
  status: number
  statusName: string
  stage: number
  stageName: string
  stageStatusName: string
  createdAt: string
  createdByName: string
  createdCompanyName: string
  campaignName: string
  profileLabels: any[]
  profileAssignees: any[]
}

type ProfileTitleProps = {
  handleClick: (type: string) => void
  firstName: string
  lastName: string
  profileId: string
  statusName: string
  status: number
}

type ProfileStageStatusProps = {
  stageName: string
  stageStatusName: string
  stage: number
  status: number
}

type ProfileDetailsProps = {
  profileLabels: any[]
  profileAssignees: any[]
  status: number
  createdByName: string
  createdAt: string
  createdCompanyName: string
  campaignName: string
  handleClick: (type: string) => void
}

//Personal Info
type PersonalInfoProps = {
  data: ProfileInfoType
}

//Enrollment Info
type EnrollmentInfoProps = {
  profileId: string
}

//Profile Custom Fields
type ProfileCustomFieldsProps = {
  profileCustomFields: any[]
}

//Custom Styling
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

// returns date in mm/dd/yyyy form
const DateConverter = (date: string | undefined) => {
  if (!date) {
    return 'N/A'
  }
  return new Date(date).toLocaleDateString('en-US')
}

// returns money in $xx.xx form
const MoneyConverter = (money: string | number | undefined) => {
  if (!money || money === 'N/A') {
    return 'N/A'
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(money))
}

export default function ProfileSnapshot({ data }: Props) {
  const {
    createdAt,
    createdByName,
    createdCompanyName,
    campaignName,
    profileId,
    firstName,
    lastName,
    status,
    statusName,
    stage,
    stageName,
    stageStatusName,
    profileAssignees,
    profileLabels,
    profileCustomFields
  } = data
  return (
    <>
      <Grid container spacing={6}>
        {/* Name, ID, & Details */}
        <Grid item xs={12}>
          <ProfileInfo
            firstName={firstName}
            lastName={lastName}
            profileId={profileId}
            status={status}
            statusName={statusName}
            stage={stage}
            stageName={stageName}
            stageStatusName={stageStatusName}
            createdAt={createdAt}
            createdByName={createdByName}
            createdCompanyName={createdCompanyName}
            campaignName={campaignName}
            profileLabels={profileLabels}
            profileAssignees={profileAssignees}
          />
        </Grid>
        {/* Personal Info Accordion */}
        <Grid item xs={12}>
          <PersonalInfo data={data} />
        </Grid>
        {/* Enrollment Accordion */}
        <Grid item xs={12}>
          <EnrollmentInfo profileId={profileId} />
        </Grid>
        {/* Additional Info Accordion */}
        <ProfileCustomFields profileCustomFields={profileCustomFields} />
      </Grid>
    </>
  )
}

const ProfileInfo = ({
  firstName,
  lastName,
  profileId,
  status,
  statusName,
  stage,
  stageName,
  stageStatusName,
  createdAt,
  createdByName,
  createdCompanyName,
  campaignName,
  profileLabels,
  profileAssignees
}: ProfileInfoProps): ReactElement => {
  //Confirmation Modal
  const confirm = useConfirm()

  const handleClick = (type: string) => {
    confirm({
      title: 'Confirmation',
      description: 'Are you sure you want to continue?',
      confirmationText: 'Accept',
      dialogProps: { maxWidth: 'xs' }
    }).then(() => {
      switch (type) {
        case 'submit':
          console.log(`submitting profileId: ${profileId}`)
          break
        case 'approve':
          console.log(`approving profileId: ${profileId}`)
          break
        case 'reject':
          console.log(`rejecting profileId: ${profileId}`)
          break
        case 'enroll':
          console.log(`enrolling profileId: ${profileId}`)
          break
        case 'delete':
          console.log(`deleting profileId: ${profileId}`)
          break
        case 'pause':
          console.log(`pause profileId: ${profileId}`)
          break
        case 'cancel':
          console.log(`cancel profileId: ${profileId}`)
          break
        case 'resume':
          console.log(`resume profileId: ${profileId}`)
          break
      }
    })
  }
  return (
    <Card>
      <ProfileTitle
        handleClick={handleClick}
        firstName={firstName}
        lastName={lastName}
        profileId={profileId}
        statusName={statusName}
        status={status}
      />
      <ProfileStageStatus stageName={stageName} stageStatusName={stageStatusName} stage={stage} status={status} />
      <ProfileDetails
        profileLabels={profileLabels}
        profileAssignees={profileAssignees}
        status={status}
        createdAt={createdAt}
        createdByName={createdByName}
        createdCompanyName={createdCompanyName}
        campaignName={campaignName}
        handleClick={handleClick}
      />
    </Card>
  )
}

const ProfileTitle = ({
  handleClick,
  firstName,
  lastName,
  profileId,
  statusName,
  status
}: ProfileTitleProps): ReactElement => {
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

  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const menuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget)
  }

  const menuClose = () => {
    setAnchor(null)
  }

  return (
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'end', mb: 1 }}>
        <IconButton size='small' aria-label='profile-dropdown' aria-controls='profile-controls' onClick={menuClick}>
          <Icon icon='mdi:dots-vertical' />
        </IconButton>
        <Menu
          id='profile-controls'
          TransitionComponent={Fade}
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={menuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <MenuItem sx={{ minWidth: '150px' }} onClick={() => handleClick('delete')}>
            Delete
          </MenuItem>
          <MenuItem>Reenroll</MenuItem>
        </Menu>
      </Box>
      <Typography mb={2} variant='h4'>
        {firstName ?? ''} {lastName ?? ''}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h6'>ID: {profileId}</Typography>
        <CustomChip
          skin='light'
          label={statusName?.toUpperCase() ?? ''}
          color={statusDictionary[status ?? 0]}
        ></CustomChip>
      </Box>
    </CardContent>
  )
}

const ProfileStageStatus = ({ stageName, stageStatusName, stage, status }: ProfileStageStatusProps) => {
  const [statusDialog, setStatusDialog] = useState<boolean>(false)
  const toggleStatus = () => setStatusDialog(!statusDialog)

  return (
    <>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'end' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1 }}>
            <Typography variant='caption'>Stage</Typography>
            <CustomChip skin='light' label={stageName ?? 'None'} color='primary' />
          </Box>
          <Box>
            <Icon icon='material-symbols:arrow-right-alt' />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1 }}>
            <Typography variant='caption'>Status</Typography>
            <CustomChip skin='light' label={stageStatusName ?? 'None'} color='warning' />
          </Box>
        </Box>
      </CardContent>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant='contained' size='small' onClick={toggleStatus}>
          Change Stage/Status
        </Button>
      </Box>

      <StatusDialog open={statusDialog} toggle={toggleStatus} stage={stage} status={status} />
    </>
  )
}

const ProfileDetails = ({
  profileLabels,
  profileAssignees,
  status,
  createdByName,
  createdAt,
  createdCompanyName,
  campaignName,
  handleClick
}: ProfileDetailsProps) => {
  //Edit Assignee
  const [assigneeDialog, setAssigneeDialog] = useState<boolean>(false)
  const [assignee, setAssignee] = useState<{
    assigneeId: string
    assigneeName: string
    employeeAlias: string
    employeeId: string
  }>({
    assigneeId: '',
    assigneeName: '',
    employeeId: '',
    employeeAlias: ''
  })

  const closeAssignee = () => setAssigneeDialog(false)

  const editAssignee = (assigneeId: string, employeeAlias: string, assigneeName: string, employeeId: string) => {
    setAssignee({ assigneeId, assigneeName, employeeAlias, employeeId })
    setAssigneeDialog(true)
  }

  return (
    <>
      <CardContent>
        <Typography mb={2} variant='h6'>
          Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Labels:</Typography>
            {profileLabels.filter((label: any) => label.value !== 'N/A').length > 0 ? (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {profileLabels.map((label, index) => {
                  return <CustomChip key={'label' + index} skin='light' label={String(label.name)} color='primary' />
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
          {profileAssignees.map((assignee: any, index: number) => {
            return (
              <>
                <Box
                  key={'assignee' + index}
                  sx={{ display: 'flex', mb: 2, justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{assignee.assigneeName}</Typography>
                  <Button
                    size='small'
                    color='info'
                    onClick={() =>
                      editAssignee(assignee.assigneeId, assignee.companyId, assignee.assigneeName, assignee.employeeId)
                    }
                  >
                    {assignee.employeeAlias === 'N/A' ? 'Unassigned' : assignee.employeeAlias}
                  </Button>
                </Box>
                <Box key={'assignees' + index} sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                    {assignee.assigneeCompanyLabel}
                  </Typography>
                  <Typography variant='body2' align='right'>
                    {assignee.companyName}
                  </Typography>
                </Box>
              </>
            )
          })}
        </Box>
        <Box sx={{ display: 'flex', mt: 1, justifyContent: 'space-evenly' }}>
          {status === 0 ? (
            <Button size='small' color='primary' variant='contained' onClick={() => handleClick('submit')}>
              Submit
            </Button>
          ) : null}
          {status === 1 ? (
            <Button size='small' color='info' variant='contained' onClick={() => handleClick('approve')}>
              Approve
            </Button>
          ) : null}
          {status === 1 ? (
            <Button size='small' color='warning' variant='contained' onClick={() => handleClick('reject')}>
              Reject
            </Button>
          ) : null}
          {status === 7 ? (
            <Button size='small' color='success' variant='contained' onClick={() => handleClick('enroll')}>
              Enroll
            </Button>
          ) : null}
          {status === 2 ? (
            <>
              <Button size='small' color='secondary' variant='contained' onClick={() => handleClick('pause')}>
                Pause
              </Button>
              <Button size='small' color='error' variant='contained' onClick={() => handleClick('cancel')}>
                Cancel
              </Button>
            </>
          ) : null}
          {status === 6 ? (
            <Button size='small' color='primary' variant='contained' onClick={() => handleClick('resume')}>
              Resume
            </Button>
          ) : null}
        </Box>
      </CardContent>
      <AssigneeDialog open={assigneeDialog} data={assignee} toggle={closeAssignee} />
    </>
  )
}

const PersonalInfo = ({ data }: PersonalInfoProps): ReactElement => {
  const { birthdate, ssn, genderName, profileContacts, profileAddresses } = data

  const [personalDialog, setPersonalDialog] = useState<boolean>(false)
  const togglePersonal = () => setPersonalDialog(!personalDialog)

  return (
    <>
      <Accordion defaultExpanded>
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
            {profileContacts.map((contact, index: number) => {
              return (
                <Box key={'contacts' + index} sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{contact.contactName}</Typography>
                  <Typography variant='body2'>{contact.value}</Typography>
                </Box>
              )
            })}
            {profileAddresses.map((address: any, index: number) => {
              return (
                <Box key={'address' + index} sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{address.addressName}</Typography>
                  <Box>
                    {address.address1 !== 'N/A' ? (
                      <>
                        <Typography align='right' variant='body2'>
                          {address.address1 + (` ${address.address2}` ?? '')}
                        </Typography>
                        <Typography align='right' variant='body2'>
                          {address.city}, {address.state} {address.zipCode}
                        </Typography>
                      </>
                    ) : (
                      <Typography align='right' variant='body2'>
                        N/A
                      </Typography>
                    )}
                  </Box>
                </Box>
              )
            })}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={togglePersonal} size='small'>
              Update Profile
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
      <PersonalDialog open={personalDialog} toggle={togglePersonal} data={data} />
    </>
  )
}

const EnrollmentInfo = ({ profileId }: EnrollmentInfoProps): ReactElement => {
  useGetEnrollmentQuery(profileId, { skip: !profileId })
  const enrollmentData = useAppSelector(state => selectEnrollmentByProfileId(state, profileId))

  console.log(enrollmentData)

  return (
    <Accordion>
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
  )
}

const ProfileCustomFields = ({ profileCustomFields }: ProfileCustomFieldsProps) => {
  return (
    <>
      {profileCustomFields.length > 0 ? (
        <Grid item xs={12}>
          <Accordion>
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
    </>
  )
}
