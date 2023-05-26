import { useState, useEffect, useMemo } from 'react'

//MUI
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

//MUI Grid Pro
import { DataGridPro, GridColDef, GridValueFormatterParams, GridRowId } from '@mui/x-data-grid-pro'

// ** Custom Components Imports
import Icon from 'src/@core/components/icon'
import { alpha } from '@mui/material/styles'
import CustomChip from 'src/@core/components/mui/chip'
import TransactionDialog from './components/payments/TransactionDialog'

//API Hooks
import { useAppSelector } from 'src/store/hooks'
import {
  useGetBankAccountsQuery,
  useGetCreditCardsQuery,
  useGetProfileLiabilitiesQuery,
  useGetProfilePaymentsQuery
} from 'src/store/api/apiHooks'

//API Slices
import { selectEnrollmentByProfileId } from 'src/store/enrollmentSlice'
import { BankingOrCreditCardType } from 'src/store/bankAccountSlice'
import { selectPaymentByProfileId } from 'src/store/paymentSlice'
import { selectLiabilityByProfileId } from 'src/store/liabilitySlice'
import { selectPaymentsByProfileId } from 'src/store/bankAccountSlice'
import { PaymentDetailInfoModel } from 'src/store/api/enrollmentApiSlice'

//Utils
import MoneyConverter from 'src/views/shared/utils/money-converter'
import DateConverter from 'src/views/shared/utils/date-converter'

//Dynamic Imports
import dynamic from 'next/dynamic'

const PaymentDialog = dynamic(() => import('./components/payments/PaymentDialog'))
const EnrollmentDialog = dynamic(() => import('./components/payments/EnrollmentDialog'))
const EditPaymentDialog = dynamic(() => import('./components/payments/EditPaymentDialog'))

interface EnhancedTableToolbarProps {
  numSelected: number
  handleAdd: () => void
  handleEdit: () => void
  payments: number | undefined
  enrollmentId: string
}

