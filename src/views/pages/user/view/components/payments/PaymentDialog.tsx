import { ReactElement, useState } from 'react'

import { useForm } from 'react-hook-form'

//Mui Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

//Dialog Components
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

//MUI Custom Styles
import { styled } from '@mui/material/styles'
import { CardContentProps } from '@mui/material/CardContent'
import StepperWrapper from 'src/@core/styles/mui/stepper'

//Custom Components
import PaymentFormType from './PaymentFormType'
import PaymentFormInformation from './PaymentFormInformation'
import PaymentFormBilling from './PaymentFormBilling'
import PaymentFormSubmit from './PaymentFormSubmit'

//Materio Provided Comp
import Icon from 'src/@core/components/icon'

type PaymentDialogProps = {
  open: boolean
  handleClose: () => void
}

//Custom Styling
const StepperHeaderContainer = styled(CardContent)<CardContentProps>(({ theme }) => ({
  minWidth: 300,
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const PaymentDialog = ({ open, handleClose }: PaymentDialogProps): ReactElement => {
  const [activeStep, setActiveStep] = useState<number>(0)

  const steps = [
    {
      title: 'Payment Type',
      subtitle: 'Select payment type'
    },
    {
      title: 'Payment Information',
      subtitle: 'Provide payment details'
    },
    {
      title: 'Billing Address',
      subtitle: 'Fill out payment address'
    },
    {
      title: 'Submit',
      subtitle: 'Review and submit'
    }
  ]

  //string arrays used for form validation triggers

  const paymentType = useForm()
  const {
    formState: { errors: typeErrors }
  } = paymentType

  const paymentInfo = useForm()
  const {
    formState: { errors: infoErrors }
  } = paymentInfo

  const paymentBill = useForm()
  const {
    formState: { errors: billErrors }
  } = paymentBill

  const paymentSubmit = useForm()

  const onSubmit = () => {
    const type = paymentType.getValues()
    const info = paymentInfo.getValues()
    const bill = paymentBill.getValues()
    const primary = paymentSubmit.getValues()

    const data = {
      ...type,
      ...info,
      ...bill,
      ...primary
    }

    console.log(data)
    onDialogClose()
  }

  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }
  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const onDialogClose = () => {
    console.log('closed')
    handleClose()
    paymentType.reset()
    paymentInfo.reset()
    paymentBill.reset()
    paymentSubmit.reset()
    setActiveStep(0)
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  const getStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return <PaymentFormType control={paymentType.control} errors={typeErrors} />
      case 1:
        return (
          <PaymentFormInformation
            type={paymentType.getValues('paymentType')}
            control={paymentInfo.control}
            errors={infoErrors}
          />
        )
      case 2:
        return <PaymentFormBilling control={paymentBill.control} errors={billErrors} />
      case 3:
        const type = paymentType.getValues()
        const info = paymentInfo.getValues()
        const bill = paymentBill.getValues()

        const data = { ...type, ...info, ...bill }

        return <PaymentFormSubmit type={paymentType.getValues('paymentType')} form={paymentSubmit} data={data} />
      default:
        return null
    }
  }

  const renderFooter = () => {
    const stepCondition = activeStep === steps.length - 1

    const handleTrigger = async () => {
      const forms = [paymentType, paymentInfo, paymentBill, paymentSubmit]

      const result = await forms[activeStep].trigger()

      result ? (stepCondition ? onSubmit() : handleNext()) : null
    }

    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
          onClick={handleTrigger}
        >
          {stepCondition ? 'Submit' : 'Next'}
        </Button>
      </Box>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onDialogClose}
      maxWidth='md'
      fullWidth
      aria-labelledby='user-view-payment-card'
      aria-describedby='user-view-payment-card-description'
    >
      <DialogTitle
        id='user-view-payment-card'
        sx={{
          fontSize: '1.5rem !important'
        }}
      >
        Add New Payment Method
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
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
                    <StepLabel>
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
        <Box
          component='form'
          sx={{
            px: 4,
            width: '100%',
            mt: { xs: '24px', md: '0px' }
          }}
        >
          {renderContent()}
        </Box>
      </DialogContent>
      <Box sx={{ p: 4 }}>{renderFooter()}</Box>
    </Dialog>
  )
}

export default PaymentDialog
