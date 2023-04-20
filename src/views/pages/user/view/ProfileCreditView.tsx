import { ChangeEvent, MouseEvent, useState } from 'react'

import { Button, CardContent, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import ButtonGroup from '@mui/material/ButtonGroup'

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

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

import Icon from 'src/@core/components/icon'

type Order = 'asc' | 'desc'

type Props = {
  id?: string | string[]
}

interface DebtData {
  creditor: string
  accountNumber: string
  balance: number
  currentPaymentAmount: number
  enrolled: string
  legalStatus: string
}

interface HeadCell {
  disablePadding: boolean
  id: keyof DebtData
  label: string
  numeric: boolean
}

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: MouseEvent<unknown>, property: keyof DebtData) => void
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

interface EnhancedTableToolbarProps {
  numSelected: number
}

const createCreditData = (name: string, description: string) => {
  return { name, description }
}

const creditRows = [
  createCreditData('023', 'THE BALANCES ON YOUR ACCOUNTS ARE TOO HIGH COMPARED TO LOAN AMOUNTS'),
  createCreditData('047', 'TOO MANY BANKCARD OR REVOLVING ACCOUNTS WITH DELINQUENT OR DEROGATORY STATUS'),
  createCreditData('102', 'LACK OF SUFFICIENT RELEVANT FIRST MORTGAGE ACCOUNT INFORMATION'),
  createCreditData('134', 'TOO MANY OF THE DELINQUENCIES ON YOUR ACCOUNTS ARE RECENT'),
  createCreditData('154', 'TOO MANY OF THE DELINQUENCIES ON YOUR ACCOUNTS ARE RECENT')
]

const createDebtData = (
  creditor: string,
  accountNumber: string,
  balance: number,
  currentPaymentAmount: number,
  enrolled: string,
  legalStatus: string
): DebtData => {
  return { creditor, accountNumber, balance, currentPaymentAmount, enrolled, legalStatus }
}

const rows = [
  createDebtData('Creditor 1', 'sample', 14234.0, 300, 'True', 'False'),
  createDebtData('Creditor 2', 'sample', 123441.0, 100, 'True', 'False'),
  createDebtData('Creditor 3', 'sample', 23423.0, 100, 'True', 'False'),
  createDebtData('Creditor 4', 'sample', 12341.0, 100, 'True', 'False'),
  createDebtData('Creditor 5', 'sample', 100.0, 5, 'True', 'False'),
  createDebtData('Creditor 6', 'sample', 200.0, 100, 'False', 'True'),
  createDebtData('Creditor 7', 'sample', 1.0, 15, 'False', 'True'),
  createDebtData('Creditor 8', 'sample', 14234.0, 100, 'False', 'True'),
  createDebtData('Creditor 9', 'sample', 14234.0, 100, 'False', 'True'),
  createDebtData('Creditor 10', 'sample', 14234.0, 100, 'False', 'False'),
  createDebtData('Creditor 11', 'sample', 14234.0, 100, 'False', 'False'),
  createDebtData('Creditor 12', 'sample', 14234.0, 100, 'False', 'False'),
  createDebtData('Creditor 13', 'sample', 14234.0, 100, 'False', 'False')
]

export default function ProfileCredit({ id }: Props) {
  const theme = useTheme()
  console.log(id)
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
                    {creditRows.map(row => (
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
                        <TableCell align='left'>
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
          <CardContent>
            <EnhancedTable />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
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
    id: 'creditor',
    numeric: false,
    disablePadding: true,
    label: 'Creditor'
  },
  {
    id: 'accountNumber',
    numeric: true,
    disablePadding: false,
    label: 'Account Number'
  },
  {
    id: 'balance',
    numeric: true,
    disablePadding: false,
    label: 'Balance'
  },
  {
    id: 'currentPaymentAmount',
    numeric: true,
    disablePadding: false,
    label: 'Current Payment'
  },
  {
    id: 'enrolled',
    numeric: true,
    disablePadding: false,
    label: 'Enrollment Status'
  },
  {
    id: 'legalStatus',
    numeric: true,
    disablePadding: false,
    label: 'Legal Status'
  }
]

function EnhancedTableHead(props: EnhancedTableProps) {
  // ** Props
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = (property: keyof DebtData) => (event: MouseEvent<unknown>) => {
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
      ) : null}
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
  const [order, setOrder] = useState<Order>('desc')
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)
  const [orderBy, setOrderBy] = useState<keyof DebtData>('enrolled')
  const [selected, setSelected] = useState<readonly string[]>([])

  const handleRequestSort = (event: MouseEvent<unknown>, property: keyof DebtData) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.creditor)
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
                const isItemSelected = isSelected(row.creditor)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.creditor}
                    role='checkbox'
                    selected={isItemSelected}
                    aria-checked={isItemSelected}
                    onClick={event => handleClick(event, row.creditor)}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                    </TableCell>
                    <TableCell component='th' id={labelId} scope='row' padding='none'>
                      {row.creditor}
                    </TableCell>
                    <TableCell align='right'>{row.accountNumber}</TableCell>
                    <TableCell align='right'>${row.balance}.00</TableCell>
                    <TableCell align='right'>${row.currentPaymentAmount}.00</TableCell>
                    <TableCell align='right'>{row.enrolled}</TableCell>
                    <TableCell align='right'>{row.legalStatus}</TableCell>
                  </TableRow>
                )
              })}
            {emptyRows > 0 && (
              <TableRow
                sx={{
                  height: 53 * emptyRows
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
      <EnhancedTableToolbar numSelected={selected.length} />
    </>
  )
}
