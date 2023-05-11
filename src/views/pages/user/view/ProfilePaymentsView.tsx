import { ChangeEvent, MouseEvent, useState, useEffect } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import ButtonGroup from '@mui/material/ButtonGroup'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// ** MUI Imports
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import { visuallyHidden } from '@mui/utils'
import { alpha } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

// ** Custom Components Imports

import PaymentDialog from 'src/views/pages/user/view/components/payments/PaymentDialog'
import EnrollmentDialog from './components/payments/EnrollmentDialog'
import EditPaymentDialog from './components/payments/EditPaymentDialog'

import Icon from 'src/@core/components/icon'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import { CardHeader } from '@mui/material'

import { ThemeColor } from 'src/@core/layouts/types'

import CustomChip from 'src/@core/components/mui/chip'
import TransactionDialog from './components/payments/TransactionDialog'

import { useAppSelector } from 'src/store/hooks'
import { selectEnrollmentByProfileId } from 'src/store/enrollmentSlice'
import { EnrollmentInfoModel, EnrollmentListItemModel } from 'src/store/api/enrollmentApiSlice'
import { selectAllBankAccounts, selectBankAccountsByProfileId } from 'src/store/bankAccountSlice'
import { selectAllCreditCards, selectCreditCardsByProfileId } from 'src/store/creditCardSlice'
import { selectPaymentByProfileId } from 'src/store/paymentSlice'
import {
  useGetBankAccountsQuery,
  useGetCreditCardsQuery,
  useGetProfileLiabilitiesQuery,
  useGetProfilePaymentsQuery
} from 'src/store/api/apiHooks'
import { BankAccountType } from 'src/store/api/bankAccountApiSlice'
import { CreditCardType } from 'src/store/api/creditCardApiSlice'
import { selectLiabilityByProfileId } from 'src/store/liabilitySlice'

import MoneyConverter from 'src/views/shared/utils/money-converter'
import DateConverter from 'src/views/shared/utils/date-converter'

import { PaymentDetailInfoModel } from 'src/store/api/enrollmentApiSlice'

//test
import { DataGridPro, GridColDef, GridValueFormatterParams, GridRowSelectionModel } from '@mui/x-data-grid-pro'

//Table Types
type Order = 'asc' | 'desc'

interface TableData {
  processedDate: string
  amount: number
  clearedDate: number
  status: string
  memo: string
  description: string
  paymentTypeName: string
}

interface HeadCell {
  disablePadding: boolean
  id: keyof TableData
  label: string
  numeric: boolean
}

interface EnhancedTableProps {
  numSelected: number
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

interface EnhancedTableToolbarProps {
  numSelected: number
  handleAdd: () => void
  handleEdit: () => void
  payments: number | undefined
  enrollmentId: string
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }

  return 0
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order

    return a[1] - b[1]
  })

  return stabilizedThis.map(el => el[0])
}

const headCells: readonly HeadCell[] = [
  {
    id: 'processedDate',
    numeric: true,
    disablePadding: false,
    label: 'Process Date'
  },
  {
    id: 'amount',
    numeric: true,
    disablePadding: false,
    label: 'Amount'
  },
  {
    id: 'clearedDate',
    numeric: true,
    disablePadding: false,
    label: 'Cleared Date'
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'memo',
    numeric: false,
    disablePadding: false,
    label: 'Memo'
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Description'
  },
  {
    id: 'paymentTypeName',
    numeric: false,
    disablePadding: false,
    label: 'Payment Method'
  }
]

