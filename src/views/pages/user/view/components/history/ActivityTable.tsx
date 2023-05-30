import React from 'react'

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
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { format } from 'date-fns'
import CustomChip from 'src/@core/components/mui/chip'

interface Props {
  // data: ProfileBudget[]
  data: any
}

const ActivityTable = ({ data }: Props) => {
  return (
    <>
      <Card>
        <CardHeader title='Activity' />
        <CardContent>
          <TableContainer>
            <form>
              <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.map((history: any) => (
                    <TableRow
                      key={history.id}
                      sx={{
                        '&:last-of-type td, &:last-of-type th': {
                          border: 0
                        }
                      }}
                    >
                      <TableCell sx={{ minWidth: 50 }} component='th' scope='row'>
                        <CustomChip sx={{ fontWeight: 500 }} label={history.name} color='info'></CustomChip>
                      </TableCell>

                      <TableCell sx={{ minWidth: 150 }} component='th' scope='row'>
                        <Stack>
                          <Typography variant='body1' sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                            {history.employeeName}
                          </Typography>
                          <Typography variant='body2'>
                            {format(new Date(history.modifiedDate), 'MM/dd/yyyy HH:mm:ss')}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 500 }} component='th' scope='row'>
                        {history.fullDescription}
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

export default ActivityTable
