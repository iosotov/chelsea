// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'
import { useAppSelector } from 'src/store/hooks'
import { formatPhoneNumber } from '../../helpers'
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

// Styled Grid component
const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 13,
  bottom: 0,
  height: 200,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    height: 165,
    position: 'static'
  }
}))

const CardWelcomeBack = () => {

  const employee = useAppSelector(state => state.auth.employee)

  return (
    <Card sx={{ position: 'relative', overflow: 'visible', mt: { xs: 0, sm: 14.4, md: 0 } }}>
      <CardContent sx={{ p: theme => theme.spacing(7.25, 7.5, 7.75, 7.5) }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Typography variant='h5' sx={{ mb: 6.5, }}>
              Welcome back{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                {employee.firstName} {employee.lastName}
              </Box>
              ! 🥳
            </Typography>
            <Box display={'flex'} mb={2}>
              <PhoneIcon />
              <Typography variant='body2' sx={{ ml: 2 }}>{formatPhoneNumber(employee.primaryPhone)}</Typography>
            </Box>
            <Box display={'flex'}>
              <EmailIcon />
              <Typography variant='body2' sx={{ ml: 2 }}>{employee.primaryEmail}</Typography>
            </Box>
          </Grid>
          <StyledGrid item xs={12} sm={6}>
            <Img alt='Welcome back' src='/images/cards/pose_f9.png' />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CardWelcomeBack