function EnhancedTableHead(props: EnhancedTableProps) {
  // ** Props
  const { onSelectAllClick, order, orderBy, numSelected, rowCount } = props

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            onChange={onSelectAllClick}
            checked={rowCount > 0 && numSelected === rowCount}
            inputProps={{ 'aria-label': 'select all payments' }}
            indeterminate={numSelected > 0 && numSelected < rowCount}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
            {orderBy === headCell.id ? (
              <Box component='span' sx={visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </Box>
            ) : null}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  // ** Prop
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

const EnhancedTable = ({
  enrollmentData,
  paymentData,
  id
}: {
  enrollmentData: any
  paymentData: number
  id: string
}) => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [order, setOrder] = useState<Order>('asc')
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [orderBy, setOrderBy] = useState<keyof PaymentDetailInfoModel>('processedDate')
  const [selected, setSelected] = useState<readonly string[]>([])
  const [transData, setTransData] = useState(null)

  const [transDialog, setTransDialog] = useState<boolean>(false)

  const toggleDialog = () => setTransDialog(!transDialog)

  const { isLoading } = useGetProfilePaymentsQuery(id)

  const rows = useAppSelector(state => selectPaymentByProfileId(state, id))
  console.log({ isLoading, rows })

  const handleAdd = () => {
    setTransData(null)
    toggleDialog()
  }

  const handleEdit = () => {
    setTransData({})
    // setTransData(data[index])
    toggleDialog()
  }

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.enrollmentDetailId)
      setSelected(newSelecteds)

      return
    }
    setSelected([])
  }

  const handleClick = (event: MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

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
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 750 }} aria-labelledby='paymentsTable'>
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={rows.length}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.enrollmentDetailId)
                      const labelId = `enhanced-table-checkbox-${index}`
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.enrollmentDetailId}
                          role='checkbox'
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                          onClick={event => handleClick(event, row.enrollmentDetailId)}
                        >
                          <TableCell padding='checkbox'>
                            <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                          </TableCell>
                          <TableCell align='right'>{DateConverter(row.processedDate)}</TableCell>
                          <TableCell align='right'>{MoneyConverter(row.amount)}</TableCell>
                          <TableCell align='right'>{DateConverter(row.clearedDate)}</TableCell>
                          <TableCell align='center'>{row.status}</TableCell>
                          <TableCell align='center'>{row.memo}</TableCell>
                          <TableCell align='center'>{row.description}</TableCell>
                          <TableCell align='center'>{row.paymentTypeName}</TableCell>
                        </TableRow>
                      )
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      sx={{
                        height: 50 * emptyRows
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {rows.length === 0 && !isLoading && (
              <Box
                sx={{
                  py: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography variant='caption' mb={2}>
                  No Payments Found.
                </Typography>
                <Typography variant='body1'>Create an enrollment plan</Typography>
              </Box>
            )}
            <TablePagination
              page={page}
              component='div'
              count={rows.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        </Card>
      </Grid>
      <TransactionDialog open={transDialog} toggle={toggleDialog} data={transData} />
    </>
  )
}

function Overview({ enrollmentData, paymentData, id }: any) {
  //toggles alert
  const [alert, setAlert] = useState<boolean>(true)

  //toggles for type of alert
  const [error, setError] = useState<boolean>(false)

  useGetProfileLiabilitiesQuery(id)
  const debts = useAppSelector(state => selectLiabilityByProfileId(state, id))

  useEffect(() => {
    if ((enrollmentData && enrollmentData.enrollmentId === null) || Object.keys(paymentData).length === 0) {
      setError(true)
    } else {
      setError(false)
    }
  }, [enrollmentData, paymentData])

  console.log(paymentData)

  const [enrollmentModal, setEnrollmentModal] = useState<boolean>(false)
  const toggleEnrollment = () => setEnrollmentModal(!enrollmentModal)
  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Overview'
            action={
              <Button
                variant='contained'
                disabled={!enrollmentData?.enrollmentId}
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
                      {debts?.filter(debt => debt.enrolled).length ?? 'N/A'}
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
                        {debts?.length === 0 ? (
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
                    {/* Payment status is currently{' '}
                    <Typography component='span' sx={{ fontSize: 'inherit', color: 'inherit', fontWeight: 600 }}>
                      {AlertType}
                    </Typography> */}
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
      <EnrollmentDialog open={enrollmentModal} handleClose={toggleEnrollment} data={enrollmentData} />
    </>
  )
}

function PaymentMethod({ paymentData, enrollmentData }: { paymentData: any; enrollmentData: any }) {
  const [paymentModal, setPaymentModal] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<boolean>(false)
  const [dialogData, setDialogData] = useState(paymentData)

  console.log('rerender')

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
              paymentData.map((item: CreditCardType | BankAccountType, index: number) => (
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
                      {item.status ? (
                        <CustomChip
                          skin='light'
                          size='small'
                          sx={{ ml: 4 }}
                          label={item.status}
                          color={item.badgeColor}
                        />
                      ) : null}
                    </Box>
                    <Typography variant='body2'>
                      {item.paymentType === 'card'
                        ? '**** **** **** ' + item.cardNumber.substring(item.cardNumber.length - 4)
                        : '*********' + item.bankAccountNumber.substring(item.bankAccountNumber.length - 4)}
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
                      {item.paymentType === 'card'
                        ? `Card expires at ${item.expirationMonth}/${item.expirationYear}`
                        : null}
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
      <PaymentDialog open={paymentModal} handleClose={togglePayment} data={null} />
      <EditPaymentDialog open={editModal} handleClose={toggleEdit} data={dialogData} />
    </>
  )
}

type ProfileProps = {
  id: string
}

export default function ProfilePayments({ id: profileId }: ProfileProps) {
  //Enrollment Data
  const enrollmentData = useAppSelector(state => selectEnrollmentByProfileId(state, profileId))
  //Payment Data
  const bankData = useAppSelector(state => selectBankAccountsByProfileId(state, profileId))
  const cardData = useAppSelector(state => selectCreditCardsByProfileId(state, profileId))
  useGetBankAccountsQuery(profileId, { skip: !profileId })
  useGetCreditCardsQuery(profileId, { skip: !profileId })
  const [paymentData, setPaymentData] = useState<(BankAccountType | CreditCardType)[]>([])

  console.log('rerendering..')

  useEffect(() => {
    if (bankData && cardData) {
      setPaymentData([...bankData, ...cardData])
    }
  }, [bankData, cardData])

  return (
    <>
      <Grid container spacing={4}>
        <Overview enrollmentData={enrollmentData} paymentData={paymentData} id={profileId} />
        <PaymentMethod paymentData={paymentData} enrollmentData={enrollmentData} />
        {/* <EnhancedTable enrollmentData={enrollmentData} paymentData={paymentData?.length ?? 0} id={profileId} /> */}
        <TestTable enrollmentData={enrollmentData} paymentData={paymentData?.length ?? 0} id={profileId} />
      </Grid>
    </>
  )
}

const TestTable = ({ id, enrollmentData, paymentData }: { enrollmentData: any; paymentData: number; id: string }) => {
  useGetProfilePaymentsQuery(id)
  const rows = useAppSelector(state => selectPaymentByProfileId(state, id))
  const [selected, setSelected] = useState<GridRowSelectionModel[]>([])

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

  const chipDictionary: string[] = [
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
      field: 'paymentTypeName',
      headerName: 'Payment Type',
      headerAlign: 'center',
      align: 'center',
      minWidth: 225,
      pinnable: false
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
              hideFooterRowCount
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
