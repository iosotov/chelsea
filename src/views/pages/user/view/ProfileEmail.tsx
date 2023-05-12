import { MouseEvent, SyntheticEvent } from 'react'

import { Ref, useState, ChangeEvent, useEffect, forwardRef, ReactElement, ForwardedRef } from 'react'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'

import InputAdornment from '@mui/material/InputAdornment'
import Cards, { Focused } from 'react-credit-cards'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Checkbox from '@mui/material/Checkbox'
import DialogContent from '@mui/material/DialogContent'
import Card from '@mui/material/Card'

import Dialog from '@mui/material/Dialog'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

//wysiwyg editor
import { EditorState } from 'draft-js'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Types

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

// import DialogActions from '@mui/material/DialogActions'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** MUI Imports

import { styled } from '@mui/material/styles'

import IconButton from '@mui/material/IconButton'

import Grid from '@mui/material/Grid'

import Icon from 'src/@core/components/icon'

import { SettingsContext } from 'src/@core/context/settingsContext'

//api hooks

import {
  useGetEmailQuery,
  useGetProfileLiabilityEmailsQuery,
  usePostProfileEmailMutation,
  postProfileLiabilityEmail,
  usePostProfileLiabilityEmailMutation,
  usePostEmailAttachmentMutation,
  useGetProfileEmailsQuery
} from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { selectEmailByProfileId } from 'src/store/emailSlice'
import { profile } from 'console'

interface Props {
  open: boolean

  // toggle: () => void
}

interface TaskType {
  id: number
  taskName?: string

  // dueDate: DateType
  dueDate: string
  assignedTo?: string
  note: string
  status?: string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))
const EditorControlled = () => {
  // ** State
  const [value, setValue] = useState(EditorState.createEmpty())

  return <ReactDraftWysiwyg editorState={value} onEditorStateChange={data => setValue(data)} />
}

const CustomPaymentInput = forwardRef(({ ...props }, ref: ForwardedRef<HTMLElement>) => {
  return <TextField inputRef={ref} label='Payment Date' {...props} />
})

