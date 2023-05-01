import { ChangeEvent, MouseEvent, useState, useEffect } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
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

type Order = 'asc' | 'desc'

interface Data {
  number: number
  processDate: string
  amount: number
  clearedDate: number
  status: string
  memo: string
  description: string
  paymentMethod: string
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
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
}

//styled components

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 5
}))

const createData = (
  number: number,
  processDate: string,
  amount: number,
  clearedDate: string,
  status: string,
  memo: string,
  description: string,
  paymentMethod: string
) => {
  return { number, processDate, amount, clearedDate, status, memo, description, paymentMethod }
}
const rows = [
  createData(1, '5/18/2023', 304.14, '', 'Open', '', '', 'ACH'),
  createData(2, '6/18/2023', 304.14, '', 'Open', '', '', 'ACH'),
  createData(3, '7/18/2023', 304.14, '', 'Open', '', '', 'ACH'),
  createData(4, '8/18/2023', 304.14, '', 'Open', '', '', 'ACH'),
  createData(5, '9/18/2023', 304.14, '', 'Open', '', '', 'ACH'),
  createData(6, '10/18/2023', 304.14, '', 'Open', '', '', 'ACH'),
  createData(7, '11/18/2023', 304.14, '', 'Open', '', '', 'ACH'),
  createData(8, '12/18/2023', 304.14, '', 'Open', '', '', 'ACH'),
  createData(9, '1/18/2024', 304.14, '', 'Open', '', '', 'ACH'),
  createData(10, '2/18/2024', 304.14, '', 'Open', '', '', 'ACH'),
  createData(11, '3/18/2024', 304.14, '', 'Open', '', '', 'ACH'),
  createData(12, '4/18/2024', 304.14, '', 'Open', '', '', 'ACH'),
  createData(13, '5/18/2024', 304.14, '', 'Open', '', '', 'ACH'),
  createData(14, '6/18/2024', 304.14, '', 'Open', '', '', 'ACH'),
  createData(15, '7/18/2024', 304.14, '', 'Open', '', '', 'ACH'),
  createData(16, '8/18/2024', 304.14, '', 'Open', '', '', 'ACH'),
  createData(17, '9/18/2024', 304.14, '', 'Open', '', '', 'ACH')
]

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
    id: 'number',
    numeric: true,
    disablePadding: true,
    label: '#'
  },
  {
    id: 'processDate',
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
    id: 'paymentMethod',
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
  const { numSelected, handleAdd, handleEdit } = props

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
          <Button variant='contained' size='small' onClick={handleAdd}>
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

const EnhancedTable = ({ data }: any) => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [order, setOrder] = useState<Order>('asc')
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [orderBy, setOrderBy] = useState<keyof Data>('number')
  const [selected, setSelected] = useState<readonly number[]>([])
  const [transData, setTransData] = useState(null)

  const [transDialog, setTransDialog] = useState<boolean>(false)

  const toggleDialog = () => setTransDialog(!transDialog)

  const handleAdd = () => {
    console.log(transDialog)
    setTransData(null)
    toggleDialog()
  }

  const handleEdit = () => {
    console.log('handle edit')
    setTransData({})
    // setTransData(data[index])
    toggleDialog()
  }

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.number)
      setSelected(newSelecteds)

      return
    }
    setSelected([])
  }

  const handleClick = (event: MouseEvent<unknown>, name: number) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: readonly number[] = []

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

  const isSelected = (name: number) => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <EnhancedTableToolbar numSelected={selected.length} handleAdd={handleAdd} handleEdit={handleEdit} />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
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
                      const isItemSelected = isSelected(row.number)
                      const labelId = `enhanced-table-checkbox-${index}`
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.number}
                          role='checkbox'
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                          onClick={event => handleClick(event, row.number)}
                        >
                          <TableCell padding='checkbox'>
                            <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                          </TableCell>
                          <TableCell component='th' align='center' id={labelId} scope='row' padding='none'>
                            {row.number}
                          </TableCell>
                          <TableCell align='right'>{row.processDate}</TableCell>
                          <TableCell align='right'>{row.amount}</TableCell>
                          <TableCell align='right'>{row.clearedDate}</TableCell>
                          <TableCell align='center'>{row.status}</TableCell>
                          <TableCell align='center'>{row.memo}</TableCell>
                          <TableCell align='center'>{row.description}</TableCell>
                          <TableCell align='center'>{row.paymentMethod}</TableCell>
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

