import { useState } from 'react'

//MUI
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** MUI Imports
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

//MUI Grid Imports
import { DataGridPro, GridColDef, GridValueFormatterParams, GridRowSelectionModel } from '@mui/x-data-grid-pro'

//Styling
import { alpha } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

import Icon from 'src/@core/components/icon'

//API Hooks
import { useGetCreditReportsQuery, useGetProfileLiabilitiesQuery } from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { usePostProfileCreditReportMutation } from 'src/store/api/apiHooks'

//API Slices
import { selectCreditReportByProfileId } from 'src/store/creditReportSlice'
import { selectLiabilityByProfileId } from 'src/store/liabilitySlice'

//Types
import { CreditScoreCodeType } from 'src/store/api/creditReportApiSlice'
import { LiabilityType } from 'src/store/api/liabilityApiSlice'

//Utils
import MoneyConverter from 'src/views/shared/utils/money-converter'

type Props = {
  id?: string | string[]
}
interface EnhancedTableToolbarProps {
  numSelected: number
}

//Credit Score + Table Card
function CreditScore({ id }: Props) {
  const theme = useTheme()

  useGetCreditReportsQuery(String(id), { skip: !id })
  const creditReport = useAppSelector(state => selectCreditReportByProfileId(state, String(id)))
  console.log(creditReport)

  const [call, status] = usePostProfileCreditReportMutation()
  console.log(status)
  const pullReport = () => {
    call(String(id))
  }

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
              return creditReport?.creditScores[0]?.scoreValue ?? '0'
            }
          }
        }
      }
    }
  }
  return (
    <Card sx={{ p: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button disabled={creditReport?.creditScores?.length === 0}>View</Button>
        <Button onClick={pullReport}>New Report</Button>
      </Box>
      <Grid container spacing={4}>
        {creditReport?.creditScores?.length > 0 ? (
          <>
            <Grid item xs={12} lg={6}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  mb: 4
                }}
              >
                <ReactApexcharts
                  type='radialBar'
                  height={280}
                  series={[(Number(creditReport?.creditScores?.[0]?.scoreValue ?? 0) - 300) / 550]}
                  options={options}
                />
                <Typography sx={{ mt: 5, mb: 2.5 }} variant='h5'>
                  {creditReport?.creditScores?.[0]?.evaluation ?? 'Unknown'}
                </Typography>
                <Typography variant='caption'>{creditReport?.creditScores?.[0]?.scoreName ?? 'N/A'}</Typography>
              </CardContent>
            </Grid>
            <Grid item xs={12} lg={6}>
              <TableContainer sx={{ maxHeight: '250px' }} component={Paper}>
                <Table aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell align='left'>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {creditReport.creditScores?.[0]?.creditScoreCodes.map((row: CreditScoreCodeType, i: number) => (
                      <TableRow
                        key={`score-${row.scoreFactorCode}-${i}`}
                        sx={{
                          '&:last-of-type td, &:last-of-type th': {
                            border: 0
                          }
                        }}
                      >
                        <TableCell component='th' scope='row'>
                          {row.scoreFactorCode}
                        </TableCell>
                        <TableCell align='left'>{row.scoreFactorText}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', my: 12 }}>
              <Typography mb={2} variant='caption'>
                No credit report found.
              </Typography>
              <Typography variant='body2'>Please pull a report to get started.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Card>
  )
}

export default function ProfileCredit({ id }: Props) {
  //API Calls
  useGetProfileLiabilitiesQuery(String(id), { skip: !id })
  const debts = useAppSelector(state => selectLiabilityByProfileId(state, String(id)))

  //States
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <CreditScore id={id} />
        {/* Debts Info */}
        <Grid container sx={{ mb: 4 }} spacing={4}>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography variant='caption'>Enrolled Debts</Typography>
                <Typography variant='h4'>{`${debts.filter(debt => debt.enrolled === true).length} of ${
                  debts.length
                }`}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography variant='caption'>Total Enrolled Balance</Typography>
                <Typography variant='h4'>
                  {MoneyConverter(
                    debts
                      .filter(debt => debt.enrolled === true)
                      .map(debt => debt.currentBalance)
                      .reduce((prev, next) => prev + next, 0)
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Debts Table */}
        <Card>
          <CardContent>
            <DebtTable debts={debts} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  // ** Prop
  const { numSelected } = props

  return (
    <Toolbar
      sx={{
        px: theme => `${theme.spacing(5)} !important`,
        ...(numSelected > 0 && {
          bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant='h5'>Debts</Typography>
          <Button variant='contained' size='small'>
            Add Debt
          </Button>
        </Box>
      )}
      {numSelected > 0 ? (
        <Box sx={{ display: 'flex', gap: 2 }}>
          {numSelected === 1 && (
            <Tooltip title='View Debt'>
              <IconButton sx={{ color: 'text.secondary' }}>
                <Icon icon='ic:outline-remove-red-eye' />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title='Enroll Debt'>
            <IconButton sx={{ color: 'text.secondary' }}>
              <Icon icon='material-symbols:add-box-outline-rounded' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Withdraw Debt'>
            <IconButton sx={{ color: 'text.secondary' }}>
              <Icon icon='mdi:minus-box-outline' />
            </IconButton>
          </Tooltip>
        </Box>
      ) : null}
    </Toolbar>
  )
}

const DebtTable = ({ debts }: { debts: LiabilityType[] }) => {
  const [selected, setSelected] = useState<GridRowSelectionModel[]>([])

  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 })

  const [transDialog, setTransDialog] = useState<boolean>(false)

  const toggleDialog = () => setTransDialog(!transDialog)

  // const handleAdd = () => {
  //   setTransData(null)
  //   toggleDialog()
  // }

  // const handleEdit = () => {
  //   const [paymentId] = selected
  //   const [selectedPayment] = rows.filter(debt => debt.liabilityId === String(liabilityId))
  //   console.log(selectedPayment)
  //   setTransData(selectedPayment)
  //   toggleDialog()
  // }

  const columns: GridColDef[] = [
    {
      field: 'currentCreditor',
      headerName: 'Creditor',
      headerAlign: 'center',
      align: 'center',
      minWidth: 200,
      pinnable: false
    },
    {
      field: 'accountNumber',
      headerName: 'Account Number',
      headerAlign: 'center',
      align: 'center',
      minWidth: 150,
      pinnable: false
    },
    {
      field: 'currentBalance',
      headerName: 'Balance',
      headerAlign: 'center',
      align: 'right',
      minWidth: 150,
      pinnable: false,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        return MoneyConverter(params.value)
      }
    },
    {
      field: 'enrolled',
      headerName: 'Enrollment Status',
      headerAlign: 'center',
      align: 'center',
      minWidth: 150,
      pinnable: false,
      renderCell: params => {
        return (
          <CustomChip
            sx={{ width: '100%' }}
            color={params.value ? 'success' : 'error'}
            skin='light'
            label={params.value ? 'Enrolled' : 'Not Enrolled'}
          />
        )
      }
    },
    {
      field: 'currentPaymentAmount',
      headerName: 'Current Payment Amount',
      headerAlign: 'center',
      align: 'center',
      minWidth: 200,
      pinnable: false
    },
    {
      field: 'legalStatus',
      headerName: 'Legal Status',
      headerAlign: 'center',
      align: 'center',
      minWidth: 200,
      pinnable: false,
      renderCell: params => {
        return (
          <CustomChip
            sx={{ width: '100%' }}
            color={params.value ? 'success' : 'error'}
            skin='light'
            label={params.value ? 'Legal' : 'Illegal'}
          />
        )
      }
    }
  ]

  return (
    <>
      <EnhancedTableToolbar numSelected={selected.length} />
      <DataGridPro
        sx={debts?.length === 0 ? { height: '250px' } : { height: '630px' }}
        hideFooterSelectedRowCount
        getRowId={debt => debt.liabilityId}
        onRowSelectionModelChange={ids => {
          setSelected(ids)
        }}
        checkboxSelection
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25]}
        columns={columns}
        rows={debts}
        initialState={{
          sorting: {
            sortModel: [{ field: 'enrolled', sort: 'asc' }]
          },
          pagination: {
            paginationModel: { pageSize: 10 }
          }
        }}
      />
    </>
  )
}
