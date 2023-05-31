import { useState } from 'react'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'

import Box from '@mui/material/Box'

import { DataGridPro, GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid-pro'
import Typography from '@mui/material/Typography'

import Card from '@mui/material/Card'

import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// import EmailEditor from './components/email/EmailEditor'
import EmailDialog from './components/email/EmailDialog'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

//api hooks

import { useGetProfileEmailsQuery } from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { selectEmailByProfileId } from 'src/store/emailSlice'

// import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

interface ProfileEmailProps {
  id: string
}

const ProfileEmail = ({ id }: ProfileEmailProps) => {
  const profileId = id

  //Drawer Form variables

  const [formMode, setFormMode] = useState<number>(0)
  const [selectedEmail, setSelectedEmail] = useState<string[]>([])

  const profileEmail = useAppSelector(state => selectEmailByProfileId(state, profileId))

  let rows = []

  const [openAddEmail, setOpenAddEmail] = useState<boolean>(false)

  const { isLoading, isError } = useGetProfileEmailsQuery(profileId)

  //Sets DataGrid with index
  const dataWithIndex = profileEmail.map((obj, index) => {
    return { ...obj, id: index }
  })
  rows = dataWithIndex

  const handleEditEmailOpen = () => {
    setFormMode(1)
    setOpenAddEmail(true)
  }

  const handleAddEmailOpen = () => {
    setFormMode(0)
    setSelectedEmail([])
    setOpenAddEmail(true)
  }

  async function handleEditEmailChange(params: GridRenderCellParams) {
    const myEmail = profileEmail.find(email => email.emailId == params.row.emailId)
    if (myEmail) {
      handleEditEmailOpen()
    }
  }

  const renderEditEmailButton = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
    return (
      <IconButton
        size='small'
        sx={{ color: 'text.primary' }}
        value={params.row.emailId}
        onClick={() => handleEditEmailChange(params)}
      >
        <Icon icon='mdi:edit' fontSize={20} />
      </IconButton>
    )
  }

  const renderCreatedAt = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
    const formattedDateTime = new Date(params.value).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })

    return <Typography>{formattedDateTime}</Typography>
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: '', width: 50, renderCell: renderEditEmailButton },
    {
      field: 'subject',
      headerName: 'Subject',
      width: 110
    },
    {
      field: 'body',
      headerName: 'Body ',
      width: 120
    },
    {
      field: 'sentFrom',
      headerName: 'Sent From',
      width: 170
    },
    {
      field: 'sentTo',
      headerName: 'sent To',
      width: 130
    },

    {
      field: 'createdAt',
      headerName: 'Sent At',
      width: 275,
      renderCell: renderCreatedAt
    }
  ]

  if (isError) return <div>An error occured</div>

  if (isLoading) return <div>Loading</div>

  return (
    <>
      <Card>
        <CardHeader
          title='Emails'
          action={
            <Button
              size='medium'
              type='submit'
              variant='contained'
              color='secondary'
              sx={{ mb: 7, mt: 3, mr: 3 }}
              onClick={handleAddEmailOpen}
            >
              Compose Email
            </Button>
          }
        />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Box sx={{ height: 400, width: '100%' }}>
                {/* <DataGridPro rows={rows} columns={columns} sx={{ mt: 7 }}></DataGridPro> */}
                <DataGridPro
                  onRowSelectionModelChange={n => setSelectedEmail(n as string[])}
                  getRowId={r => r.emailId}
                  rows={rows}
                  columns={columns}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <EmailDialog
                formMode={formMode}
                openEmailDialog={openAddEmail}
                setOpenEmailDialog={setOpenAddEmail}
                profileId={profileId}
                selectedEmail={selectedEmail}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default ProfileEmail
