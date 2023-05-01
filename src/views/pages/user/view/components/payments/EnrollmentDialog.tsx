import { useState } from 'react'

import { useForm } from 'react-hook-form'

//MUI
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TablePagination from '@mui/material/TablePagination'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'

//MUI Custom Props
import { styled } from '@mui/material/styles'
import { CardContentProps } from '@mui/material/CardContent'

//Dialog Components
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

//Custom Components
import SelectDate from 'src/views/shared/form-input/date-picker'
import SingleSelect from 'src/views/shared/form-input/single-select'
import TextInput from 'src/views/shared/form-input/text-input'

//Third-Party Packages
import { addWeeks, addMonths } from 'date-fns'

//Typing
type EnrollmentModalProps = {
  open: boolean
  handleClose: () => void
  data?: any
}

//Custom Styling
const CardContainer = styled(CardContent)<CardContentProps>(({ theme }) => ({
  minWidth: 300,
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: '24px'
  }
}))

//fake data
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

const EnrollmentDialog = ({ open, handleClose, data }: EnrollmentModalProps) => {
  console.log('enrollment rendered')
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

export default EnrollmentDialog
