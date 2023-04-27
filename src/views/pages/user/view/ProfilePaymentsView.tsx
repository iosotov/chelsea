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
import TableSortLabel from '@mui/material/TableSortLabel'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import { useForm } from 'react-hook-form'

// ** Custom Components Imports
import SelectDate from 'src/views/shared/form-input/date-picker'
import SingleSelect from 'src/views/shared/form-input/single-select'
import TextInput from 'src/views/shared/form-input/text-input'

import Icon from 'src/@core/components/icon'
import { addWeeks, addMonths } from 'date-fns'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import { CardHeader } from '@mui/material'

import { ThemeColor } from 'src/@core/layouts/types'

import CustomChip from 'src/@core/components/mui/chip'

import { CardContentProps } from '@mui/material/CardContent'

type Order = 'asc' | 'desc'

interface Data {
  number: number
  processDate: string
  amount: number
  clearedDate: number
  status: string
  memo: string
  description: string
}

type EnrollmentModalProps = {
  open: boolean
  handleClose: () => void
  data?: any
}

const createData = (
  number: number,
  processDate: string,
  amount: number,
  clearedDate: string,
  status: string,
  memo: string,
  description: string
) => {
  return { number, processDate, amount, clearedDate, status, memo, description }
}

//styled components

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 5
}))

const CardContainer = styled(CardContent)<CardContentProps>(({ theme }) => ({
  minWidth: 300,
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: '24px'
  }
}))

const rows = [
  createData(1, '5/18/2023', 304.14, '', 'Open', '', ''),
  createData(2, '6/18/2023', 304.14, '', 'Open', '', ''),
  createData(3, '7/18/2023', 304.14, '', 'Open', '', ''),
  createData(4, '8/18/2023', 304.14, '', 'Open', '', ''),
  createData(5, '9/18/2023', 304.14, '', 'Open', '', ''),
  createData(6, '10/18/2023', 304.14, '', 'Open', '', ''),
  createData(7, '11/18/2023', 304.14, '', 'Open', '', ''),
  createData(8, '12/18/2023', 304.14, '', 'Open', '', ''),
  createData(9, '1/18/2024', 304.14, '', 'Open', '', ''),
  createData(10, '2/18/2024', 304.14, '', 'Open', '', ''),
  createData(11, '3/18/2024', 304.14, '', 'Open', '', ''),
  createData(12, '4/18/2024', 304.14, '', 'Open', '', ''),
  createData(13, '5/18/2024', 304.14, '', 'Open', '', ''),
  createData(14, '6/18/2024', 304.14, '', 'Open', '', ''),
  createData(15, '7/18/2024', 304.14, '', 'Open', '', ''),
  createData(16, '8/18/2024', 304.14, '', 'Open', '', ''),
  createData(17, '9/18/2024', 304.14, '', 'Open', '', '')
]

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
  const { numSelected } = props

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
          <Button variant='contained' size='small'>
            New Payment
          </Button>
        </Box>
      )}
      {numSelected > 0 ? (
        <>
          <Tooltip title='Add'>
            <IconButton sx={{ color: 'text.secondary' }}>
              <Icon icon='material-symbols:add' />
            </IconButton>
          </Tooltip>
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

const EnhancedTable = ({ data }) => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [order, setOrder] = useState<Order>('asc')
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [orderBy, setOrderBy] = useState<keyof Data>('number')
  const [selected, setSelected] = useState<readonly number[]>([])

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
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <EnhancedTableToolbar numSelected={selected.length} />
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
                        <TableCell component='th' align='right' id={labelId} scope='row' padding='none'>
                          {row.number}
                        </TableCell>
                        <TableCell align='right'>{row.processDate}</TableCell>
                        <TableCell align='right'>{row.amount}</TableCell>
                        <TableCell align='right'>{row.clearedDate}</TableCell>
                        <TableCell align='right'>{row.status}</TableCell>
                        <TableCell align='right'>{row.memo}</TableCell>
                        <TableCell align='right'>{row.description}</TableCell>
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
  )
}

