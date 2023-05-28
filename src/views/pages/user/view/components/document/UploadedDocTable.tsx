// ** React Imports
import { useCallback, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Custom Components
// import QuickSearchToolbar from './QuickSearchToolbar'

// ** Types Imports
// import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { IconButton, Stack } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { format } from 'date-fns'
import { DataGridPro, GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro'
import { useLazyGetDocumentPreviewQuery } from 'src/store/api/apiHooks'


const UploadedDocTable = ({ rows }: any) => {

  // LOCAL STATE
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 })

  // API HOOKS
  const [previewDoc] = useLazyGetDocumentPreviewQuery()

  // HANDLE PREVIEW DOCUMENT
  const previewDocument = useCallback(async (documentId: string) => {
    const data = await previewDoc(documentId).unwrap()
    if (data) {
      const linkSource = `data:${data.contentType};base64,${data.content}`;
      const downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);

      downloadLink.href = linkSource;
      downloadLink.target = '_self';
      downloadLink.download = `${data.title}${data.fileExtension}`;
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }, [previewDoc])

  // COLUMN DEFINITIONS
  const columns: GridColDef[] = [
    {
      flex: .5,
      minWidth: 200,
      field: 'title',
      headerName: 'Document Title',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Stack>
            <Typography>{row.title}</Typography>
          </Stack>
        )
      }
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'description',
      headerName: 'Description',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Stack>
            <Typography variant='body2'>{row.description}</Typography>
          </Stack>
        )
      }
    },
    {
      flex: .5,
      field: 'createdAt',
      minWidth: 100,
      headerName: 'Created By',
      valueGetter: (params) => {
        return new Date(params.value)

      },
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Stack>
            <Typography noWrap variant='body2' sx={{ fontWeight: 600 }}>
              {row.createdByName}
            </Typography>
            <Typography noWrap variant='body2' >
              {format(new Date(row.createdAt), "MM/dd/yy")}
            </Typography>
          </Stack>
        )
      }
    },
    {
      flex: .25,
      field: 'action',
      disableReorder: true,
      minWidth: 100,
      headerName: 'Action',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex' }}>
            <IconButton color="primary" onClick={() => previewDocument(row.documentId)} >
              <DownloadIcon fontSize='large' />
            </IconButton>

          </Box>
        )
      }
    }
  ]

  return (
    <DataGridPro
      rowHeight={75}
      columns={columns}
      pagination
      paginationModel={paginationModel}
      hideFooterSelectedRowCount
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={[5, 10, 25]}
      getRowId={row => row.documentId}
      rows={rows}
      componentsProps={{
        baseButton: {
          variant: 'outlined'
        },
      }}
      initialState={{
        sorting: {
          sortModel: [{ field: 'createdAt', sort: 'desc' }]
        },
        pagination: {
          paginationModel: { pageSize: 10 }
        }
      }}
    />
  )
}

export default UploadedDocTable
