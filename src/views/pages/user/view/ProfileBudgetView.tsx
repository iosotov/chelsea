import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import Button from '@mui/material/Button'

import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'

import { styled } from '@mui/material/styles'

import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import AlertTitle from '@mui/material/AlertTitle'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import BudgetTable from 'src/views/pages/user/view/components/budget/BudgetTable'
import ExpenseTable from 'src/views/pages/user/view/components/budget/ExpenseTable'

export default function ProfileBudget() {
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>Monthly Budget Summary</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ mt: 1, mb: 2.5, display: 'flex', alignItems: 'center', width: 1, gap: 3 }}>
            <Card sx={{ width: 1 / 3, mr: 'auto' }}>
              <CardContent>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2'>{`Enrolled Debts`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                    <Typography variant='h6'>1 of 10 Enrolled</Typography>
                    {/* <Typography variant='body2' sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    Edit Role
                  </Typography> */}
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ width: 1 / 3, mr: 'auto' }}>
              <CardContent>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2'>{`Enrolled Debts`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                    <Typography variant='h6'>1 of 10 Enrolled</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ width: 1 / 3, mr: 'auto' }}>
              <CardContent>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2'>{`Total Enrolled Balance`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                    <Typography variant='h6'>$999,999,999</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <BudgetTable></BudgetTable>
        </Grid>
        <Grid item xs={12}>
          <ExpenseTable></ExpenseTable>
        </Grid>
        <Grid item xs={12} textAlign={'right'}>
          <Button variant='outlined' color='secondary' sx={{ mr: 4 }}>
            Clear Form
          </Button>

          <Button type='submit' variant='contained'>
            Submit Budget
          </Button>
        </Grid>
      </Grid>
    </>
  )
}
