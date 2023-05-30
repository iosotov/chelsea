// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import StepContent from '@mui/material/StepContent'

// ** Third Party Imports
import clsx from 'clsx'
import toast from 'react-hot-toast'

// ** Styled Component
import StepperWrapper from 'src/@core/styles/mui/stepper'
import StepperCustomDot from 'src/views/pages/user/view/components/createForm/StepperCustomDot'
import { useForm } from 'react-hook-form'
import PersonalInformation from 'src/views/pages/user/view/components/createForm/PersonalInformation'
import { yupResolver } from '@hookform/resolvers/yup'
import { ProfileCreateType } from 'src/store/api/profileApiSlice'
import { useLazyPostAddressSearchQuery, useLazyPostContactSearchQuery, useLazyPostCustomFieldSearchQuery, usePostProfileCreateMutation } from 'src/store/api/apiHooks'
import AdditionalInformation from 'src/views/pages/user/view/components/createForm/AdditionalInformation'
import { AddressSettingType, ContactSettingType, CustomFieldSettingType } from 'src/store/api/settingApiSlice'
import ContactInformation from 'src/views/pages/user/view/components/createForm/ContactInformation'
import { useRouter } from 'next/router'
import { Box, CircularProgress, Stack } from '@mui/material'
import { PersonalInformationForm, personalSchema } from './validators'

// PROFILE CREATE STEPS
const steps = [
  {
    title: 'Account Information',
    subtitle: 'Enter Account Details',
  },
  {
    title: 'Additional Information',
    subtitle: 'Enter Additional Details',
  },
  {
    title: 'Contact Information',
    subtitle: 'Enter Contacts and Address Details',
  }
]
export interface AdditionalInformationForm {
  customFields: CustomFieldSettingType[]
  profileContacts: ContactSettingType[],
  profileAddresses: AddressSettingType[]
}

const additionalInfoDefault: AdditionalInformationForm = {
  customFields: [],
  profileContacts: [],
  profileAddresses: [],
}

const defaultProfile = {
  firstName: "",
  lastName: "",
  campaignId: "",
  middleName: "",
  birthdate: "",
  ssn: ""
}

