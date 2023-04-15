import { Button, CardContent, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import ButtonGroup from '@mui/material/ButtonGroup'

// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const createData = (name: string, description: string) => {
  return { name, description }
}

const rows = [
  createData('023', 'THE BALANCES ON YOUR ACCOUNTS ARE TOO HIGH COMPARED TO LOAN AMOUNTS'),
  createData('047', 'TOO MANY BANKCARD OR REVOLVING ACCOUNTS WITH DELINQUENT OR DEROGATORY STATUS'),
  createData('102', 'LACK OF SUFFICIENT RELEVANT FIRST MORTGAGE ACCOUNT INFORMATION'),
  createData('134', 'TOO MANY OF THE DELINQUENCIES ON YOUR ACCOUNTS ARE RECENT'),
  createData('154', 'TOO MANY OF THE DELINQUENCIES ON YOUR ACCOUNTS ARE RECENT')
]

export default function ProfileCredit() {
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      sparkline: { enabled: true }
    },
    stroke: { dashArray: 5 },
    colors: [theme.palette.primary.main],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      radialBar: {
        endAngle: 90,
        startAngle: -90,
        hollow: { size: '55%' },
        track: { background: theme.palette.customColors.trackBg },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: -5,
            fontWeight: 500,
            fontSize: '2rem',
            color: theme.palette.text.primary,
            formatter: val => {
              return '719'
            }
          }
        }
      }
    }
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        {/* Credit Report */}
        <Card sx={{ p: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button>View</Button>
            <Button>New Report</Button>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  mb: 4
                }}
              >
                <ReactApexcharts type='radialBar' height={240} series={[80]} options={options} />
                <Typography sx={{ mt: 5, mb: 2.5 }} variant='h5'>
                  VantageScore 3.0
                </Typography>
                <Typography variant='caption'>Generated: Unknown</Typography>
              </CardContent>
            </Grid>
            <Grid item xs={6}>
              <TableContainer sx={{ maxHeight: '250px' }} component={Paper}>
                <Table aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell align='left'>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow
                        key={row.name}
                        sx={{
                          '&:last-of-type td, &:last-of-type th': {
                            border: 0
                          }
                        }}
                      >
                        <TableCell component='th' scope='row'>
                          {row.name}
                        </TableCell>
                        <TableCell sx={{ overflow: 'scroll' }} align='left'>
                          {row.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Card>
        {/* Debts Info */}
        <Grid container sx={{ mb: 4 }} spacing={4}>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography variant='caption'>Enrolled Debts</Typography>
                <Typography variant='h4'>5 of 15</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography variant='caption'>Total Enrolled Balance</Typography>
                <Typography variant='h4'>$28,783.00</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Debts Table */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6'>Debts</Typography>
              <ButtonGroup size='small'>
                <Button>Add</Button>
                <Button>Enroll</Button>
                <Button>Withdraw</Button>
              </ButtonGroup>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