function Overview({ data }: any) {
  const [alert, setAlert] = useState<boolean>(true)

  const [enrollmentModal, setEnrollmentModal] = useState<boolean>(false)
  const toggleEnrollment = () => setEnrollmentModal(!enrollmentModal)

  const AlertType = 'Paused'
  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Overview'
            action={
              <Button variant='contained' onClick={toggleEnrollment} size='small' sx={{ '& svg': { mr: 1 } }}>
                {data ? 'Update' : 'Create'} Plan
              </Button>
            }
          />
          <CardContent>
            <Grid container spacing={4} mb={2}>
              <Grid item xs={12} md={6}>
                <Typography mb={2} variant='body2'>
                  Current enrollment fee:{' '}
                  <Typography component='span' sx={{ fontWeight: 600 }}>
                    {'40.00%' ?? 'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    Enrollment Plan Duration:{' '}
                    <Typography component='span' sx={{ fontWeight: 600 }}>
                      {24 ?? 'N/A'} months
                    </Typography>
                  </Typography>
                </Typography>
                <Typography mb={2} variant='body2'>
                  Number of Enrolled Debts:{' '}
                  <Typography component='span' sx={{ fontWeight: 600 }}>
                    {5 ?? 'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    Total Enrolled Balance:{' '}
                    <Typography component='span' sx={{ fontWeight: 600 }}>
                      {'$' + 28000.0 ?? 'N/A'}
                    </Typography>
                  </Typography>
                </Typography>
                <Typography mb={2} variant='body2'>
                  Next Payment Date:{' '}
                  <Typography component='span' sx={{ fontWeight: 600 }}>
                    {'March 23, 2024' ?? 'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    Next Payment Amount:{' '}
                    <Typography component='span' sx={{ fontWeight: 600 }}>
                      {'$' + 304.14 ?? 'N/A'}
                    </Typography>
                  </Typography>
                </Typography>
                {/* <Typography variant='body1' sx={{ color: 'text.primary', fontWeight: 600 }}>
                  <Typography variant='body2'>Next Payment Date: </Typography>
                  March 23, 2024
                </Typography>
                <Typography variant='body1' sx={{ color: 'text.primary', fontWeight: 600 }}>
                  <Typography variant='body2'>Next Payment Amount: </Typography>
                  $304.14
                </Typography> */}
              </Grid>
              <Grid item xs={12} md={6}>
                {alert ? (
                  <Alert icon={false} severity='warning' sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AlertTitle>Attention!</AlertTitle>
                    </Box>
                    Payment is currently{' '}
                    <Typography component='span' sx={{ fontSize: 'inherit', color: 'inherit', fontWeight: 600 }}>
                      {AlertType}
                    </Typography>
                  </Alert>
                ) : null}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.primary' }} variant='body2'>
                      Payments
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: 'text.primary' }} variant='body2'>
                      {7 ?? 0} of {24 ?? 0}
                    </Typography>
                  </Box>
                  <BorderLinearProgress variant='determinate' value={(7 / 24) * 100 ?? 0} />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <EnrollmentDialog open={enrollmentModal} handleClose={toggleEnrollment} data={data} />
    </>
  )
}

