import { useState, ChangeEvent } from 'react'
import { SelectChangeEvent } from '@mui/material'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'

import {
  useGetProfileNotesQuery,
  usePostNoteCreateMutation,
  usePutNoteUpdateMutation,
  useDeleteNoteMutation,
  usePostEmployeeSearchQuery
} from 'src/store/api/apiHooks'

import { useAppSelector } from 'src/store/hooks'
import { selectNotesByProfileId } from 'src/store/noteSlice'
import { selectAllEmployees } from 'src/store/employeeSlice'

// ** Third Party Imports
import { useForm } from 'react-hook-form'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { NoteCreateType, NoteUpdateType } from 'src/store/api/noteApiSlice'
import { EmployeeInfoType } from 'src/store/api/employeeApiSlice'

const defaultValues = {
  content: '',
  mentionedEmails: '',
  important: '',
  targets: []
}
interface ProfileNotesProps {
  id: string
}

const ProfileNotes = ({ id }: ProfileNotesProps) => {
  const profileId = id
  const profileNotes = useAppSelector(state => selectNotesByProfileId(state, profileId))

  usePostEmployeeSearchQuery({})
  const users = useAppSelector(state => selectAllEmployees(state))

  const filteredOptions = users.filter((user: EmployeeInfoType) => user.hasAuthentication === true)
  console.log(filteredOptions)
  const employeeList = filteredOptions.map((employee: EmployeeInfoType) => ({
    label: employee.employeeAlias,
    value: employee.employeeId
  }))

  // ** Hooks

  //Form init
  const [noteTemplate, setNoteTemplate] = useState<string>('')
  const [noteType, setNoteType] = useState<string>('')

  // const [notifyUsers, setNotifyUsers] = useState<NoteType[]>([])
  const [noteEmails, setNoteEmails] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [important, setImportant] = useState<boolean>(false)

  //state
  const [selectedNote, setSelectedNote] = useState<{}>({})
  const [dialogMode, setDialogMode] = useState<string>('Create')

  let rows = []
  const { isLoading, isSuccess, isError } = useGetProfileNotesQuery(profileId)

  const dataWithIndex = profileNotes.map((obj, index) => {
    return { ...obj, id: index }
  })
  rows = dataWithIndex

  const {
    handleSubmit,
    formState: {}
  } = useForm({ defaultValues })

  const onSubmit = () => {
    return
  }

  //API CALLS
  const [triggerCreate, { isSuccess: triggerPostSuccess }] = usePostNoteCreateMutation()
  const [triggerUpdate, { isSuccess: triggerPutSuccess }] = usePutNoteUpdateMutation()
  const [triggerDelete, { isSuccess: triggerDeleteSuccess }] = useDeleteNoteMutation()

  //LOAD DATA

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.name === 'notes-email') {
      setNoteEmails(target.value)
    } else if (target.name === 'notes-message') {
      setMessage(target.value)
    }
  }

  const handleSelectChange = ({ target }: SelectChangeEvent<string>) => {
    if (target.name === 'notes-template') {
      setNoteTemplate(target.value)
    } else if (target.name === 'notes-type') {
      setNoteType(target.value)
    }
  }

  async function handleCreateClick(props: any) {
    console.log(props)
    const payload: NoteCreateType = {
      profileId,
      content: props.message,
      mentionedEmails: props.noteEmails,
      important: props.important
    }
    console.log(payload)

    const postResponse = await triggerCreate(payload).unwrap()
    console.log(postResponse)
  }

  async function handleUpdateByIdClick(props: any) {
    const payload: NoteUpdateType = {
      noteId: props.selectedNote,
      targets: props.notifyUsers,

      content: props.message,
      mentionedEmails: props.noteEmails,

      important: props.important
    }

    const putResponse = await triggerUpdate(payload).unwrap()
    console.log(putResponse)
  }

  async function handleEditButtonById(params: string) {
    const myNote = profileNotes.find(note => note.noteId == params)

    if (myNote) {
      console.log(myNote.targets)
      setNoteEmails(myNote.mentionedEmails)
      setMessage(myNote.content)
      setImportant(myNote.important)
      setSelectedNote(myNote.noteId)
      setDialogMode('Edit')
    }
  }

  async function handleDeleteButton(params: string) {
    const myNote = profileNotes.find(note => note.noteId == params)

    if (myNote) {
      const payload: string = myNote.noteId

      await triggerDelete(payload).unwrap()
    }
    console.log(triggerDeleteSuccess)
  }

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
      width: 90,
      valueGetter: (params: GridValueGetterParams) => `${params.row.type || 'null'}`
    },
    {
      field: 'content',
      headerName: 'Message',
      width: 190
    },
    {
      field: 'createdAt',
      headerName: 'created At',
      width: 150
    },
    {
      field: 'createdByName',
      headerName: 'created By Name',
      width: 150
    },
    {
      field: 'important',
      headerName: 'Important',
      width: 110
    },

    {
      field: 'Pin Note',

      width: 70,
      renderCell: params => (
        <IconButton
          size='small'
          sx={{ color: 'text.primary' }}
          value={params.row.noteId}
          onClick={() => handleEditButtonById(params.row.noteId)}
        >
          <Icon icon='mdi:pin' />
        </IconButton>
      )
    },
    {
      field: 'Delete',

      width: 70,
      renderCell: params => (
        <IconButton
          size='small'
          sx={{ color: 'text.primary' }}
          value={params.row.noteId}
          onClick={() => handleDeleteButton(params.row.noteId)}
        >
          <Icon icon='mdi:delete' />
        </IconButton>
      )
    }
  ]

  if (isError) return <div>An error occured</div>

  if (isLoading) return <div>Loading</div>

  if (isSuccess)
    return (
      <>
        <Card>
          <CardHeader title='Create Note' />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Choose..</InputLabel>
                    <Select
                      name='notes-template'
                      label='Select Template'
                      labelId='notes-template'
                      id='notes-template-select'
                      value={noteTemplate}
                      defaultValue='select-method'
                      onChange={handleSelectChange}
                    >
                      <MenuItem value='select-method' disabled>
                        Select Template
                      </MenuItem>
                      <MenuItem value='ccTemplate'>Credit Card</MenuItem>
                      <MenuItem value='addressTemplate'>Address Template</MenuItem>
                      <MenuItem value='debtTemplate'>Debt Template</MenuItem>
                      <MenuItem value='paymentTemplate'>Payment Template</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Template Type</InputLabel>
                    <Select
                      name='notes-type'
                      label='noteType'
                      labelId='notes-type'
                      id='notes-type-select'
                      value={noteType}
                      defaultValue='select-method'
                      onChange={handleSelectChange}
                      disabled={noteTemplate == ''}
                    >
                      <MenuItem value='select-method' disabled>
                        Select Template
                      </MenuItem>

                      <MenuItem value='ccTemplate'>General</MenuItem>
                      <MenuItem value='specific'>Specific</MenuItem>
                      <MenuItem value='notetype'>Note Type</MenuItem>
                      <MenuItem value='paymentType'>Payment Type</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Notify to Users</InputLabel>
                    <Select
                      name='notes-users'
                      value={''}
                      label='Notify to Users'
                      labelId='notes-users'
                      id='notes-users-select'
                      defaultValue='select-method'
                      onChange={handleSelectChange}
                      disabled={noteTemplate == ''}
                    >
                      <MenuItem value='select-method' disabled>
                        Select User
                      </MenuItem>
                      {employeeList.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name='notes-email'
                    label='CC Emails'
                    value={noteEmails ?? ''}
                    placeholder='Emails'
                    onChange={handleChange}
                    disabled={noteTemplate == ''}

                    // required={true}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    rows={6}
                    multiline
                    fullWidth
                    name='notes-message'
                    value={message}
                    label='Message'
                    placeholder='Message'
                    onChange={handleChange}
                    disabled={noteTemplate == ''}
                  />
                </Grid>

                <Grid item xs={12} textAlign={'right'}>
                  {dialogMode === 'Create' && (
                    <Button
                      size='large'
                      disabled={triggerPostSuccess}
                      variant='contained'
                      sx={{ mr: 4 }}
                      onClick={() => handleCreateClick({ message, noteType, noteTemplate, noteEmails, important })}
                    >
                      Create
                    </Button>
                  )}
                  {dialogMode === 'Edit' && (
                    <Button
                      size='large'
                      variant='contained'
                      disabled={triggerPutSuccess}
                      sx={{ mr: 4 }}
                      onClick={() =>
                        handleUpdateByIdClick({
                          message,

                          noteType,
                          noteTemplate,
                          noteEmails,
                          important,
                          selectedNote
                        })
                      }
                    >
                      Update
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        <br></br>
        <Card>
          <CardHeader title='Notes' />
          <CardContent>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid rows={rows} columns={columns} sx={{ mt: 7 }} />
            </Box>
          </CardContent>
        </Card>
      </>
    )
}

export default ProfileNotes
