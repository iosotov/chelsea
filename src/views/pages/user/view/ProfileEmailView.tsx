import { useState, ChangeEvent } from 'react'
import { SelectChangeEvent } from '@mui/material'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { DataGridPro, GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid-pro'
import Typography from '@mui/material/Typography'

import { Focused } from 'react-credit-cards'

import DialogContent from '@mui/material/DialogContent'
import Card from '@mui/material/Card'

import Dialog from '@mui/material/Dialog'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

//api hooks

import { usePostProfileEmailMutation, useGetProfileEmailsQuery } from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { selectEmailByProfileId } from 'src/store/emailSlice'
import { EmailProfileCreateType } from 'src/store/api/emailApiSlice'

interface ProfileEmailProps {
  id: string
}

const fakeTemplate = [
  { label: 'All Tags Testing', value: 'All Tags Testing' },
  { label: 'Payment Reminder', value: 'Payment Reminder' },
  { label: 'New Login Account Created For You', value: 'New Login Account Created For You' },
  { label: 'Email Template', value: 'Email Template' }
]

const ProfileEmail = ({ id }: ProfileEmailProps) => {
  const profileId = id

  //Drawer Form variables
  const [dialogTitle, setDialogTitle] = useState<string>('Create')

  // const [group, setGroup] = useState<string>('Users')
  const [template, setTemplate] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const [body, setBody] = useState<string>('')
  const [sentTo, setSentTo] = useState<string>('')
  const [sentFrom, setSentFrom] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<string>('')
  const profileEmail = useAppSelector(state => selectEmailByProfileId(state, profileId))

  let rows = []

  const [focus, setFocus] = useState<Focused>()
  const [openAddEmail, setOpenAddEmail] = useState<boolean>(false)

  //Api INIT
  const [triggerCreate, { isSuccess: triggerSuccess }] = usePostProfileEmailMutation()

  const { isLoading, isError } = useGetProfileEmailsQuery(profileId)

  //Sets DataGrid with index
  const dataWithIndex = profileEmail.map((obj, index) => {
    return { ...obj, id: index }
  })
  rows = dataWithIndex

  //API CALLS
  async function handleCreateEmailClick() {
    const payload: EmailProfileCreateType = {
      profileId,
      subject: subject,
      body: body,
      sentFrom: sentFrom,
      sentTo: sentTo
    }
    console.log(payload)
    const createResponse = await triggerCreate(payload).unwrap()
    console.log(createResponse)
  }

  const handleEditEmailOpen = () => {
    setDialogTitle('Edit')
    setOpenAddEmail(true)
  }

  const actionChecker = () => {
    if (dialogTitle == 'Edit') {
      handleEditEmailOpen()
    } else {
      handleAddEmailOpen()
    }
  }

  const handleAddEmailOpen = () => {
    console.log('Created at', createdAt)
    setCreatedAt('')
    setSentTo('')
    setSentFrom('')
    setSubject('')
    setBody('')
    setOpenAddEmail(true)
  }

  const handleAddEmailClose = () => {
    resetForm()
    setOpenAddEmail(false)
  }

  const handleBlur = () => setFocus(undefined)

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    console.log(focus)
    if (target.name === 'email-sentTo') {
      setSentTo(target.value)
    } else if (target.name === 'email-sentFrom') {
      setSentFrom(target.value)
    } else if (target.name === 'email-subject') {
      setSubject(target.value)
    } else if (target.name === 'email-body') {
      setBody(target.value)
    }
  }

  const handleEditEmailChange = (params: GridRenderCellParams) => {
    const myEmail = profileEmail.find(email => email.emailId == params.row.emailId)
    if (myEmail) {
      setDialogTitle('Edit')
      setCreatedAt(myEmail.createdAt)
      setSentFrom(myEmail.sentFrom)
      setSubject(myEmail.subject)
      setBody(myEmail.body)
      setOpenAddEmail(true)
    }
  }

  const handleSelectChange = ({ target }: SelectChangeEvent<string>) => {
    if (target.name === 'email-template') {
      setTemplate(target.value)
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

  const resetForm = () => {
    setDialogTitle('Create')
    setTemplate('')
    setCreatedAt('')
    setSentTo('')
    setSentFrom('')
    setSubject('')
    setBody('')
  }

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
              onClick={actionChecker}

            // disabled={triggerSuccess}
            >
              Compose Email
            </Button>
          }
        />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGridPro rows={rows} columns={columns} sx={{ mt: 7 }}></DataGridPro>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Dialog
                fullWidth
                open={openAddEmail}
                maxWidth='md'
                scroll='body'
                onClose={() => handleAddEmailClose()}
                sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
              >
                <DialogContent
                  sx={{
                    position: 'relative',
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                  }}
                >
                  <form>
                    <Grid container spacing={5}>
                      <Grid item xs={12}>
                        <InputLabel>Email Template</InputLabel>
                        <Select
                          fullWidth
                          name='email-template'
                          value={template ?? ''}
                          label='Email Template'
                          defaultValue='select-method'
                          placeholder='Select Template'
                          onChange={handleSelectChange}
                          disabled={dialogTitle == 'Edit'}
                          onFocus={e => setFocus(e.target.name as Focused)}
                          inputProps={{ maxLength: 1000 }}
                          onBlur={handleBlur}
                        >
                          <MenuItem value='select-method' disabled>
                            Select Template
                          </MenuItem>
                          {fakeTemplate.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>

                        {/* <TextField
                            fullWidth
                            label='Template'
                            name='email-template'
                            placeholder='Template'
                            value={sentTo ?? ''}
                            onBlur={handleBlur}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 1000 }}
                            onFocus={e => setFocus(e.target.name as Focused)}
                            disabled={dialogTitle == 'Edit'}
                          /> */}
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <TextField
                          label='To'
                          name='email-sentTo'
                          value={sentTo ?? ''}
                          placeholder='Send To...'
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: 1000 }}
                          onFocus={e => setFocus(e.target.name as Focused)}
                          disabled={dialogTitle == 'Edit'}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label='From'
                          name='email-sentFrom'
                          value={sentFrom ?? ''}
                          placeholder='Recieve from...'
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: 1000 }}
                          onFocus={e => setFocus(e.target.name as Focused)}
                          disabled={dialogTitle == 'Edit'}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name='email-subject'
                          value={subject ?? ''}
                          label='Subject'
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: 1000 }}
                          onFocus={e => setFocus(e.target.name as Focused)}
                          disabled={dialogTitle == 'Edit'}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {/* ADD WISIWYG FEATURE */}
                        <TextField
                          fullWidth
                          name='email-body'
                          value={body ?? ''}
                          rows={6}
                          label='Body'
                          multiline
                          placeholder='Message'
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: 1000 }}
                          onFocus={e => setFocus(e.target.name as Focused)}
                          disabled={dialogTitle == 'Edit'}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {dialogTitle === 'Create' && (
                          <Button
                            type='submit'
                            disabled={triggerSuccess}
                            variant='contained'
                            sx={{ mr: 4 }}
                            onClick={handleCreateEmailClick}
                          >
                            Send Email
                          </Button>
                        )}
                        {dialogTitle === 'Create' && (
                          <Button variant='outlined' color='secondary'>
                            Discard
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </form>
                </DialogContent>
              </Dialog>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default ProfileEmail
