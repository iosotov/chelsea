// ** React Imports

import { useState, ReactNode, useEffect } from 'react'

// ** MUI Components
// import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hook Imports
import { usePostAuthLoginMutation } from 'src/store/api/apiHooks'
import { CircularProgress } from '@mui/material'

const LoginIllustration = styled('img')(() => ({
  background: 'transparent',
  height: '100%',
  position: 'relative'
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'fixed',
  right: 0,
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('xl')]: {
    width: '100%'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required()
})

interface FormData {
  email: string
  password: string
  rememberMe?: boolean
}

const LoginPage = () => {
  // component state
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Hook
  const theme = useTheme()
  const [login, { isLoading, error }] = usePostAuthLoginMutation()

  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  // ** React Hook Forms
  const {
    control,
    setError,
    handleSubmit,
    setValue,

    formState: { errors }
  } = useForm<FormData>({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleRememberMeChange = (rememberMe: boolean) => {
    setRememberMe(rememberMe)
  }

  // Handle Submit
  const onSubmit = async (data: FormData) => {
    const { email, password } = data
    if (rememberMe) {
      localStorage.setItem('email', email)
    } else {
      localStorage.removeItem('email')
    }

    login({ username: email, password })
  }

  // * Automatically populate the email field if "Remember Me" is enabled
  useEffect(() => {
    const storedEmail = localStorage.getItem('email')
    if (storedEmail) {
      setValue('email', storedEmail)
    }
  }, [setValue])

  // Handle Remember
  const handleToggle = () => {
    const newRememberMe = !rememberMe
    setRememberMe(newRememberMe)
    handleRememberMeChange(newRememberMe)
  }

  useEffect(() => {
    const storedRememberMe = localStorage.getItem('rememberMe')
    if (storedRememberMe) {
      setRememberMe(JSON.parse(storedRememberMe))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('rememberMe', JSON.stringify(rememberMe))
  }, [rememberMe])

  // *** use setError - error will reset when user changes input values
  // useEffect sets form error when invalid credentials provided
  useEffect(() => {
    if (error && 'message' in error)
      setError('email', {
        type: 'manual',
        message: error.message
      })
  }, [error, setError])

  return (
    <Box className='content-right' sx={{ height: '100vh' }}>
      {!hidden ? (
        <Box sx={{ display: 'flex', position: 'relative', width: '100%' }}>
          <LoginIllustration alt='login-illustration' src={`/images/pages/chelsea_app_2.svg`} />
        </Box>
      ) : null}
      <Box
        sx={{
          top: 30,
          left: 40,
          display: 'flex',
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}
      >
        <img src={`/images/pages/logo.svg`} alt={themeConfig.templateName} />

        <Typography
          variant='h6'
          sx={{
            ml: 3,
            lineHeight: 1,
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '1.5rem !important'
          }}
        >
          {themeConfig.templateName}
        </Typography>
      </Box>
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <Box
          sx={{
            p: 12,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>Welcome to {themeConfig.templateName}! 👋🏻</TypographyStyled>
              <Typography variant='body2'>Please sign-in to your account</Typography>
            </Box>

            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Email'
                      id='login-email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      disabled={isLoading}
                      error={Boolean(errors.email)}
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: 'error.main', textTransform: 'capitalize' }}>
                    {errors.email.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor='login-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur } }) => (
                    <OutlinedInput
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      disabled={isLoading}
                      id='login-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main', textTransform: 'capitalize' }} id=''>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Box
                sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
              >
                <FormControlLabel
                  label='Remember Me'
                  control={<Checkbox checked={rememberMe} onChange={handleToggle} />}
                />
                {/* <LinkStyled href='/forgot-password'>Forgot Password?</LinkStyled> */}
              </Box>
              <Button disabled={isLoading} fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                {!isLoading && 'Login'}
                {isLoading && <CircularProgress sx={{ mx: 1 }} />}
              </Button>
              <Divider sx={{ my: theme => `${theme.spacing(5)} !important` }}></Divider>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