const CreateProfileStepper = () => {

  // LOCAL STATE
  const [activeStep, setActiveStep] = useState<number>(0)

  // HOOKS
  const router = useRouter()

  // API HOOKS
  const [createProfile, { isLoading }] = usePostProfileCreateMutation()
  const [getContacts] = useLazyPostContactSearchQuery()
  const [getCustomFields] = useLazyPostCustomFieldSearchQuery()
  const [getAddresses] = useLazyPostAddressSearchQuery()

  // FORM MANAGEMENT
  /**
   *
   * creating separate useForm states
   * allows validation at different steps
   *
   */
  const { control: personalControl, formState: { errors: personalErrors }, handleSubmit: personalSubmit, getValues, reset: personalReset } = useForm<PersonalInformationForm>({
    resolver: yupResolver(personalSchema),
    defaultValues: defaultProfile
  })
  const { setValue, control: additionalControl, formState: { errors: additionalErrors }, handleSubmit: additionalSubmit, reset: additionalReset } = useForm<AdditionalInformationForm>({
    defaultValues: additionalInfoDefault
  })

  // ASYNCHRONOUSLY FETCHES CREATE PROFILE FIELDS AND SETS THEM
  useEffect(() => {
    const fetchData = async () => {
      const { data: customFields } = await getCustomFields({});
      if (customFields) setValue('customFields', customFields);

      const { data: profileContacts } = await getContacts({});
      if (profileContacts) setValue('profileContacts', profileContacts);

      const { data: profileAddresses } = await getAddresses({});
      if (profileAddresses) setValue('profileAddresses', profileAddresses);
    };

    fetchData();
  }, [getAddresses, getContacts, getCustomFields, setValue]);

  // RESET ACTIVE STEP
  const handleReset = () => {
    setActiveStep(0)
  }

  // MOVE TO NEXT STEP
  const handleSkip = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    if (activeStep === steps.length - 1) {
      toast.success('Completed All Steps!!')
    }
  }

  // MOVE BACK A STEP
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  // HANDLE STEP AFTER PERSONAL INFORMATION
  const handleAfterPersonal = () => {
    handleSkip()
  }

  // HANDLE STEP AFTER CONTACT - SUBMISSION
  /**
   *
   * grab personal information form state
   * combine with additional information form state
   * remove empty values
   * attempt create profile api
   * reroute if success
   * move back a step if failed
   *
   */
  const handleAfterContact = async (data: AdditionalInformationForm) => {
    handleSkip()
    const personalInformation = getValues()
    const profileCreateData: ProfileCreateType = {
      ...personalInformation,

      profileContacts: data.profileContacts.
        filter(({ value }) => value)
        .map(c => ({ contactId: c.contactId, value: c.value || "" })),

      profileAddresses: data.profileAddresses.
        filter(({ addressId, address1, city, state, zipCode }) => (addressId && address1 && city && state && zipCode)).
        map(({ addressId, address1 = "", address2 = "", city = "", state = "", zipCode = "" }) => ({ addressId, address1, address2, city, state, zipCode })),

      profileCustomFields: data.customFields.
        filter(({ value }) => value).
        map(({ customFieldId, value = "" }) => ({ customFieldId, value }))
    }

    const profileId = await createProfile(profileCreateData).unwrap()

    if (typeof profileId === 'string') {
      personalReset(defaultProfile)
      additionalReset(additionalInfoDefault)
      router.push({
        pathname: `/profiles/${profileId}/debts/`
      })
      handleReset()
    } else {
      handleBack()
    }
  }

  // COMPONENTS FOR EVERY STEP
  const stepComponents = [
    <PersonalInformation key={"personal"} control={personalControl} errors={personalErrors} />,
    <AdditionalInformation key={"customField"} control={additionalControl} errors={additionalErrors} />,
    <ContactInformation key={"contact"} control={additionalControl} errors={additionalErrors} />
  ]

  // RENDERS APPROPRIATE BUTTON BASED
  const renderButton = () => {

    // CONDITIONAL ASSIGNMENT OF ONCHANGE
    let onChange;
    if (activeStep === 0) onChange = personalSubmit(handleAfterPersonal)
    if (activeStep === 1) onChange = () => handleSkip()
    if (activeStep === 2) onChange = additionalSubmit(handleAfterContact)

    // CONDITIONAL BUTTON ASSIGNMENT
    return activeStep < 3 ? (
      <Button variant='contained' onClick={onChange} sx={{ ml: 4 }}>
        {!isLoading && activeStep > 1 ? "Create Profile" : "Next"}
        {isLoading && <CircularProgress />}
      </Button>
    ) : null
  }

  return (
    <Card>
      <CardHeader title='Create New Profile' />
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep} orientation='vertical'>
            {steps.map((step, index) => {
              return (
                <Step key={index} className={clsx({ active: activeStep === index })}>
                  <StepLabel StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number'>{`0${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                  <StepContent>
                    {stepComponents[index]}
                    <Box className='button-wrapper' sx={{ mb: 6 }}>
                      {activeStep < steps.length && <Button
                        color='secondary'
                        variant='outlined'
                        onClick={handleBack}
                        disabled={activeStep === 0}
                      >
                        Back
                      </Button>}
                      {renderButton()}
                    </Box>
                  </StepContent>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
        {activeStep === steps.length && (
          <Stack sx={{ mt: 2, display: "grid", placeItems: "center" }}>
            <Typography variant='h6' sx={{ mb: 4 }}>All steps are completed!</Typography>
            <Typography sx={{ mb: 6 }}>Hold tight while you are routed to the new profile</Typography>
            <CircularProgress sx={{ mb: 6 }} color='primary' />
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}

export default CreateProfileStepper
