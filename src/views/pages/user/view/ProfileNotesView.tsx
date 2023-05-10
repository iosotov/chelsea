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
import { selectNotesByProfileId } from 'src/store/noteSlice'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

import NotesTable from 'src/views/pages/user/view/components/notes/NotesTable'

const defaultValues = {
  companyName: '',
  billingEmail: ''
}

const ProfileNotes = ({ id }: any) => {
  // const Transition = forwardRef(function Transition(
  //   props: FadeProps & { children?: ReactElement<any, any> },
  //   ref: Ref<unknown>
  // ) {
  //   return <Fade ref={ref} {...props} />
  // })

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
  const [triggerCreate, { isSuccess: triggerSuccess }] = usePostNoteCreateMutation()

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
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

    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params: GridValueGetterParams) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
    // }
  ]

  // const rows = [
  //   { id: 1, type: 'Snow', createdBy: 'Jon', description: 35 },
  //   { id: 2, type: 'Lannister', createdBy: 'Cersei', description: 42 },
  //   { id: 3, type: 'Lannister', createdBy: 'Jaime', description: 45 },
  //   { id: 4, type: 'Stark', createdBy: 'Arya', description: 16 },
  //   { id: 5, type: 'Targaryen', createdBy: 'Daenerys', description: null },
  //   { id: 6, type: 'Melisandre', createdBy: null, description: 150 },
  //   { id: 7, type: 'Clifford', createdBy: 'Ferrara', description: 44 },
  //   { id: 8, type: 'Frances', createdBy: 'Rossini', description: 36 },
  //   { id: 9, type: 'Roxie', createdBy: 'Harvey', description: 65 }
  // ]

  // const handleChange = event => {
  //   setNoteType(event.target.value)
  //   setNoteTemplate(event.target.value)
  //   console.log(noteType)
  // }
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

  async function handleUpdateClick(props) {
    console.log(props)
    const payload = {
      noteId,
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

  //init data load, call get request for data set
  // loadData()

  // const renderEditNoteButton = () => {
  //   <IconButton value={params.row.taskId} onChange={handleCheckboxChange}>
  //     <Icon>

  //     </Icon>
  //   </IconButton>
  //   return <Checkbox {...label}  />
  // }

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
              value={noteEmails}
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
            <Button
              type='submit'
              variant='contained'
              sx={{ mr: 4 }}
              onClick={() => handleCreateClick({ message, notifyUsers, noteType, noteTemplate, noteEmails, important })}

              //remove payload,
            >
              Create Note
            </Button>
            <Button variant='outlined' color='secondary' onClick={() => resetForm()}>
              Clear Form
            </Button>
          </Grid>
        </Grid>
      </form>

      <br></br>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} checkboxSelection sx={{ mt: 7 }} />
        {/* <NotesTable></NotesTable> */}
      </Box>
    </>
  )
}

export default ProfileNotes
