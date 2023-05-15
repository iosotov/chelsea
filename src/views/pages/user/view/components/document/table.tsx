// ** React Imports
import { ChangeEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColumns, GridRenderCellParams } from '@mui/x-data-grid'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import QuickSearchToolbar from './QuickSearchToolbar'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import DateConverter from 'src/views/shared/utils/date-converter'

import { GridValueFormatterParams } from '@mui/x-data-grid'

// ** Data Import

interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  1: { title: 'current', color: 'primary' },
  2: { title: 'professional', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'resigned', color: 'warning' },
  5: { title: 'applied', color: 'info' }
}

const escapeRegExp = (value: string) => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const columns: GridColumns = [
  {
    flex: 0.25,
    minWidth: 150,
    field: 'documentTitle',
    headerName: 'Document Title',
    renderCell: (params: GridRenderCellParams) => {
      const { row } = params

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {row.title}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'createdByName',
    minWidth: 100,
    headerName: 'Created By',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.createdBy}
      </Typography>
    )
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'createdAt',
    headerName: 'Created Date',
    valueFormatter: (params: GridValueFormatterParams<string>) => {
      return DateConverter(params.value)
    }
  },
  {
    minWidth: 120,
    field: 'status',
    headerName: 'Status',
    valueGetter: params => params.row.statusName,
    valueFormatter: (params: GridValueFormatterParams<string>) => {
      return params.value
    }
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'actions',
    headerName: '',
    sortable: false,
    filterable: false,
    disableColumnMenu: true
  }
]

const TableColumns = ({ rows }: any) => {
  // ** States

  const [data] = useState<any[]>(rows)
  const [pageSize, setPageSize] = useState<number>(10)
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<any[]>([])

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = data.filter(row => {
      return Object.keys(row).some(field => {
        // @ts-ignore
        return searchRegex.test(String(row[field]))
      })
    })
    if (searchValue.length) {
      setFilteredData(filteredRows)
    } else {
      setFilteredData([])
    }
  }

  return (
    <DataGrid
      autoHeight
      columns={columns}
      pageSize={pageSize}
      getRowId={row => row.documentId}
      rowsPerPageOptions={[10, 25, 50]}
      components={{ Toolbar: QuickSearchToolbar }}
      rows={filteredData.length ? filteredData : data}
      onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      componentsProps={{
        baseButton: {
          variant: 'outlined'
        },
        toolbar: {
          value: searchText,
          clearSearch: () => handleSearch(''),
          onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
        }
      }}
    />
  )
}

export default TableColumns