const EnrollmentDialog = ({ open, handleClose, data }: EnrollmentModalProps) => {
  const defaultValues = {
    paymentMethod: 'ach',
    maintenanceFee: 80.0,
    gateway: 'nacha',
    planLength: 12,
    serviceFee: 35,
    firstPaymentDate: new Date(),
    recurringFrequency: 'monthly',
    recurringDate: addMonths(new Date(), 1)
  }

  const enrollmentForm = useForm({ defaultValues, data })
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = enrollmentForm

  const onSubmit = (data: any) => {
    console.log(data)
  }

  // const onRecurringChange = (select: string) {

  // }

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const paymentOptions = [
    {
      label: 'ACH',
      value: 'ach'
    },
    {
      label: 'Credit',
      value: 'credit'
    },
    {
      label: 'Debit',
      value: 'debit'
    }
  ]

  const gatewayOptions = [
    {
      label: 'Nacha',
      value: 'nacha'
    },
    {
      label: 'Seamless Chex',
      value: 'seamless'
    },
    {
      label: 'Stripe',
      value: 'stripe'
    },
    {
      label: 'Authorize Net',
      value: 'authorizenet'
    }
  ]

  const lengthOptions = [
    {
      label: '10 Payments',
      value: 10
    },
    {
      label: '12 Payments',
      value: 12
    },
    {
      label: '14 Payments',
      value: 14
    },
    {
      label: '16 Payments',
      value: 16
    },
    {
      label: '18 Payments',
      value: 18
    }
  ]

  const serviceOptions = [
    {
      label: '35%',
      value: 35
    },
    {
      label: '36%',
      value: 36
    },
    {
      label: '37%',
      value: 37
    },
    {
      label: '38%',
      value: 38
    },
    {
      label: '39%',
      value: 39
    },
    {
      label: '40%',
      value: 40
    }
  ]

  const recurringOptions = [
    {
      label: 'Weekly',
      value: 'weekly'
    },
    {
      label: 'Bi-weekly',
      value: 'biweekly'
    },
    {
      label: 'Monthly',
      value: 'monthly'
    }
  ]

  // const rows: any[] = new Array(10)

  return (
    <Dialog open={open} maxWidth='xl' fullWidth onClose={handleClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>{data ? 'Update' : 'Create New'} Enrollment Plan</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <CardContainer>
          <form>
            <Box mb={4}>
              <SingleSelect
                label='Payment Method'
                name='paymentMethod'
                errors={errors}
                required
                control={control}
                options={paymentOptions}
              />
            </Box>
            <Box mb={4}>
              <SingleSelect
                label='Gateway'
                name='gateway'
                errors={errors}
                required
                control={control}
                options={gatewayOptions}
              />
            </Box>
            <Box mb={4}>
              <SingleSelect
                label='Plan Length'
                name='planLength'
                errors={errors}
                required
                control={control}
                options={lengthOptions}
              />
            </Box>
            <Box mb={4}>
              <SingleSelect
                label='Service Fee'
                name='serviceFee'
                errors={errors}
                required
                control={control}
                options={serviceOptions}
              />
            </Box>
            <Box mb={4}>
              <TextInput
                label='Maintenance Fee'
                name='maintenanceFee'
                errors={errors}
                control={control}
                InputProps={{ readOnly: true }}
              />
            </Box>
            <Box mb={4}>
              <SelectDate
                name='firstPaymentDate'
                label='First Payment Date'
                errors={errors}
                control={control}
                required
              />
            </Box>
            <Box mb={4}>
              {' '}
              <SingleSelect
                label='Recurring Payment Frequency'
                name='recurringFrequency'
                errors={errors}
                required
                control={control}
                options={recurringOptions}
              />
            </Box>
            <Box mb={4}>
              <SelectDate
                name='recurringDate'
                label='First Recurring Date'
                errors={errors}
                control={control}
                required
              />
            </Box>
          </form>
        </CardContainer>
        <Box sx={{ width: '100%', px: { xs: '16px', md: '24px' } }}>
          <Grid container sx={{ mb: 4 }}>
            <Grid item xs={6}>
              <Typography variant='caption'>Total Enrolled Debt</Typography>
              <Typography variant='h4'>${'10000'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='caption'>Total Fees</Typography>
              <Typography variant='h4'>${'6066.00'}</Typography>
            </Grid>
          </Grid>
          <Typography variant='h5' sx={{ mb: 2 }}>
            Enrollment Plan Preview
          </Typography>
          <Table sx={{ maxHeight: '500px' }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align='left'>Process Date</TableCell>
                <TableCell align='left'>Service Fee</TableCell>
                <TableCell align='left'>Mainentance Fee</TableCell>
                <TableCell align='left'>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any, i: number) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell align='left'>{row.processDate}</TableCell>
                  <TableCell align='left'>{row.serviceFee}</TableCell>
                  <TableCell align='left'>{row.maintenanceFee}</TableCell>
                  <TableCell align='left'>{row.total}</TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 50 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
        {/* <form>
          <Grid container sx={{ my: 1 }} spacing={4}>
            <Grid item xs={12} md={4}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <SingleSelect
                    label='Payment Method'
                    name='paymentMethod'
                    errors={errors}
                    required
                    control={control}
                    options={paymentOptions}
                  />
                </Grid>
                <Grid item xs={12}>
                  <SingleSelect
                    label='Gateway'
                    name='gateway'
                    errors={errors}
                    required
                    control={control}
                    options={gatewayOptions}
                  />
                </Grid>
                <Grid item xs={12}>
                  <SingleSelect
                    label='Plan Length'
                    name='planLength'
                    errors={errors}
                    required
                    control={control}
                    options={lengthOptions}
                  />
                </Grid>
                <Grid item xs={12}>
                  <SingleSelect
                    label='Service Fee'
                    name='serviceFee'
                    errors={errors}
                    required
                    control={control}
                    options={serviceOptions}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    label='Maintenance Fee'
                    name='maintenanceFee'
                    errors={errors}
                    control={control}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <SelectDate
                    name='firstPaymentDate'
                    label='First Payment Date'
                    errors={errors}
                    control={control}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <SingleSelect
                    label='Recurring Payment Frequency'
                    name='recurringFrequency'
                    errors={errors}
                    required
                    control={control}
                    options={recurringOptions}
                  />
                </Grid>
                <Grid item xs={12}>
                  <SelectDate
                    name='recurringDate'
                    label='First Recurring Date'
                    errors={errors}
                    control={control}
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item sx={{ px: 2 }} xs={12} md={8}>
              <Grid container sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Typography variant='caption'>Total Enrolled Debt</Typography>
                  <Typography variant='h4'>${'10000'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='caption'>Total Fees</Typography>
                  <Typography variant='h4'>${'6066.00'}</Typography>
                </Grid>
              </Grid>
              <Typography variant='h5' sx={{ mb: 2 }}>
                Enrollment Plan Preview
              </Typography>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell align='left'>Process Date</TableCell>
                    <TableCell align='left'>Service Fee</TableCell>
                    <TableCell align='left'>Mainentance Fee</TableCell>
                    <TableCell align='left'>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any, i: number) => (
                    <TableRow>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell align='left'>{row.processDate}</TableCell>
                      <TableCell align='left'>{row.serviceFee}</TableCell>
                      <TableCell align='left'>{row.maintenanceFee}</TableCell>
                      <TableCell align='left'>{row.total}</TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 50 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                page={page}
                component='div'
                count={rows.length}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>
          </Grid>
        </form> */}
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant='outlined' onClick={handleSubmit(onSubmit)}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function Overview({ handleClose, data }: any) {
  const [alert, setAlert] = useState<boolean>(true)

  const AlertType = 'Paused'
  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Overview'
            action={
              <Button variant='contained' onClick={handleClose} size='small' sx={{ '& svg': { mr: 1 } }}>
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
    </>
  )
}

function PaymentMethod() {
  const addPayment = () => console.log('added')

  interface PaymentDataType {
    name: string
    cardCvc: string
    expiryDate: string
    cardNumber: string
    cardStatus?: string
    badgeColor?: ThemeColor
  }
  // const paymentData = ''
  const paymentData: PaymentDataType[] = [
    {
      cardCvc: '587',
      name: 'Tom McBride',
      expiryDate: '12/24',
      badgeColor: 'primary',
      cardStatus: 'Primary',
      cardNumber: '5577 0000 5577 9865'
    },
    {
      cardCvc: '681',
      expiryDate: '02/24',
      name: 'Mildred Wagner',
      cardNumber: '4532 3616 2070 5678'
    }
  ]

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title='Payment Methods'
          action={
            <Button variant='contained' size='small' onClick={addPayment} sx={{ '& svg': { mr: 1 } }}>
              <Icon icon='mdi:plus' fontSize='1.125rem' />
              Add Payment
            </Button>
          }
        />
        <CardContent>
          {paymentData ? (
            paymentData.map((item: PaymentDataType, index: number) => (
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
                <div>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Icon icon='material-symbols:credit-card-outline' />
                    <Typography component='h6'>Card</Typography>
                  </Box>
                  <Box sx={{ mt: 1, mb: 2.5, display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                    {item.cardStatus ? (
                      <CustomChip
                        skin='light'
                        size='small'
                        sx={{ ml: 4 }}
                        label={item.cardStatus}
                        color={item.badgeColor}
                      />
                    ) : null}
                  </Box>
                  <Typography variant='body2'>
                    **** **** **** {item.cardNumber.substring(item.cardNumber.length - 4)}
                  </Typography>
                </div>

                <Box sx={{ mt: [3, 0], textAlign: ['start', 'end'] }}>
                  <Button variant='outlined' sx={{ mr: 4 }} onClick={() => handleEditCardClickOpen(index)}>
                    Edit
                  </Button>
                  <Button variant='outlined' color='secondary'>
                    Delete
                  </Button>
                  <Typography variant='caption' sx={{ mt: 4, display: 'block' }}>
                    Card expires at {item.expiryDate}
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
  )
}

export default function ProfilePayments() {
  const [data, setData] = useState({})
  const [enrollmentModal, setEnrollmentModal] = useState<boolean>(false)

  const toggleEnrollment = () => setEnrollmentModal(!enrollmentModal)

  // get payment data from redux
  // useEffect(() => {
  //   if (data) {
  //     setData(data)
  //   }
  // }, [data])

  return (
    <>
      <Grid container spacing={4}>
        <Overview handleClose={toggleEnrollment} data={data} />
        <PaymentMethod />
        <EnhancedTable data={data} />
      </Grid>
      <EnrollmentDialog open={enrollmentModal} handleClose={toggleEnrollment} data={data} />
    </>
  )
}