const ProfileEmails = ({ id }: any) => {
  // console.log(data)

  // const Transition = forwardRef(function Transition(
  //   props: FadeProps & { children?: ReactElement<any, any> },
  //   ref: Ref<unknown>
  // ) {
  //   return <Fade ref={ref} {...props} />
  // })
  const [editor, setEditor] = useState(EditorState.createEmpty())

  // ** Hooks
  const profileId = id

  //data set remove this and useEffect and use global
  const [data, setData] = useState<any>([])

  //Drawer Form variables
  const [dialogTitle, setDialogTitle] = useState<string>('Create')

  // const [group, setGroup] = useState<string>('Users')
  const [subject, setSubject] = useState<string>('')
  const [body, setBody] = useState<string>('')
  const [sentTo, setSentTo] = useState<string>('')
  const [sentFrom, setSentFrom] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<string>('')
  const profileEmail = useAppSelector(state => selectEmailByProfileId(state, profileId))

  // const [selectedGroup, setSelectedGroup] = useState<string>('')

  let rows = []

  // const { isLoading, isSuccess, isError, error }= useAppSelector(state => selectTaskByProfileId(state, profileId))

  // const [paymentDate, setPaymentDate] = useState<DateType>()
  // const [rows, setRows] = useState<any>([])

  //State Management
  //set selectedTask type to taskType

  const [checkedValues, setCheckedValues] = useState<any>([])

  const [selectedEmail, setSelectedEmail] = useState<any>('')
  const [focus, setFocus] = useState<Focused>()
  const [openAddEmail, setOpenAddEmail] = useState<boolean>(false)
  const [openEditEmail, setOpenEditEmail] = useState<boolean>(false)

  //Api Calls
  const [triggerCreate, { isSuccess: triggerSuccess }] = usePostProfileEmailMutation()

  // const [triggerUpdate, { isSuccess: editApiSuccess }] = usePutUpdateTaskMutation()
  // const [triggerDelete, { isSuccess: deleteApiSuccess }] = useDeleteTaskMutation()
  // const [triggerBulkUpdate, { isSuccess: bulkUpdateApiSuccess }] = usePutBulkUpdateTasksMutation()

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

  const { isLoading, isSuccess, isError } = useGetProfileEmailsQuery(profileId)

  // console.log(isLoading, isSuccess, isError)

  const dataWithIndex = profileEmail.map((obj, index) => {
    return { ...obj, id: index }
  })
  rows = dataWithIndex
  console.log(rows)

  // useEffect(() => {
  //   if (checkedValues) {
  //     if (checkedValues.length == 0) {
  //       setDrawerTitle('Create')
  //     }
  //     if (checkedValues.length == 1) {
  //       setDrawerTitle('Edit')
  //     }
  //     if (checkedValues.length > 1) {
  //       setDrawerTitle('Bulk Update')
  //     }
  //   }

  //   // setSelectedTask({})
  // }, [checkedValues])

  //Global localstate useEffect, need to remove and use global global
  // useEffect(() => {
  //   if (tasksData) {
  //     console.log(tasksData)

  //     //adds index to data needed for dataGrid display can move to a function
  //     const dataWithIndex = tasksData.map((obj, index) => {
  //       return { ...obj, id: index }
  //     })
  //     console.log(dataWithIndex)

  //     setRows(dataWithIndex)
  //     setData(tasksData)

  //     // setSelectedTask({})
  //   }
  // }, [tasksData, data])

  //selected Task useeffect

  // useEffect(() => {
  //   openEditDialog()

  //   // openadd
  // }, [selectedEmail])

  function openEditDialog() {
    handleEditEmailOpen()

    // setOpenAddTask(false)

    // handleEditTaskOpen()
  }

  function handleGetTaskById(choice) {
    console.log(choice)
    setSelectedEmail(choice.row)
    console.log(selectedEmail)
    handleEditTaskOpen()

    // setOpenAddEmail(true)
  }

  //actual create request
  async function handleCreateEmailClick(params) {
    const payload = {
      profileId,
      subject: subject,
      body: body,
      sentFrom: sentFrom,
      sentTo: sentTo
    }

    const postResponse = await triggerCreate(payload).unwrap()
    console.log(postResponse)
  }

  // async function handleEditClick() {
  //   const testEditData = {
  //     taskId: selectedTask.taskId,
  //     taskName: taskName,

  //     dueDate: paymentDate,

  //     // dueDate: '2023-03-09',
  //     assignedTo: 'b12557c2-3a35-4ce6-9e52-959c07e13ce5',
  //     assignType: 2,
  //     notes: note,
  //     status: 1
  //   }
  //   console.log(testEditData)

  //   const putResponse = await triggerUpdate(testEditData).unwrap()
  //   console.log(putResponse)
  // }

  // async function handleDeleteClick() {
  //   console.log(selectedTask)
  //   const delResponse = await triggerDelete(selectedTask.taskId).unwrap()
  //   console.log(delResponse)
  // }

  const handleEditEmailOpen = () => {
    setDialogTitle('Edit')
    console.log(selectedEmail)

    // setSentTo(selectedEmail.sentTo ?? '')

    // // setTaskName(findEntry?.taskName ?? '')
    // setSelectedGroup('')

    // // setPaymentDate(new Date(selectedTask.dueDate ?? ''))
    // setPaymentDate(selectedTask.dueDate ?? '')

    // // setPaymentDate('')
    // setStatus('')
    // setNote(selectedTask.notes ?? '')
    setOpenAddEmail(true)
  }

  const actionChecker = () => {
    console.log(dialogTitle)

    if (dialogTitle == 'Edit') {
      // const findEntry = profileTask.find(item => item.taskId !== checkedValues[0])
      // setSelectedTask(findEntry)
      // console.log(selectedTask)
      handleEditEmailOpen()
    } else {
      handleAddEmailOpen()
    }
  }

  const handleAddEmailOpen = () => {
    // actionChecker()
    // setDrawerTitle('Create')
    setCreatedAt('')
    setSentTo('')
    setSentFrom('')

    // setPaymentDate(new Date(''))
    setSubject('')
    setBody('')

    setOpenAddEmail(true)
  }

  const handleEditTaskClose = () => {
    console.log('Closing')

    resetForm()

    // setDrawerTitle('Add')
    // setTaskName('')
    // setSelectedGroup('')
    // setPaymentDate(1)
    // setStatus('')
    // setNote('')
    // setOpenAddTask(false)
    // setOpenEditTask(false)
  }

  const handleAddEmailClose = () => {
    console.log('Closing')

    resetForm()
    setOpenAddEmail(false)
  }

  const handleBlur = () => setFocus(undefined)

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    //can do formatting here
    if (target.name === 'email-sentTo') {
      // target.value = formatCreditCardNumber(target.value, Payment)

      setSentTo(target.value)
    } else if (target.name === 'email-sentFrom') {
      // target.value = formatExpirationDate(target.value)
      setSentFrom(target.value)
    } else if (target.name === 'email-subject') {
      setSubject(target.value)
    } else if (target.name === 'email-body') {
      setBody(target.value)
    }
  }

  // const getTaskById = (settings: any) => {
  //   console.log(settings)
  //   const selected = data.find(select => select.taskId === settings)
  //   setSelectedTask(selected)

  //   return selected

  //   // setSelectedTask(selected)
  // }

  //fixing and checking for missing values using valueGetter in columns
  const getCompletedDate = (params: GridValueGetterParams) => {
    if (`${params.row.completedDate}`) {
      return 'Incomplete'
    } else {
      return `${params.row.completedDate}`
    }
  }

  const handleEditEmailChange = params => {
    // setSelectedEmail('')
    console.log('EDIT EMAIL')
    console.log(params)
    const myEmail = profileEmail.find(email => email.emailId == params.row.emailId)
    console.log(myEmail)
    if (myEmail) {
      setDialogTitle('Edit')
      setCreatedAt(myEmail.createdAt)
      setSentTo(myEmail.sentTo)
      setSentFrom(myEmail.sentFrom)

      // setPaymentDate(new Date(''))
      setSubject(myEmail.subject)
      setBody(myEmail.body)
      setOpenAddEmail(true)
    }

    // handleEditEmailClick

    // const value = event
    // console.log(params.row)
    // if (!selectedEmail) {
    //   setSelectedEmail(params.row)
    // }

    // console.log(e.target)
    // console.log(myEmail)

    // console.log(myEmail)

    // const value = choice
    // console.log(value)

    // console.log(myEmail)

    // checkbox not rendered need to persist
    // const value = data.row.emailId
    // console.log(value)

    // const findEntry = profileEmail.find(item => item.emailId == myEmail)
    // console.log(findEntry)

    // setSelectedEmail(findEntry)
    // console.log(selectedEmail)
  }

  // const renderEditEmailButton = params => {
  //   return (
  //     <IconButton
  //       size='small'
  //       sx={{ color: 'text.primary' }}
  //       value={params.row.emailId}
  //       onClick={() => handleEditEmailChange(params)}
  //     >
  //       <Icon icon='mdi:edit' fontSize={20} />
  //     </IconButton>
  //   )
  // }

  const renderEditEmailButton = params => {
    console.log(params)

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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 120, renderCell: renderEditEmailButton },
    {
      field: 'subject',
      headerName: 'Subject',
      width: 130,
      editable: true
    },
    {
      field: 'body',
      headerName: 'Body ',
      width: 150,
      editable: true
    },
    {
      field: 'sentFrom',
      headerName: 'Sent From',

      // type: 'text',
      width: 110,
      editable: true
    },
    {
      field: 'sentTo',
      headerName: 'sent To',

      // type: 'text',
      width: 110,
      editable: true

      // valueGetter: getCompletedDate
    },

    {
      field: 'createdAt',
      headerName: 'Created At',

      // type: 'text',
      width: 170,
      editable: true
    }

    // {
    //   field: 'notes',
    //   headerName: 'Note',

    //   // type: 'text',
    //   width: 110,
    //   editable: true
    // }

    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params: GridValueGetterParams) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
    // }
  ]

  const resetForm = () => {
    console.log('Resetting Drawer')

    // setDrawerTitle('Create')
    setDialogTitle('Create')
    setCreatedAt('')
    setSentTo('')
    setSentFrom('')

    setSubject('')
    setBody('')

    // setOpenEditTask(false)
  }

  //handle null values
  // const handleCellEditCommit = params => {
  //   if (params.field === 'completedDate' && params.value === null) {
  //     console.log('hi')
  //     params.row.completeDate = 'Not Completed' // Replace null with 0
  //     params.api.updateRow(params.row) // Update the row in the grid
  //   }
  // }

  if (isError) return <div>An error occured</div>

  if (isLoading) return <div>Loading</div>

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {/* <Box sx={{ height: 50, width: '100%' }}> */}
          <Typography variant='h5'>Emails</Typography>

          <Button
            size='medium'
            type='submit'
            variant='contained'
            color='secondary'
            sx={{ mb: 7, position: 'absolute', right: '12%' }}
            onClick={actionChecker}

            // onClick={actionChecker}

            // disabled={checkedValues.length > 1}
          >
            Compose Email
            {/* {checkedValues.length > 1 && <div>{drawerTitle + ' ' + checkedValues.length} Tasks</div>}
            {checkedValues.length < 1 && <div>{drawerTitle} Task</div>}
            {checkedValues.length == 1 && <div>{drawerTitle + ' ' + checkedValues.length} Task</div>} */}
          </Button>
          {/* </Box> */}
          {/* </Grid>
        <Grid item xs={12}> */}
          {/* BULKUPDATE BUTTON */}
          {/* <Button
            size='medium'
            type='submit'
            variant='contained'
            color='secondary'
            sx={{ mb: 7, position: 'absolute', right: '24%' }}
            // onClick={() => handleBulkEditTaskOpen()}
            onClick={actionChecker}
            disabled={checkedValues.length <= 1}
          >
            Bulk Update Task
          </Button> */}
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ height: 400, width: '100%' }}>
            {isLoading}
            {isError}
            <DataGrid rows={rows} columns={columns} sx={{ mt: 7 }}></DataGrid>
            {/* <DataGrid rows={dataWithIndex} columns={columns} sx={{ mt: 7 }}></DataGrid> */}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Dialog
            fullWidth
            open={openAddEmail}
            maxWidth='md'
            scroll='body'
            onClose={() => handleAddEmailClose()}

            // sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
          >
            <DialogContent
              sx={{
                position: 'relative',
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Card>
                <CardHeader title={`${dialogTitle}` + ' Email'} />
                <CardContent>
                  <form>
                    <Grid container spacing={5}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label='Template'
                          placeholder='Template'
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                          inputProps={{ maxLength: 1000 }}
                          onFocus={e => setFocus(e.target.name as Focused)}
                        />
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
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {/* {CONVERT TO SUMMERNOTE} */}
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
                        />
                        {/* <ReactDraftWysiwyg
                          fullWidth
                          editorState={editor}
                          onEditorStateChange={edit => setEditor(edit)}
                        /> */}
                        {/* <ReactDraftWysiwyg></ReactDraftWysiwyg> */}

                        {/* <EditorControlled></EditorControlled> */}
                      </Grid>
                      <Grid item xs={12}>
                        {/* render another button for edit */}
                        {dialogTitle === 'Create' && (
                          <Button type='submit' variant='contained' sx={{ mr: 4 }} onClick={handleCreateEmailClick}>
                            Send Email
                          </Button>
                        )}
                        {dialogTitle === 'Edit' && (
                          <Button type='submit' variant='contained' sx={{ mr: 4 }} onClick={handleEditEmailOpen}>
                            Edit Email
                          </Button>
                        )}

                        <Button variant='outlined' color='secondary'>
                          Discard
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
        </Grid>
      </Grid>
    </>
  )
}

export default ProfileEmails
