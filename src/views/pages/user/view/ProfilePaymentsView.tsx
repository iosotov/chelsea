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
import { useTheme } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import { useForm } from 'react-hook-form'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import SelectDate from 'src/views/shared/form-input/date-picker'
import SingleSelect from 'src/views/shared/form-input/single-select'
import TextInput from 'src/views/shared/form-input/text-input'

import Icon from 'src/@core/components/icon'
import TableBasic from 'src/views/table/mui/TableBasic'
import { borderLeftColor, borderRight } from '@mui/system'
import { addWeeks, addMonths } from 'date-fns'

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
  onRequestSort: (event: MouseEvent<unknown>, property: keyof Data) => void
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
    numeric: false,
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
    numeric: true,
    disablePadding: false,
    label: 'Memo'
  },
  {
    id: 'description',
    numeric: true,
    disablePadding: false,
    label: 'Description'
  }
]

function EnhancedTableHead(props: EnhancedTableProps) {
  // ** Props
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = (property: keyof Data) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            onChange={onSelectAllClick}
            checked={rowCount > 0 && numSelected === rowCount}
            inputProps={{ 'aria-label': 'select all debts' }}
            indeterminate={numSelected > 0 && numSelected < rowCount}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              onClick={createSortHandler(headCell.id)}
              direction={orderBy === headCell.id ? order : 'asc'}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
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
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography variant='h5'>Payments</Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton sx={{ color: 'text.secondary' }}>
            <Icon icon='mdi:delete-outline' />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  )
}

const EnhancedTable = () => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [order, setOrder] = useState<Order>('asc')
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [orderBy, setOrderBy] = useState<keyof Data>('number')
  const [selected, setSelected] = useState<readonly string[]>([])

  const handleRequestSort = (event: MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.number)
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
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 4 }}>
          <Button variant='outlined' size='small' onClick={toggleEnrollment}>
            {data ? 'Update' : 'Create'} Plan
          </Button>
          <ButtonGroup size='small'>
            <Button>Add</Button>
            <Button>Remove</Button>
          </ButtonGroup>
        </Box>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              rowCount={rows.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with: rows.slice().sort(getComparator(order, orderBy)) */}
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
                      <TableCell component='th' id={labelId} scope='row' padding='none'>
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
                    height: 52 * emptyRows
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
      <EnrollmentDialog open={enrollmentModal} handleClose={toggleEnrollment} data={data} />
    </>
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
    <Dialog open={open} maxWidth='lg' fullWidth onClose={handleClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>{data ? 'Update' : 'Create New'} Enrollment Plan</DialogTitle>
      <DialogContent>
        <form>
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
            {/* Preview Table */}
            <Grid item sx={{ px: 2 }} xs={12} md={8}>
              <Grid container sx={{ mb: 4 }} xs={12}>
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
        </form>
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

export default function ProfilePayments() {
  return (
    <>
      {/* // payment quick info */}
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant='caption'>Enrollment Fee</Typography>
              <Typography variant='h4'>40.00%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant='caption'>Total Paid</Typography>
              <Typography variant='h4'>$0.00</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant='caption'>Payments Made</Typography>
              <Typography variant='h4'>0 of 24</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <EnhancedTable />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
