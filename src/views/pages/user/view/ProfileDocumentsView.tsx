import { Dispatch, SetStateAction, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
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
import { Grid } from '@mui/material'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

import StepperCustomDot from './components/document/stepperCustomDot'

import { CardContentProps } from '@mui/material/CardContent'

import { Card, styled } from '@mui/material'

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
import { selectDocumentsByProfileIdAndType } from 'src/store/documentSlice'
import { useGetDocumentsQuery, usePostDocumentUploadMutation, usePostEmployeeSearchQuery } from 'src/store/api/apiHooks'
import { useForm } from 'react-hook-form'
import { DocumentUploadType } from 'src/store/api/documentApiSlice'
import { toast } from 'react-hot-toast'

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

export default function ProfileDocuments({ id }: { id: string }) {
  const [openUploadDialog, setUploadDialog] = useState<boolean>(false)
  const [openGenerateDrawer, setGenerateDrawer] = useState<boolean>(false)
  const [tab, setTab] = useState<string>('esign')
  const [tabLoading, setTabLoading] = useState<boolean>(false)

  //rows for tables

  const { isSuccess: docSuccess } = useGetDocumentsQuery(id, { skip: !id })
  const { isSuccess: employeeSuccess } = usePostEmployeeSearchQuery({})

  const esignDocs = useAppSelector(state => selectDocumentsByProfileIdAndType(state, id, 1))
  const generateDocs = useAppSelector(state => selectDocumentsByProfileIdAndType(state, id, 3))
  const uploadedDocs = useAppSelector(state => selectDocumentsByProfileIdAndType(state, id, 0))

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
              <Typography variant='h4'>{esignDocs.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant='caption'>Generated Docs</Typography>
              <Typography variant='h4'>{generateDocs.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant='caption'>Uploaded Docs</Typography>
              <Typography variant='h4'>{uploadedDocs.length}</Typography>
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
                        {docSuccess && employeeSuccess && <TableColumns rows={esignDocs} />}
                      </TabPanel>
                      <TabPanel value='generated'>
                        {docSuccess && employeeSuccess && <TableColumns rows={generateDocs} />}
                      </TabPanel>
                      <TabPanel value='uploaded'>
                        {docSuccess && employeeSuccess && <TableColumns rows={uploadedDocs} />}
                      </TabPanel>
                    </>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <GenerateSidebar setTab={setTab} open={openGenerateDrawer} toggle={toggleDrawer} profileId={id} />
      <UploadDialog setTab={setTab} profileId={id} open={openUploadDialog} toggle={toggleDialog} />
    </TabContext>
  )
}

type DialogProps = {
  open: boolean
  toggle: () => void
  profileId: string
  setTab: Dispatch<SetStateAction<string>>
}

//Dialog


export interface UploadFormValueType {
  title: string
  description: string
  file: File[]
  category: string
}

const uploadDefaultValue: UploadFormValueType = {
  title: "",
  description: "",
  file: [],
  category: ""
}

const UploadDialog = ({ open, toggle, profileId, setTab }: DialogProps) => {
  const [activeStep, setActiveStep] = useState<number>(0)

  const { reset, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<UploadFormValueType>({ defaultValues: uploadDefaultValue })

  const [uploadDoc, { isLoading }] = usePostDocumentUploadMutation()

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

  const handleUpload = async (data: UploadFormValueType) => {
    console.log(data)
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("file", data.file[0]);
    formData.append("description", data.description);
    const uploadData: DocumentUploadType = {
      profileId,
      data: formData
    }

    const { data: postData }: { data?: any, error?: any } = await uploadDoc(uploadData)

    if (postData) {
      toast.success("You successfully uploaded document")
      reset(uploadDefaultValue)
      setTab("uploaded")
      toggle()
      setActiveStep(0)
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  const getStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return <FileUploaderSingle setValue={setValue} watch={watch} />
      case 1:
        return <FileUploadForm errors={errors} control={control} />
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
        {stepCondition &&
          <Button
            variant='contained'
            color={'success'}
            disabled={isLoading}
            onClick={handleSubmit(handleUpload)}
          >
            Submit
          </Button>}
        {!stepCondition &&
          <Button
            variant='contained'
            color={'primary'}
            endIcon={<Icon icon='mdi:arrow-right' />}
            onClick={() => (handleNext())}
          >
            Next
          </Button>}

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
            {isLoading && <CircularProgress
              sx={{
                position: 'absolute',
                right: '50%',
                top: '25%'
              }}
            />}
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
