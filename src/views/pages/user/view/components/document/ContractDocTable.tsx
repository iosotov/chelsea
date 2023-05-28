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
import CustomChip from 'src/@core/components/mui/chip'

type ChipColor = "primary" | "secondary" | "info" | "info" | "success" | "error" | "error"

const chipColors: ChipColor[] = ["primary", "secondary", "info", "info", "success", "error", "error",]

const ContactDocTable = ({ rows }: any) => {

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
      flex: 1,
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
      field: 'statusName',
      flex: .25,
      headerName: 'Status',
      headerAlign: 'center',
      align: 'center',
      minWidth: 150,
      pinnable: false,
      renderCell: params => {
        const { row } = params

        return (
          <CustomChip
            sx={{ width: '100%' }}
            color={chipColors[row.status]}
            skin='light'
            label={row.statusName}
          />
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
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {row.createdByName}
            </Typography>
            <Typography noWrap variant='body2'>
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
            <IconButton color="primary" disabled onClick={() => previewDocument(row.documentId)}>
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

export default ContactDocTable
