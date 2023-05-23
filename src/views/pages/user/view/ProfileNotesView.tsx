// import { MouseEvent, SyntheticEvent, useState } from 'react';

// import { Ref, useState, forwardRef, ReactElement, ChangeEvent } from 'react'
import { useState, ChangeEvent } from 'react'

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

// import FormHelperText from '@mui/material/FormHelperText'
// import InputAdornment from '@mui/material/InputAdornment'

import IconButton from '@mui/material/IconButton'

import Icon from 'src/@core/components/icon'

// import Fade, { FadeProps } from '@mui/material/Fade'
// import DialogContent from '@mui/material/DialogContent'
// GridValueGetterParams
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'

// import DialogActions from '@mui/material/DialogActions'
// import FormControlLabel from '@mui/material/FormControlLabel'

import {
  // useGetNoteQuery,
  useGetProfileNotesQuery,
  usePostNoteCreateMutation,
  usePutNoteUpdateMutation,

  // useDeleteNoteMutation,
  usePostEmployeeSearchQuery
} from 'src/store/api/apiHooks'

import { useAppSelector } from 'src/store/hooks'
import { selectNotesByProfileId } from 'src/store/noteSlice'
import { selectAllEmployees } from 'src/store/employeeSlice'

// ** Third Party Imports
import { useForm } from 'react-hook-form'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

const defaultValues = {
  companyName: '',
  billingEmail: ''
}

