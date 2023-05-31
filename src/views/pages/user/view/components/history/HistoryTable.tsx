import * as React from 'react'

import { DataGridPro, GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro'

import { format } from 'date-fns'
import CustomChip from 'src/@core/components/mui/chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { HistoryType } from 'src/store/api/historyApiSlice'

interface Props {
  data: HistoryType[]
}

export default function HistoryTable({ data }: Props) {
  let rows = []

  const dataWithIndex = data.map((obj: HistoryType, index: number) => {
    return { ...obj, id: index }
  })
  rows = dataWithIndex
  console.log(rows)

  const renderChip = (params: GridRenderCellParams) => {
    return <CustomChip sx={{ minWidth: 100, fontWeight: 500 }} label={params.row.name} color='info'></CustomChip>
  }

  const renderCreated = (params: GridRenderCellParams) => {
    return (
      <Stack>
        <Typography variant='body1' sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
          {params.row.employeeName}
        </Typography>
        <Typography variant='body2'>{format(new Date(params.row.modifiedDate), 'MM/dd/yyyy HH:mm:ss')}</Typography>
      </Stack>
    )
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Type', width: 150, renderCell: renderChip, disableColumnMenu: true },

    { field: 'employeeName', headerName: 'Created By', width: 200, renderCell: renderCreated, disableColumnMenu: true },
    {
      field: 'fullDescription',
      headerName: 'Description',
      type: 'number',
      width: 500
    }
  ]

  return (
    <Card>
      <CardHeader title='Activity' />
      <CardContent>
        <div style={{ height: 880, width: '100%' }}>
          <DataGridPro
            rows={rows}
            columns={columns}
            pagination
            disableColumnReorder={true}
            disableColumnSelector={true}
            disableDensitySelector={true}
            disableColumnMenu={true}
            disableColumnFilter={true}
            disableColumnResize={true}
          />
        </div>
      </CardContent>
    </Card>
  )
}
