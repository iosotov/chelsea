import { useEffect, useState } from 'react'

import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// custom components
import CustomInput from 'src/views/pages/user/view/components/create/PickersComponent'
import SingleSelect from 'src/views/shared/form-input/single-select'
import TextInput from 'src/views/shared/form-input/text-input'

import { useForm } from 'react-hook-form'
import SelectDate from 'src/views/shared/form-input/date-picker'
import { useGetCampaignsQuery } from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { selectAllCampaigns } from 'src/store/campaignSlice'
import { CampaignType } from 'src/store/api/campaignApiSlice'
import { SingleSelectOption } from 'src/types/forms/selectOptionTypes'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import Stepper from '@mui/material/Stepper'
import StepperCustomDot from 'src/views/pages/user/view/components/document/stepperCustomDot'
import { StepLabel } from '@mui/material'
import Step from '@mui/material/Step'

import toast from 'react-hot-toast'

const genderOptions = [
  {
    label: 'Male',
    value: 0
  },
  {
    label: 'Female',
    value: 1
  },
  {
    label: 'Other',
    value: 2
  }
]

const stateOptions = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'District Of Columbia', value: 'DC' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' }
]

export default function CreateProfile() {
  const profileForm = useForm()

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = profileForm

  const onSubmit = (data: any) => {
    console.log(data)
  }

  const campaigns = useAppSelector(state => selectAllCampaigns(state))

  useGetCampaignsQuery({
    length: 10000,
    order: [
      {
        columnName: 'campaignName',
        direction: 0
      }
    ],
    start: 0
  })

  const [campaignOptions, setCampaignOptions] = useState<SingleSelectOption[]>([])

  useEffect(() => {
    if (campaigns.length > 0) {
      const mappedCampaigns = campaigns.map((campaign: CampaignType) => {
        const { displayName, campaignId, companyName } = campaign
        return {
          label: `${displayName} - ${companyName}`,
          value: campaignId
        }
      })
      console.log(mappedCampaigns)
      setCampaignOptions(mappedCampaigns)
    }
  }, [campaigns])

  // const {
  //   reset: accountReset,
  //   control: accountControl,
  //   handleSubmit: accountSubmit,
  //   formState: { errors: accountErrors }
  // } = useForm()
  // const {
  //   reset: contactReset,
  //   control: contactControl,
  //   handleSubmit: contactSubmit,
  //   formState: { errors: contactErrors }
  // } = useForm()
  // const {
  //   reset: AdditionalReset,
  //   control: AdditionalControl,
  //   handleSubmit: AdditionalSubmit,
  //   formState: { errors: AdditionalErrors }
  // } = useForm()

  // const steps = [
  //   {
  //     title: 'Account Details',
  //     subtitle: 'Enter Client Account Details'
  //   },
  //   {
  //     title: 'Contact Info',
  //     subtitle: 'Setup Contact Information'
  //   },
  //   {
  //     title: 'Additional Info',
  //     subtitle: 'Add Additional Information'
  //   },
  //   {
  //     title: 'Overview',
  //     subtitle: 'Review Submitted Information'
  //   }
  // ]

  // const [activeStep, setActiveStep] = useState<number>(0)

  // const handleBack = () => {
  //   setActiveStep(prevActiveStep => prevActiveStep - 1)
  // }

  // const onSubmit = () => {
  //   setActiveStep(activeStep + 1)
  //   if (activeStep === steps.length - 1) {
  //     toast.success('Form Submitted')
  //   }
  // }

  // const renderContent = () => {
  //   if (activeStep === steps.length) {
  //     return (
  //       <>
  //         <Typography>All steps are completed!</Typography>
  //         <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
  //           <Button size='large' variant='contained'>
  //             Create new profile
  //           </Button>
  //         </Box>
  //       </>
  //     )
  //   } else {
  //     return getStepContent(activeStep)
  //   }
  // }

  // const getStepContent = (step: number) => {
  //   switch (step) {
  //     case 0:
  //       return (
  //         <>
  //           <Box>
  //             <Typography>{step}</Typography>
  //             <Grid container>
  //               <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
  //                 <Button size='large' variant='outlined' color='secondary' disabled>
  //                   Back
  //                 </Button>
  //                 <Button size='large' type='submit' variant='contained'>
  //                   Next
  //                 </Button>
  //               </Grid>
  //             </Grid>
  //           </Box>
  //         </>
  //       )
  //     case 1:
  //       return (
  //         <>
  //           <Box>
  //             <Typography>{step}</Typography>
  //             <Grid container>
  //               <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
  //                 <Button size='large' variant='outlined' color='secondary' disabled>
  //                   Back
  //                 </Button>
  //                 <Button size='large' type='submit' variant='contained'>
  //                   Next
  //                 </Button>
  //               </Grid>
  //             </Grid>
  //           </Box>
  //         </>
  //       )
  //       break
  //     case 2:
  //       return (
  //         <>
  //           <Box>
  //             <Typography>{step}</Typography>
  //             <Grid container>
  //               <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
  //                 <Button size='large' variant='outlined' color='secondary' disabled>
  //                   Back
  //                 </Button>
  //                 <Button size='large' type='submit' variant='contained'>
  //                   Next
  //                 </Button>
  //               </Grid>
  //             </Grid>
  //           </Box>
  //         </>
  //       )
  //     case 3:
  //       ;<>
  //         <Box>
  //           <Typography>{step}</Typography>
  //           <Grid container>
  //             <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
  //               <Button size='large' variant='outlined' color='secondary' disabled>
  //                 Back
  //               </Button>
  //               <Button size='large' type='submit' variant='contained'>
  //                 Next
  //               </Button>
  //             </Grid>
  //           </Grid>
  //         </Box>
  //       </>
  //       break
  //   }
  // }

  return (
    <Card>
      <CardContent>
        <Typography variant='h5'>Create New Profile</Typography>
        <Divider sx={{ my: 4 }}></Divider>

        <form>
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6} lg={4}>
              <SingleSelect
                name='campaign'
                label='Campaign'
                defaultLabel='Select Campaign'
                options={campaignOptions}
                control={control}
                errors={errors}
                required
              />
            </Grid>
            <Grid item xs={0} md={6} lg={8}></Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>Personal Information</Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextInput label='First Name' name='firstName' control={control} errors={errors} required />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextInput label='Last Name' name='lastName' control={control} errors={errors} required />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextInput label='Middle Name' name='middleName' control={control} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <SelectDate label='Birthdate' name='birthdate' errors={errors} control={control} required />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextInput label='SSN' name='ssn' errors={errors} control={control} required />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <SingleSelect
                label='Gender'
                defaultLabel='Select Gender'
                name='gender'
                options={genderOptions}
                control={control}
                errors={errors}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>Contact Information</Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextInput
                label='Primary Phone Number'
                name='phoneNumber'
                control={control}
                placeholder='(123) 456-7890'
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextInput
                label='Secondary Phone Number'
                name='phoneNumber2'
                control={control}
                placeholder='(123) 456-7890'
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextInput label='Email Address' name='email' control={control} placeholder='example@sample.com' />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextInput label='Home Address' name='address1' control={control} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextInput label='Address 2' name='address2' control={control} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextInput label='City' name='city' control={control} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <SingleSelect
                label='State'
                defaultLabel='Select State'
                name='state'
                options={stateOptions}
                control={control}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextInput label='Zipcode' name='zipCode' control={control} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}></Grid>
            <Grid item xs={12}>
              <Typography variant='h5'>Additional Information</Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextInput label='Authorized First Name' name='authorizedFirstName' control={control} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextInput label='Authorized Last Name' name='authorizedLastName' control={control} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextInput label='Authorized Phone Number' name='authorizedPhoneNumber' control={control} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextInput label='Authorized Email' name='authorizedEmail' control={control} />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button color='primary' variant='outlined' onClick={handleSubmit(onSubmit)}>
              Save Profile
            </Button>
          </Box>
        </form>
      </CardContent>
      {/* <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps: {
                error?: boolean
              } = {}
              // if (index === activeStep) {
              //   labelProps.error = false
              //   if (
              //     (accountErrors.email ||
              //       accountErrors.username ||
              //       accountErrors.password ||
              //       accountErrors['confirm-password']) &&
              //     activeStep === 0
              //   ) {
              //     labelProps.error = true
              //   } else if (
              //     (personalErrors.country ||
              //       personalErrors.language ||
              //       personalErrors['last-name'] ||
              //       personalErrors['first-name']) &&
              //     activeStep === 1
              //   ) {
              //     labelProps.error = true
              //   } else if (
              //     (socialErrors.google || socialErrors.twitter || socialErrors.facebook || socialErrors.linkedIn) &&
              //     activeStep === 2
              //   ) {
              //     labelProps.error = true
              //   } else {
              //     labelProps.error = false
              //   }
              // }

              return (
                <Step key={index}>
                  <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number'>{`0${index + 1}`}</Typography>
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
      </CardContent>

      <Divider />
      <CardContent>{renderContent()}</CardContent> */}
    </Card>
  )
}
