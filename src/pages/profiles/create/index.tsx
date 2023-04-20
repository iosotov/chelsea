import { useState } from 'react'

import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import DatePicker, {ReactDatePickerProps} from 'react-datepicker'
import CustomInput from 'src/views/pages/user/view/components/create/PickersComponent'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'


export default function CreateProfile() {
  const [date, setDate] = useState(null);

  return (
    <Card>
      <CardContent>
        <Typography variant='h5'>Create New Profile</Typography>
        <Divider sx={{my: 4}}></Divider>
        <form>
          <Grid container spacing={4} sx={{mb: 6}}>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel>Campaign</InputLabel>
                <Select label='Campaign' defaultValue='1'>
                  <MenuItem value='1'>Select One</MenuItem>
                  <MenuItem value='2'>Test One</MenuItem>
                  <MenuItem value='3'>Test Two</MenuItem>
                  <MenuItem value='4'>Test Three</MenuItem>
                  <MenuItem value='5'>Test Four</MenuItem>
                  <MenuItem value='6'>Test Five</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={0} md={6} lg={8}>

            </Grid>
            <Grid item xs={12}>
            <Typography variant='h6'>Personal Information</Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <TextField label='First Name' />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <TextField label='Last Name' />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <TextField label='Middle Name' />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                  <DatePicker
                    selected={date}
                    id='birthdate'
                    onChange={(date: Date) => setDate(date)}
                    isClearable
                    customInput={<CustomInput label='Birthdate' />}
                  />
                </DatePickerWrapper>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <TextField label='SSN' />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select label='Gender' defaultValue='default-value'>
                  <MenuItem value='default-value'>Select Gender</MenuItem>
                  <MenuItem value={0}>Male</MenuItem>
                  <MenuItem value={1}>Female</MenuItem>
                  <MenuItem value={2}>Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>Contact Information</Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <TextField label='Primary Phone Number' placeholder='(123) 456-7890' />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <TextField label='Secondary Phone Number' placeholder='(123) 456-7890' />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <TextField label='Email Address' placeholder='example@sample.com' />
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl fullWidth>
                <TextField label='Address' />
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl fullWidth>
                <TextField label='Address 2' />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <TextField label='City'/>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
              <InputLabel>State</InputLabel>
                <Select label='State' defaultValue='default-value'>
                  <MenuItem value='default-value'>Select State</MenuItem>
                  <MenuItem value='CA'>California</MenuItem>
                  <MenuItem value='TX'>Texas</MenuItem>
                  <MenuItem value='FA'>Florida</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <TextField label='Zipcode' />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>

            </Grid>
            <Grid item xs={12}>
              <Typography variant='h5'>Additional Information</Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <TextField label='Authorized First Name' />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <TextField label='Authorized Last Name' />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <TextField label='Authorized Phone Number' />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <TextField label='Authorized Email' />
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button color='primary' variant='outlined'>Save Profile</Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}
