import React from 'react'
import { Controller } from 'react-hook-form'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { ProfileBudget } from 'src/store/api/profileBudgetApiSlice'
import { Control, FieldValues } from 'react-hook-form'

interface Props {
  control: Control<FieldValues>
  onSubmit: () => void
  data: ProfileBudget[]
}

const IncomeTable = ({ control, data }: Props) => {
  return (
    <>
      <Card>
        <CardHeader title='Income' />
        <CardContent>
          <TableContainer>
            <form>
              <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Income Name</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.map((budget: any) => (
                    <TableRow
                      key={budget.budgetId}
                      sx={{
                        '&:last-of-type td, &:last-of-type th': {
                          border: 0
                        }
                      }}
                    >
                      <TableCell sx={{ minWidth: 450 }} component='th' scope='row'>
                        {budget.name}
                      </TableCell>
                      <TableCell align='right'>
                        <Controller
                          control={control}
                          name={`${budget.budgetId}.amount`}
                          defaultValue={budget.amount}
                          render={({ field }) => <TextField {...field} fullWidth label='Amount' />}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </form>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  )
}

export default IncomeTable