const PaymentMethodDictionary = ['ACH', 'Credit', 'None']

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, handleAdd, handleEdit, payments, enrollmentId } = props

  return (
    <Toolbar
      sx={{
        px: theme => `${theme.spacing(5)} !important`,
        ...(numSelected > 0 && {
          bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        }),
        gap: 2
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant='h5'>Payments</Typography>
          <Button variant='contained' disabled={!(payments && enrollmentId)} size='small' onClick={handleAdd}>
            New Payment
          </Button>
        </Box>
      )}
      {numSelected > 0 ? (
        <>
          {numSelected > 1 ? null : (
            <Tooltip title='Edit'>
              <IconButton onClick={handleEdit} sx={{ color: 'text.secondary' }}>
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title='Delete'>
            <IconButton sx={{ color: 'text.secondary' }}>
              <Icon icon='mdi:delete-outline' />
            </IconButton>
          </Tooltip>
        </>
      ) : null}
    </Toolbar>
  )
}

function Overview({ enrollmentData, paymentData, id }: any) {
  const [alert, setAlert] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  const [enrollmentModal, setEnrollmentModal] = useState<boolean>(false)
  const toggleEnrollment = () => setEnrollmentModal(!enrollmentModal)

  //debts
  useGetProfileLiabilitiesQuery(id)
  const debts = useAppSelector(state => selectLiabilityByProfileId(state, id))
  const enrolledDebts = useMemo(() => debts.filter(debt => debt.enrolled === true), [debts])

  useEffect(() => {
    if ((enrollmentData && enrollmentData.enrollmentId === null) || Object.keys(paymentData).length === 0) {
      setError(true)
    } else {
      setError(false)
    }
  }, [enrollmentData, paymentData])

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Overview'
            action={
              <Button
                variant='contained'
                disabled={enrolledDebts.length === 0}
                onClick={toggleEnrollment}
                size='small'
                sx={{ '& svg': { mr: 1 } }}
              >
                {enrollmentData?.enrollmentId ? 'Update' : 'Create'} Plan
              </Button>
            }
          />
          <CardContent>
            <Grid container spacing={4} mb={2}>
              <Grid item xs={12} md={6}>
                <Box mb={2}>
                  <Typography variant='body2'>
                    Current enrollment fee:{' '}
                    <Typography component='span' sx={{ fontWeight: 600 }}>
                      {MoneyConverter(
                        (enrollmentData?.enrollmentFee * Number(enrollmentData?.enrolledBalance)) /
                          enrollmentData?.programLength
                      )}
                    </Typography>
                  </Typography>
                  <Typography variant='body2'>
                    Enrollment Plan Duration:{' '}
                    <Typography component='span' sx={{ fontWeight: 600 }}>
                      {enrollmentData?.programLength ? enrollmentData.programLength + ' months' : 'N/A'}
                    </Typography>
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant='body2'>
                    Number of Enrolled Debts:{' '}
                    <Typography component='span' sx={{ fontWeight: 600 }}>
                      {enrolledDebts.length ?? 'N/A'}
                    </Typography>
                  </Typography>
                  <Typography variant='body2'>
                    Total Enrolled Balance:{' '}
                    <Typography component='span' sx={{ fontWeight: 600 }}>
                      {MoneyConverter(enrollmentData?.enrolledBalance)}
                    </Typography>
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant='body2'>
                    Next Payment Date:{' '}
                    <Typography component='span' sx={{ fontWeight: 600 }}>
                      {DateConverter(enrollmentData?.nextPaymentDate)}
                    </Typography>
                  </Typography>
                  <Typography variant='body2'>
                    Next Payment Amount:{' '}
                    <Typography component='span' sx={{ fontWeight: 600 }}>
                      {MoneyConverter(enrollmentData?.nextPaymentAmount)}
                    </Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Collapse in={alert}>
                  <Alert
                    icon={false}
                    severity={error ? 'warning' : 'success'}
                    action={
                      <IconButton size='small' color='inherit' aria-label='close' onClick={() => setAlert(false)}>
                        <Icon icon='mdi:close' fontSize='inherit' />
                      </IconButton>
                    }
                    sx={{ mb: 4 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AlertTitle>{error ? 'Attention!' : 'No Attention Needed'}</AlertTitle>
                    </Box>
                    {error ? (
                      <>
                        {enrolledDebts.length === 0 ? (
                          <Box sx={{ display: 'flex', alignContent: 'center' }}>
                            <Icon icon='ph:dot-outline-fill' />
                            <Typography variant='body2' color='inherit'>
                              Add an enrolled debt to continue.
                            </Typography>
                          </Box>
                        ) : null}
                        {enrollmentData?.enrollmentId === null ? (
                          <Box sx={{ display: 'flex', alignContent: 'center' }}>
                            <Icon icon='ph:dot-outline-fill' />
                            <Typography variant='body2' color='inherit'>
                              Enrollment plan not found.
                            </Typography>
                          </Box>
                        ) : null}
                        {paymentData ? (
                          <Box sx={{ display: 'flex', alignContent: 'center' }}>
                            <Icon icon='ph:dot-outline-fill' />
                            <Typography variant='body2' color='inherit'>
                              Payment method missing.
                            </Typography>
                          </Box>
                        ) : null}
                        {enrollmentData?.cancelledDate || enrollmentData?.pausedDate ? (
                          <Typography variant='body2' color='inherit'>
                            Payments are currently{' '}
                            <Typography
                              component='span'
                              sx={{ fontSize: 'inherit', color: 'inherit', fontWeight: 600 }}
                            >
                              {enrollmentData.cancelledDate ? 'Cancelled' : 'Paused'}
                            </Typography>
                          </Typography>
                        ) : null}
                      </>
                    ) : (
                      'No issues with account payments.'
                    )}
                  </Alert>
                </Collapse>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.primary' }} variant='body2'>
                      Payments
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: 'text.primary' }} variant='body2'>
                      {enrollmentData?.clearedPayments ?? 0} of {enrollmentData?.totalPayments ?? 0}
                    </Typography>
                  </Box>
                  <LinearProgress
                    sx={{ height: 8, borderRadius: 5 }}
                    variant='determinate'
                    value={
                      enrollmentData?.clearedPayments && enrollmentData?.totalPayments
                        ? (enrollmentData.clearedPayments / enrollmentData.totalPayments) * 100
                        : 0
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {enrollmentModal && <EnrollmentDialog open={enrollmentModal} handleClose={toggleEnrollment} id={id} />}
    </>
  )
}

function PaymentMethod({ paymentData, enrollmentData, id }: { paymentData: any; enrollmentData: any; id: string }) {
  const [paymentModal, setPaymentModal] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<boolean>(false)
  const [dialogData, setDialogData] = useState(paymentData)

  const togglePayment = () => setPaymentModal(!paymentModal)

  const toggleEdit = () => setEditModal(!editModal)

  const handleAdd = () => {
    //set data to data recevied back from bank/card api calls
    togglePayment()
  }

  const handleEdit = (index: number) => {
    setDialogData(paymentData[index])
    toggleEdit()
  }

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Payment Methods'
            action={
              <Button
                variant='contained'
                size='small'
                disabled={!enrollmentData?.enrollmentId}
                onClick={handleAdd}
                sx={{ '& svg': { mr: 1 } }}
              >
                <Icon icon='mdi:plus' fontSize='1.125rem' />
                Add Payment Method
              </Button>
            }
          />
          <CardContent>
            {paymentData?.length > 0 ? (
              paymentData.map((item: BankingOrCreditCardType, index: number) => (
                <Box
                  key={'payments ' + index}
                  sx={{
                    p: 5,
                    display: 'flex',
                    borderRadius: 1,
                    flexDirection: ['column', 'row'],
                    justifyContent: ['space-between'],
                    alignItems: ['flex-start', 'center'],
                    mb: index !== paymentData.length - 1 ? 4 : undefined,
                    border: theme => `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Icon
                        icon={item.paymentType === 'card' ? 'material-symbols:credit-card-outline' : 'mdi:bank-outline'}
                      />
                      <Typography component='h6'>
                        {item.paymentType === 'card' ? 'Card' : `${item.bankName} - ${item.bankAccountTypeName}`}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1, mb: 2.5, display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 600 }}>
                        {item.paymentType === 'card' ? item.name : item.accountName}
                      </Typography>
                      {/* {item.status ? (
                        <CustomChip
                          skin='light'
                          size='small'
                          sx={{ ml: 4 }}
                          label={item.status}
                          color={item.badgeColor}
                        />
                      ) : null} */}
                    </Box>
                    <Typography variant='body2'>
                      {item.cardNumber && '**** **** **** ' + item.cardNumber.substring(item.cardNumber.length - 4)}
                      {item.bankAccountNumber &&
                        '**********' + item.bankAccountNumber.substring(item.bankAccountNumber.length - 4)}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: [3, 0], textAlign: ['start', 'end'] }}>
                    <Button variant='outlined' sx={{ mr: 4 }} onClick={() => handleEdit(index)}>
                      Edit
                    </Button>
                    <Button variant='outlined' color='secondary'>
                      Delete
                    </Button>
                    <Typography variant='caption' sx={{ mt: 4, display: 'block' }}>
                      {item.paymentType === 'card' && `Card expires at ${item.expirationMonth}/${item.expirationYear}`}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  py: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography variant='caption' mb={2}>
                  It's empty in here...
                </Typography>
                <Typography variant='body1'>Add a payment method to start</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      {paymentModal && (
        <PaymentDialog
          open={paymentModal}
          handleClose={togglePayment}
          paymentMethod={enrollmentData.paymentMethod}
          profileId={id}
        />
      )}
      {editModal && <EditPaymentDialog open={editModal} handleClose={toggleEdit} data={dialogData} />}
    </>
  )
}

type ProfileProps = {
  id: string
}

const EnhancedTable = ({
  id,
  enrollmentData,
  paymentData
}: {
  enrollmentData: any
  paymentData: number
  id: string
}) => {
  useGetProfilePaymentsQuery(id)
  const rows = useAppSelector(state => selectPaymentByProfileId(state, id))
  const [selected, setSelected] = useState<GridRowId[]>([])

  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 })

  const [transData, setTransData] = useState<PaymentDetailInfoModel | null>(null)

  const [transDialog, setTransDialog] = useState<boolean>(false)

  const toggleDialog = () => setTransDialog(!transDialog)

  const handleAdd = () => {
    setTransData(null)
    toggleDialog()
  }

  const handleEdit = () => {
    const [paymentId] = selected
    const [selectedPayment] = rows.filter(payment => payment.enrollmentDetailId === String(paymentId))
    console.log(selectedPayment)
    setTransData(selectedPayment)
    toggleDialog()
  }

  type ChipColor = 'info' | 'primary' | 'success' | 'error' | 'warning'

  const chipDictionary: ChipColor[] = [
    'info',
    'primary',
    'success',
    'error',
    'warning',
    'error',
    'error',
    'error',
    'error',
    'error',
    'error'
  ]

  const columns: GridColDef[] = [
    {
      field: 'processedDate',
      headerName: 'Process Date',
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      minWidth: 175,
      valueGetter: params => {
        return new Date(params.value)
      },
      valueFormatter: (params: GridValueFormatterParams<Date>) => {
        return DateConverter(String(params.value))
      },
      pinnable: false
    },
    {
      field: 'amount',
      headerName: 'Amount',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 125,
      valueGetter: params => {
        return MoneyConverter(params.value)
      },
      pinnable: false
    },
    {
      field: 'clearedDate',
      headerName: 'Cleared Date',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      minWidth: 175,
      valueGetter: params => {
        return DateConverter(params.value)
      },
      pinnable: false
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      align: 'center',
      minWidth: 175,
      valueGetter: params => {
        return params.row.statusName
      },
      renderCell: params => {
        return (
          <CustomChip
            sx={{ width: '100%' }}
            color={chipDictionary[params.row.status]}
            skin='light'
            label={params.value}
          />
        )
      },
      pinnable: false,
      sortable: false
    },
    {
      field: 'memo',
      headerName: 'Memo',
      headerAlign: 'center',
      align: 'center',
      minWidth: 175,
      pinnable: false
    },
    {
      field: 'description',
      headerName: 'Description',
      headerAlign: 'center',
      align: 'center',
      minWidth: 175,
      pinnable: false
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment Method',
      headerAlign: 'center',
      align: 'center',
      minWidth: 225,
      pinnable: false,
      valueGetter: params => {
        return PaymentMethodDictionary[params.value]
      }
    }
  ]

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <EnhancedTableToolbar
              numSelected={selected.length}
              handleAdd={handleAdd}
              handleEdit={handleEdit}
              payments={paymentData}
              enrollmentId={enrollmentData?.enrollmentId}
            />
            <DataGridPro
              sx={rows?.length === 0 ? { height: '250px' } : { height: '630px' }}
              hideFooterSelectedRowCount
              getRowId={row => row.enrollmentDetailId}
              onRowSelectionModelChange={ids => {
                setSelected(ids)
              }}
              checkboxSelection
              pagination
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
              columns={columns}
              rows={rows}
              initialState={{
                sorting: {
                  sortModel: [{ field: 'processedDate', sort: 'asc' }]
                },
                pagination: {
                  paginationModel: { pageSize: 10 }
                }
              }}
            />
          </CardContent>
        </Card>
      </Grid>
      <TransactionDialog open={transDialog} toggle={toggleDialog} data={transData} />
    </>
  )
}

export default function ProfilePayments({ id: profileId }: ProfileProps) {
  //Enrollment Data
  const enrollmentData = useAppSelector(state => selectEnrollmentByProfileId(state, profileId))

  //Payment Data
  const { isSuccess: bankSuccess } = useGetBankAccountsQuery(profileId, { skip: !profileId })
  const { isSuccess: cardSuccess, isUninitialized, isLoading } = useGetCreditCardsQuery(profileId, { skip: !profileId })

  const paymentData = useAppSelector(state => selectPaymentsByProfileId(state, String(profileId)))

  console.log('rerendering payments page', { paymentData })

  return (
    <>
      {bankSuccess && cardSuccess && enrollmentData && (
        <Grid container spacing={4}>
          <Overview enrollmentData={enrollmentData} paymentData={paymentData} id={profileId} />
          <PaymentMethod paymentData={paymentData} enrollmentData={enrollmentData} id={profileId} />
          <EnhancedTable enrollmentData={enrollmentData} paymentData={paymentData?.length ?? 0} id={profileId} />
        </Grid>
      )}
      {(isUninitialized || isLoading) && <Typography>Loading...</Typography>}
    </>
  )
}
