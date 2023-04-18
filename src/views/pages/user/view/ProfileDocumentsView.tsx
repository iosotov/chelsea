import { Fragment, useState } from 'react'

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

import StepperCustomDot from './components/document/stepperCustomDot'

import { CardContentProps } from '@mui/material/CardContent'

import { styled } from '@mui/material'

//Icon Import
import Icon from 'src/@core/components/icon'

//Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import FileUploaderSingle from './components/document/fileUploader'
import FileUploadForm from './components/document/fileUploadForm'

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

export default function ProfileDocuments() {
  const [open, setOpen] = useState<boolean>(false)

  const toggleOpen = () => setOpen(!open)

  return (
    <>
      <Button onClick={toggleOpen}>Profile Docs</Button>
      <UploadDialog open={open} toggle={toggleOpen} />
    </>
  )
}

type DialogProps = {
  open: boolean
  toggle: () => void
}

const UploadDialog = ({ open, toggle }: DialogProps) => {
  const [activeStep, setActiveStep] = useState<number>(0)

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
      <Dialog open={open} onClose={toggle} maxWidth='lg' fullWidth>
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
                    <Step
                      key={index}
                      onClick={() => setActiveStep(index)}
                      sx={{ '&.Mui-completed + svg': { color: 'primary.main' } }}
                    >
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
