// ** React Imports
import React, { useCallback, useState } from 'react'

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
import SendIcon from '@mui/icons-material/Send'
import { format } from 'date-fns'
import { DataGridPro, GridColDef, GridColumnHeaders, GridRenderCellParams, GridRow } from '@mui/x-data-grid-pro'
import { useLazyGetDocumentPreviewQuery, useLazyGetProfileQuickSearchQuery, usePostDocumentEsignMutation } from 'src/store/api/apiHooks'
import { DocumentEsignType } from 'src/store/api/documentApiSlice'
import { toast } from 'react-hot-toast'
import { useConfirm } from 'material-ui-confirm'

interface GeneratedDocTableProps {
  rows: any
  profileId: string
}

const GeneratedDocTable = ({ rows, profileId }: GeneratedDocTableProps) => {

  // LOCAL STATE
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 })

  const [getProfile] = useLazyGetProfileQuickSearchQuery()

  // API HOOKS
  const [previewDoc] = useLazyGetDocumentPreviewQuery()

  const [sendEsign] = usePostDocumentEsignMutation()

  const confirm = useConfirm()

  // HANDLE PREVIEW DOCUMENT
  const previewDocument = useCallback(async (documentId: string) => {

    confirm({
      title: 'Confirmation',
      description: 'Are you sure you want to download document',
      confirmationText: 'Accept',
      dialogProps: { maxWidth: 'xs' }
    }).then(async () => {
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
    })
  }, [confirm, previewDoc])

  // HANDLE PREVIEW DOCUMENT
  const handleEsign = useCallback(async (documentId: string) => {
    const { data: profiles } = await getProfile(profileId)
    if (profiles?.[0]) {
      const [profile] = profiles
      const esignData: DocumentEsignType = {
        documentId: documentId,
        profileId,
        sendingMethod: 1,
        targetPhoneNumber: profile.primaryPhoneNumber,
        targetEmail: profile.primaryEmail
      }
      console.log(esignData)

      confirm({
        title: 'Confirmation',
        description: 'Are you sure you want to send document for signature',
        confirmationText: 'Accept',
        dialogProps: { maxWidth: 'xs' }
      }).then(async () => {
        const { data: success }: { data?: boolean, error?: any } = await sendEsign(esignData)
        if (success) {
          toast.success("You have successfully sent document for signature")
        }
      })
    }
  }, [confirm, getProfile, profileId, sendEsign])

  // COLUMN DEFINITIONS
  const columns: GridColDef[] = [
    {
      flex: 1.5,
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
      flex: .5,
      field: 'action',
      disableReorder: true,
      minWidth: 100,
      headerName: 'Action',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex' }}  >
            <IconButton onClick={() => previewDocument(row.documentId)}>
              <DownloadIcon color="primary" fontSize='large' />
            </IconButton>
            <IconButton onClick={() => handleEsign(row.documentId)}  >
              <SendIcon color='primary' />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  const MemoizedRow = React.memo(GridRow);
  const MemoizedColumnHeaders = React.memo(GridColumnHeaders);

  return (
    <DataGridPro
      rowHeight={75}
      slots={{
        row: MemoizedRow,
        columnHeaders: MemoizedColumnHeaders,
      }}
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

export default GeneratedDocTable
