// import { MouseEvent, SyntheticEvent, useState } from 'react';

import { Ref, useState, forwardRef, ReactElement, ChangeEvent } from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'

import IconButton from '@mui/material/IconButton'

import Icon from 'src/@core/components/icon'

import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'

// import DialogActions from '@mui/material/DialogActions'
// import FormControlLabel from '@mui/material/FormControlLabel'

import {
  useGetNoteQuery,
  useGetProfileNotesQuery,
  usePostNoteCreateMutation,
  usePutNoteUpdateMutation,
  useDeleteNoteMutation
} from 'src/store/api/apiHooks'

import { useAppSelector } from 'src/store/hooks'
import { selectNotesByProfileId, selectNoteById } from 'src/store/noteSlice'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

const defaultValues = {
  companyName: '',
  billingEmail: ''
}

const ProfileNotes = ({ id }: any) => {
  //mock Data
  console.log(id)
  const profileId = id
  const profileNotes = useAppSelector(state => selectNotesByProfileId(state, profileId))

  const myNotes = [
    {
      key: 'cc',
      value: 'CreditCard'
    },
    {
      key: 'tt',
      value: 'TT'
    },
    {
      key: 'gg',
      value: 'GasdfG'
    },
    {
      key: 'hh',
      value: 'HfasdfH'
    }
  ]

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
  const [templateDrop, setTemplateDrop] = useState<any>(myNotes)

  let rows = []
  const { isLoading, isSuccess, isError } = useGetProfileNotesQuery(profileId)
  console.log(profileNotes)
  const dataWithIndex = profileNotes.map((obj, index) => {
    return { ...obj, id: index }
  })
  rows = dataWithIndex
  console.log(rows)

  // console.log(templateDrop)

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
  const loadData = () => {
    console.log(templateDrop)

    // setTemplateDrop(myNotes)

    // return <div>{templateDrop}</div>
  }

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    console.log(target.name)
    if (target.name === 'notes-template') {
      // target.value = formatCreditCardNumber(target.value, Payment)
      console.log('same name target')
      setNoteTemplate(target.value)
    } else if (target.name === 'notes-type') {
      // target.value = formatExpirationDate(target.value)
      setNoteType(target.value)
      console.log('same name note')
    } else if (target.name === 'notes-email') {
      // target.value = formatExpirationDate(target.value)
      setNoteEmails(target.value)
      console.log('same email')
    } else if (target.name === 'notes-users') {
      // target.value = formatExpirationDate(target.value)
      setNotifyUsers(target.value)
      console.log('same users')
    } else if (target.name === 'notes-message') {
      // target.value = formatExpirationDate(target.value)
      setMessage(target.value)
      console.log('same users')

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

    console.log(noteTemplate)
    console.log(noteType)
  }

  //api calls\
  //need to send id
  // const getNotes = () => {

  // }
  const createNote = props => {
    console.log(props.message, props.notifyUsers, props.noteType, props.noteTemplate, props.noteEmails)
    const payload = props
    console.log(payload)
  }

  async function handleCreateClick(props) {
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

  async function handleUpdateByIdClick(props) {
    console.log(props)

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
    console.log(payload)

    const putResponse = await triggerUpdate(payload).unwrap()
    console.log(putResponse)
  }

  async function handleEditButtonById(params) {
    console.log(params)

    //ONLY USE FOR UPDATING IMPORTANT MIGHT CHANGE LATER
    //SET FIELDS TO UPDATED AND MAKE DISABLED BUT SHOW PIN OR NOT
    //SEND SAME PAYLOAD BUT CHANGE IMPORTANT TAG
    //check if params, to know edit/create, conditional api call and  button rendering
    //set update or edit to know which button to create
    const myNote = profileNotes.find(note => note.noteId == params)
    console.log(myNote)
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
    console.log(selectedNote)

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

  //init data load, call get request for data set
  // loadData()

  // const renderEditNoteButton = params => {
  //   console.log(params)

  //   return (
  //     <>
  //       <IconButton
  //         size='small'
  //         sx={{ color: 'text.primary' }}
  //         value={params.row.noteId}
  //         onClick={handleEditButtonById(params.row.noteId)}
  //       >
  //         <Icon icon='mdi:edit' />
  //       </IconButton>
  //     </>
  //   )
  // }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
      renderCell: params => (
        <IconButton
          size='small'
          sx={{ color: 'text.primary' }}
          value={params.row.noteId}
          onClick={() => handleEditButtonById(params.row.noteId)}
        >
          <Icon icon='mdi:edit' />
        </IconButton>
      )
    },

    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   width: 90,
    //   renderCell: params => (
    //     <IconButton
    //       size='small'
    //       sx={{ color: 'text.primary' }}
    //       value={params.row.noteId}
    //       onClick={() => setSelectedNote(profileNotes.find(note => note.noteId == params.row.noteId))}
    //     >
    //       <Icon icon='mdi:edit' />
    //     </IconButton>
    //   )
    // },
    {
      field: 'content',
      headerName: 'content',
      width: 150,
      editable: true
    },
    {
      field: 'createdAt',
      headerName: 'createdAt',
      width: 150,
      editable: true
    },
    {
      field: 'createdByName',
      headerName: 'created By Name',

      // type: 'text',
      width: 110,
      editable: true
    },
    {
      field: 'important',
      headerName: 'Important',

      // type: 'text',
      width: 110,
      editable: true
    }
  ]

  return (
    <>
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
                onChange={handleChange}
              >
                {/* Load templates into dropdown */}
                <MenuItem value='select-method' disabled>
                  Select Template
                </MenuItem>

                {/* //data load for dropdown map */}
                {templateDrop.map(temp => (
                  <MenuItem key={temp.key} value={temp.value}>
                    {temp.value}
                  </MenuItem>
                ))}
                {/* <MenuItem value='cc'>Credit Card Template</MenuItem>
                <MenuItem value='test'>Test Template</MenuItem>
                <MenuItem value='Credit'>Test 2</MenuItem>
                <MenuItem value='Debit'>Debit</MenuItem>
                <MenuItem value='Paypal'>Paypal</MenuItem> */}
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
                onChange={handleChange}
              >
                {/* map through notes list and append to drop down */}
                <MenuItem value='select-method' disabled>
                  Select Template
                </MenuItem>
                {/* <MenuItem value={noteType}>{noteType}</MenuItem> */}
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
                onChange={handleChange}
              >
                <MenuItem value='select-method' disabled>
                  Select User
                </MenuItem>
                <MenuItem value='australia'>User1</MenuItem>
                <MenuItem value='canada'>Joe TEst</MenuItem>
                <MenuItem value='france'>Admin</MenuItem>
                <MenuItem value='united-kingdom'>United Kingdom</MenuItem>
                <MenuItem value='united-states'>United States</MenuItem>
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
            {/* {dialogMode === 'Create' ?? (
              <Button
                type='submit'
                variant='contained'
                sx={{ mr: 4 }}
                onClick={() =>
                  handleCreateClick({ message, notifyUsers, noteType, noteTemplate, noteEmails, important })
                }

                //remove payload,
              >
                {dialogMode} Note
              </Button>
            )}
            {dialogMode === 'Edit' ?? (
              <Button
                type='submit'
                variant='contained'
                sx={{ mr: 4 }}
                onClick={() =>
                  handleUpdateByIdClick({ message, notifyUsers, noteType, noteTemplate, noteEmails, important })
                }

                //remove payload,
              >
                {dialogMode} Note
              </Button>
            )} */}

            {/* <Button
              type='submit'
              variant='contained'
              sx={{ mr: 4 }}
              onClick={() => handleCreateClick({ message, notifyUsers, noteType, noteTemplate, noteEmails, important })}

              //remove payload,
            >
              {dialogMode} Note
            </Button> */}
            <Button variant='outlined' color='secondary' onClick={() => resetForm()}>
              Clear Form
            </Button>
          </Grid>
        </Grid>
      </form>

      <br></br>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} sx={{ mt: 7 }} />
        {/* <NotesTable></NotesTable> */}
      </Box>
    </>
  )
}

export default ProfileNotes