const ProfileNotes = ({ id }: any) => {
  //mock Data

  const profileId = id
  const profileNotes = useAppSelector(state => selectNotesByProfileId(state, profileId))

  usePostEmployeeSearchQuery({})
  const users = useAppSelector(state => selectAllEmployees(state))

  const filteredOptions = users.filter((user: any) => user.hasAuthentication === true)
  const employeeList = filteredOptions.map((employee: any) => ({
    label: employee.employeeAlias,
    value: employee.employeeId
  }))
  const dropDataSource = employeeList

  // ** Hooks

  //Form init
  const [noteTemplate, setNoteTemplate] = useState<string>('')
  const [noteType, setNoteType] = useState<string>('')
  const [notifyUsers, setNotifyUsers] = useState<string>('')
  const [noteEmails, setNoteEmails] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [important, setImportant] = useState<boolean>(false)

  //state
  const [selectedNote, setSelectedNote] = useState<any>(null)
  const [dialogMode, setDialogMode] = useState<any>('Create')

  //hooks for loading dropdown lists
  const [templateDrop, setTemplateDrop] = useState<any>(dropDataSource)

  let rows = []
  const { isLoading, isSuccess, isError } = useGetProfileNotesQuery(profileId)
  console.log(isLoading, isSuccess, isError)

  const dataWithIndex = profileNotes.map((obj, index) => {
    return { ...obj, id: index }
  })
  rows = dataWithIndex

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = () => {
    return
  }

  //API CALLS
  const [triggerCreate, { isSuccess: triggerPostSuccess }] = usePostNoteCreateMutation()
  const [triggerUpdate, { isSuccess: triggerPutSuccess }] = usePutNoteUpdateMutation()

  //LOAD DATA

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.name === 'notes-template') {
      // target.value = formatCreditCardNumber(target.value, Payment)

      setNoteTemplate(target.value)
    } else if (target.name === 'notes-type') {
      // target.value = formatExpirationDate(target.value)
      setNoteType(target.value)
    } else if (target.name === 'notes-email') {
      // target.value = formatExpirationDate(target.value)
      setNoteEmails(target.value)
    } else if (target.name === 'notes-users') {
      // target.value = formatExpirationDate(target.value)
      setNotifyUsers(target.value)
    } else if (target.name === 'notes-message') {
      // target.value = formatExpirationDate(target.value)
      setMessage(target.value)

      // else if (target.name === 'task-paymentDate') {

      //   setPaymentDate(target.value)
      // }
    }

    // else if (target.name === 'notes-important') {
    //   // target.value = formatExpirationDate(target.value)
    //   setMessage(target.value)
    //   console.log('same users')

    //   // else if (target.name === 'task-paymentDate') {

    //   //   setPaymentDate(target.value)
    //   // }
    // }
  }

  const resetForm = () => {
    setNoteTemplate('')
    setNoteType('')
    setNoteEmails('')
    setNotifyUsers('')
    setMessage('')
    setDialogMode('Create')
  }

  //api calls\
  //need to send id

  async function handleCreateClick(props: any) {
    console.log(props)
    const payload = {
      profileId,
      content: props.message,
      mentionedEmails: props.noteEmails,
      important: props.important
    }
    console.log(payload)

    // const testData = {
    //   profileId,
    //   taskName: taskName,
    //   dueDate: paymentDate,
    //   assignedTo: 'b12557c2-3a35-4ce6-9e52-959c07e13ce5',
    //   assignType: 2,
    //   notes: note
    // }

    const postResponse = await triggerCreate(payload).unwrap()
    console.log(postResponse)
  }

  // async function handleUpdateClick(props) {
  //   console.log(props)
  //   const payload = {
  //     // noteId: props.noteId,
  //     profileId,
  //     content: props.content,
  //     mentionedEmails: props.noteEmails,
  //     important: props.important
  //   }
  //   console.log(payload)

  //   // const testData = {
  //   //   profileId,
  //   //   taskName: taskName,
  //   //   dueDate: paymentDate,
  //   //   assignedTo: 'b12557c2-3a35-4ce6-9e52-959c07e13ce5',
  //   //   assignType: 2,
  //   //   notes: note
  //   // }

  //   // const postResponse = await triggerCreate(payload).unwrap()
  //   // console.log(postResponse)
  // }

  async function handleUpdateByIdClick(props: any) {
    //do pinning check if important, then pin if not remove
    //delete removes important
    const payload = {
      noteId: props.selectedNote,
      targets: props.notifyUsers,

      // profileId,
      content: props.message,
      mentionedEmails: props.noteEmails,

      important: props.important

      // important: true
    }

    const putResponse = await triggerUpdate(payload).unwrap()
    console.log(putResponse)
  }

  async function handleEditButtonById(params: any) {
    console.log(params)

    //ONLY USE FOR UPDATING IMPORTANT MIGHT CHANGE LATER
    //SET FIELDS TO UPDATED AND MAKE DISABLED BUT SHOW PIN OR NOT
    //SEND SAME PAYLOAD BUT CHANGE IMPORTANT TAG
    //check if params, to know edit/create, conditional api call and  button rendering
    //set update or edit to know which button to create
    const myNote = profileNotes.find(note => note.noteId == params)
    console.log(myNote)
    console.log(myNote.targets)
    if (myNote) {
      setNoteEmails(myNote.mentionedEmails)

      // setTemplate()
      setNotifyUsers(myNote.targets)

      // setCreatedAt(myNote.createdAt)
      setMessage(myNote.content)
      setImportant(myNote.important)
      setSelectedNote(myNote.noteId)
      setDialogMode('Edit')
    }

    // handleUpdateByIdClick(myNote)

    // handleUpdateClick()

    // if (myNote) {
    //   setSelectedNote(myNote)
    // }
    // console.log(myNote)
    // console.log(selectedNote)
    // if (selectedNote == myNote) {
    //   console.log(selectedNote)
    //   handleUpdateById()
    // }

    // if (myNote != null) {

    //   console.log(myNote)
    //   console.log(selectedNote)
    // }

    // selectedNote

    // const notesById = useAppSelector(state => selectNoteById(state, myNote))
    // console.log(notesById)
  }

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
      width: 90,
      editable: true
    },
    {
      field: 'content',
      headerName: 'Message',
      width: 190,
      editable: true
    },
    {
      field: 'createdAt',
      headerName: 'created At',
      width: 150,
      editable: true
    },
    {
      field: 'createdByName',
      headerName: 'created By Name',
      width: 150,
      editable: true
    },
    {
      field: 'important',
      headerName: 'Important',
      width: 110,
      editable: true
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
          onClick={() => handleEditButtonById(params.row.noteId)}
        >
          <Icon icon='mdi:delete' />
        </IconButton>
      )
    }
  ]

  return (
    <>
      <Card>
        <CardHeader title='Create Note' />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='payment-method'>Choose..</InputLabel>
                  <Select
                    name='notes-template'
                    label='Select Template'
                    labelId='notes-template'
                    id='notes-template-select'
                    value={noteTemplate}
                    defaultValue='select-method'
                    onSelect={handleChange}
                  >
                    <MenuItem value='select-method' disabled>
                      Select Template
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
                <FormControl fullWidth>
                  <InputLabel>Template Type</InputLabel>
                  <Select
                    name='notes-type'
                    label='noteType'
                    value={noteType}
                    defaultValue='select-method'
                    onSelect={handleChange}
                  >
                    <MenuItem value='select-method' disabled>
                      Select Template
                    </MenuItem>

                    <MenuItem value='ccTemplate'>CreditCard</MenuItem>
                    <MenuItem value='addressTemplate'>Address Temmp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Notify to Users</InputLabel>
                  <Select
                    name='notes-users'
                    value={notifyUsers}
                    label='Notify to Users'
                    defaultValue='select-method'
                    onSelect={handleChange}
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
                />
              </Grid>

              <Grid item xs={12} textAlign={'right'}>
                {dialogMode === 'Create' && (
                  <Button
                    size='large'
                    variant='contained'
                    sx={{ mr: 4 }}
                    onClick={() =>
                      handleCreateClick({ message, notifyUsers, noteType, noteTemplate, noteEmails, important })
                    }
                  >
                    Create
                  </Button>
                )}
                {dialogMode === 'Edit' && (
                  <Button
                    size='large'
                    variant='contained'
                    sx={{ mr: 4 }}
                    onClick={() =>
                      handleUpdateByIdClick({
                        message,
                        notifyUsers,
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
                <Button variant='outlined' color='secondary' onClick={() => resetForm()}>
                  Clear Form
                </Button>
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