function PaymentMethod({ data }: { data: any }) {
  const [paymentModal, setPaymentModal] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<boolean>(false)
  const [dialogData, setDialogData] = useState(data)

  type Bank = {
    bankAccountId: string | null | undefined
    bankRoutingNumber: string | null | undefined
    bankName: string | null | undefined
    bankAccountNumber: string | null | undefined
    phoneNumber: string | null | undefined
    bankAccountType: number | null | undefined
    bankAccountTypeName: string | null | undefined
    address: string | null | undefined
    address2: string | null | undefined
    city: string | null | undefined
    zipcode: string | null | undefined
    state: string | null | undefined
    accountName: string | null | undefined
    createdAt: string | null | undefined
    profileId: string | null | undefined
    firstName: string | null | undefined
    lastName: string | null | undefined
  }

  type Card = {
    creditCardId: string
    name: string
    type: number
    creditCardTypeName: string
    cardNumber: string
    expirationMonth: string
    expirationYear: string
    securityCode: string
    address: string
    address2: string
    city: string
    state: string
    zipcode: string
    profileId: string
    firstName: string
    lastName: string
    expYear: string
  }

  interface CardDataType {
    name: string
    type: number
    securityCode: string
    expirationDate: string
    cardNumber: string
    status?: string
    badgeColor?: ThemeColor
    paymentType: 'card'
    address: string
    address2?: string
    city: string
    state: string
    zipCode: string
  }
  interface BankDataType {
    bankAccountNumber: string
    bankName: string
    bankRoutingNumber: string
    bankAccountName: string
    bankAccountType: number
    status?: string
    badgeColor?: ThemeColor
    paymentType: 'ach'
    address: string
    address2?: string
    city: string
    state: string
    zipCode: string
  }
  // const paymentData = ''
  const paymentData: (CardDataType | BankDataType)[] = [
    {
      securityCode: '587',
      name: 'Tom McBride',
      type: 0,
      expirationDate: '12/24',
      badgeColor: 'primary',
      status: 'Primary',
      cardNumber: '1234 5679 1234 5678',
      paymentType: 'card',
      address: '123 Test Street',
      city: 'Test City',
      state: 'CA',
      zipCode: '12345'
    },
    {
      bankAccountNumber: '1234567890',
      bankName: 'Chase Bank',
      bankRoutingNumber: '12959102',
      bankAccountName: 'Mildred Wagner',
      bankAccountType: 1,
      paymentType: 'ach',
      status: 'Secondary',
      badgeColor: 'secondary',
      address: '234 Test Way',
      city: 'Blue City',
      state: 'WA',
      zipCode: '56789'
    }
  ]

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
              <Button variant='contained' size='small' onClick={handleAdd} sx={{ '& svg': { mr: 1 } }}>
                <Icon icon='mdi:plus' fontSize='1.125rem' />
                Add Payment Method
              </Button>
            }
          />
          <CardContent>
            {paymentData ? (
              paymentData.map((item: CardDataType | BankDataType, index: number) => (
                <Box
                  key={index}
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
                        {item.paymentType === 'card'
                          ? 'Card'
                          : `Bank - ${item.bankAccountType ? 'Checking' : 'Savings'} Account`}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1, mb: 2.5, display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 600 }}>
                        {item.paymentType === 'card' ? item.name : item.bankAccountName}
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
                      {item.paymentType === 'card' ? `Card expires at ${item.expirationDate}` : null}
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
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant='caption'>It's empty in here...</Typography>
                <Typography variant='body1'>Add a payment to start!</Typography>
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

export default function ProfilePayments({ id }: ProfileProps) {
  console.log(id)
  //Enrollment Data
  const [enrollmentData, setEnrollmentData] = useState({})
  //Payment Data
  const [paymentData, setPaymentData] = useState({})

  return (
    <>
      <Grid container spacing={4}>
        <Overview data={enrollmentData} />
        <PaymentMethod data={paymentData} />
        <EnhancedTable data={enrollmentData} />
      </Grid>
    </>
  )
}
