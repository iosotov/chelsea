// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColumns, GridRenderCellParams } from '@mui/x-data-grid'

// ** Custom Components
// import QuickSearchToolbar from './QuickSearchToolbar'

// ** Types Imports
// import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import DateConverter from 'src/views/shared/utils/date-converter'

import { GridValueFormatterParams } from '@mui/x-data-grid'

// const escapeRegExp = (value: string) => {
//   return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
// }


const TableColumns = ({ rows }: any) => {
  // ** States

  const [pageSize, setPageSize] = useState<number>(10)


  const columns: GridColumns = [
    {
      flex: 0.25,
      minWidth: 200,
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
      minWidth: 200,
      headerName: 'Created By',
      valueFormatter: (params: GridValueFormatterParams<string>) => {
        return params.value
      }
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

    // {
    //   flex: 0.15,
    //   minWidth: 100,
    //   field: 'actions',
    //   headerName: '',
    //   sortable: false,
    //   filterable: false,
    //   disableColumnMenu: true
    // }
  ]


  // const [searchText, setSearchText] = useState<string>('')


  // setting rows in state when rows are already in global state is delaying render

  // const [filteredData, setFilteredData] = useState<any[]>([])
  // const [data] = useState<any[]>(rows)

  // const handleSearch = (searchValue: string) => {
  //   setSearchText(searchValue)
  //   const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
  //   const filteredRows = data.filter(row => {
  //     return Object.keys(row).some(field => {
  //       // @ts-ignore
  //       return searchRegex.test(String(row[field]))
  //     })
  //   })
  //   if (searchValue.length) {
  //     setFilteredData(filteredRows)
  //   } else {
  //     setFilteredData([])
  //   }
  // }

  return (
    <DataGrid
      autoHeight
      columns={columns}
      pageSize={pageSize}
      getRowId={row => row.documentId}
      rowsPerPageOptions={[10, 25, 50]}

      // components={{ Toolbar: QuickSearchToolbar }}
      rows={rows}
      onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      componentsProps={{
        baseButton: {
          variant: 'outlined'
        },

        // toolbar: {
        //   value: searchText,
        //   clearSearch: () => handleSearch(''),
        //   onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
        // }
      }}
    />
  )
}

export default TableColumns
