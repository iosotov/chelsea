import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import StepLabel from '@mui/material/StepLabel'
import Step from '@mui/material/Step'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Tab from '@mui/material/Tab'
import CircularProgress from '@mui/material/CircularProgress'

// import TabList from '@mui/lab/TabList'
import { Grid, Table } from '@mui/material'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

import StepperCustomDot from './components/document/stepperCustomDot'

import { CardContentProps } from '@mui/material/CardContent'

import { Badge, Card, Chip, styled } from '@mui/material'

//Icon Import
import Icon from 'src/@core/components/icon'

//Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import FileUploaderSingle from './components/document/fileUploader'
import FileUploadForm from './components/document/fileUploadForm'
import GenerateSidebar from './components/document/generateSidebar'
import { SyntheticEvent } from 'react-draft-wysiwyg'
import TableColumns from './components/document/table'

//API calls
import { useAppSelector } from 'src/store/hooks'
import { selectDocumentsByProfileId } from 'src/store/documentSlice'
import { DocumentType } from 'src/store/api/documentApiSlice'
import { useGetDocumentsQuery } from 'src/store/api/apiHooks'

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,

    //hard coded color b/c change in tablist variant
    color: 'white !important'
  },
  '& .MuiTab-root': {
    minHeight: 38,
    minWidth: 130,
    borderRadius: theme.shape.borderRadius
  }
}))

export default function ProfileDocuments({ id }: { id: string | string[] }) {
  const [openUploadDialog, setUploadDialog] = useState<boolean>(false)
  const [openGenerateDrawer, setGenerateDrawer] = useState<boolean>(false)
  const [tab, setTab] = useState<string>('esign')
  const [tabLoading, setTabLoading] = useState<boolean>(false)

  //rows for tables

  useGetDocumentsQuery(String(id))
  const data = useAppSelector(state => selectDocumentsByProfileId(state, String(id)))

  //toggles Upload Dialog
  const toggleDialog = () => setUploadDialog(!openUploadDialog)

  //toggles Generate Drawer
  const toggleDrawer = () => setGenerateDrawer(!openGenerateDrawer)

  const handleTabChange = (e: SyntheticEvent, newValue: string) => {
    setTabLoading(true)
    setTab(newValue)
    setTimeout(() => {
      setTabLoading(false)
    }, 0)
  }

  return (
    <TabContext value={tab}>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant='caption'>E-Sign Contracts</Typography>
              <Typography variant='h4'>{data.filter(e => e.type === 1).length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant='caption'>Generated Docs</Typography>
              <Typography variant='h4'>{data.filter(e => e.type === 3).length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant='caption'>Uploaded Docs</Typography>
              <Typography variant='h4'>{data.filter(e => e.type === 0).length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button startIcon={<Icon icon='mdi:file-document-plus-outline' />} onClick={toggleDrawer}>
                  Generate
                </Button>
                <Button startIcon={<Icon icon='mdi:file-upload-outline' />} onClick={toggleDialog}>
                  Upload
                </Button>
              </Box>
            </CardContent>
            <CardContent>
              <Box>
                <TabList variant='fullWidth' onChange={handleTabChange}>
                  <Tab value='esign' label='E-Sign Contracts' />
                  <Tab value='generated' label='Generated Docs' />
                  <Tab value='uploaded' label='Uploaded Docs' />
                </TabList>
                <Box sx={{ minHeight: 280 }}>
                  {tabLoading ? (
                    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                      <CircularProgress sx={{ mb: 4 }} />
                      <Typography>Loading...</Typography>
                    </Box>
                  ) : (
                    <>
                      <TabPanel value='esign'>
                        <TableColumns rows={data.filter(e => e.type === 1)} />
                      </TabPanel>
                      <TabPanel value='generated'>
                        <TableColumns rows={data.filter(e => e.type === 3)} />
                      </TabPanel>
                      <TabPanel value='uploaded'>
                        <TableColumns rows={data.filter(e => e.type === 0)} />
                      </TabPanel>
                    </>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <GenerateSidebar open={openGenerateDrawer} toggle={toggleDrawer} />
      <UploadDialog open={openUploadDialog} toggle={toggleDialog} />
    </TabContext>
  )
}

type DialogProps = {
  open: boolean
  toggle: () => void
}

//Dialog

const UploadDialog = ({ open, toggle }: DialogProps) => {
  const [activeStep, setActiveStep] = useState<number>(0)

  const steps = [
    {
      title: 'Upload',
      icon: 'mdi:tag-outline',
      subtitle: 'Upload and Preview'
    },
    {
      title: 'Upload Details',
      subtitle: 'Provide upload details',
      icon: 'mdi:clipboard-text-outline'
    }
  ]

  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }
  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  const getStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return <FileUploaderSingle />
      case 1:
        return <FileUploadForm />
      default:
        return null
    }
  }

  const renderFooter = () => {
    const stepCondition = activeStep === steps.length - 1

    return (
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          color='secondary'
          variant='outlined'
          onClick={handlePrev}
          disabled={activeStep === 0}
          startIcon={<Icon icon='mdi:arrow-left' />}
        >
          Previous
        </Button>
        <Button
          variant='contained'
          color={stepCondition ? 'success' : 'primary'}
          {...(!stepCondition ? { endIcon: <Icon icon='mdi:arrow-right' /> } : {})}
          onClick={() => (stepCondition ? alert('Submitted..!!') : handleNext())}
        >
          {stepCondition ? 'Submit' : 'Next'}
        </Button>
      </Box>
    )
  }

  return (
    <>
      <Dialog open={open} onClose={toggle} maxWidth='md' fullWidth>
        <DialogTitle>
          Upload Document
          <IconButton
            aria-label='close'
            onClick={toggle}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <StepperHeaderContainer>
            <StepperWrapper sx={{ height: '100%' }}>
              <Stepper connector={<></>} activeStep={activeStep} orientation='vertical'>
                {steps.map((step, index) => {
                  return (
                    <Step key={index} sx={{ '&.Mui-completed + svg': { color: 'primary.main' } }}>
                      <StepLabel StepIconComponent={StepperCustomDot}>
                        <div className='step-label'>
                          <div>
                            <Typography className='step-title'>{step.title}</Typography>
                            <Typography className='step-subtitle'>{step.subtitle}</Typography>
                          </div>
                        </div>
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
            </StepperWrapper>
          </StepperHeaderContainer>
          <Box sx={{ p: 4, width: '100%' }}>
            {renderContent()}
            {renderFooter()}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

const StepperHeaderContainer = styled(CardContent)<CardContentProps>(({ theme }) => ({
  minWidth: 300,
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))
