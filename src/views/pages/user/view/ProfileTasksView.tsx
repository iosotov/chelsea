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
  useGetTaskQuery,
  useGetProfileTasksQuery,
  usePutUpdateTaskMutation,
  usePostCreateTaskMutation
} from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { selectTaskByProfileId } from 'src/store/taskSlice'

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

const CustomPaymentInput = forwardRef(({ ...props }, ref: ForwardedRef<HTMLElement>) => {
  return <TextField inputRef={ref} label='Payment Date' {...props} />
})

const ProfileTasks = ({ id }: any) => {
  // console.log(data)
  console.log(id)

  // const Transition = forwardRef(function Transition(
  //   props: FadeProps & { children?: ReactElement<any, any> },
  //   ref: Ref<unknown>
  // ) {
  //   return <Fade ref={ref} {...props} />
  // })

  // ** Hooks
  const profileId = id

  //data set remove this and useEffect and use global
  const [data, setData] = useState<any>([])

  //Drawer Form variables
  const [drawerTitle, setDrawerTitle] = useState<string>('Add')
  const [group, setGroup] = useState<string>('Users')
  const [taskName, setTaskName] = useState<string>('')
  const profileTask = useAppSelector(state => selectTaskByProfileId(state, profileId))
  const [status, setStatus] = useState<string>('')
  const [paymentDate, setPaymentDate] = useState<string>('')
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [note, setNote] = useState<string>('')

  // const [paymentDate, setPaymentDate] = useState<DateType>()
  const [rows, setRows] = useState<any>([])

  //State Management
  //set selectedTask type to taskType
  const [selectedTask, setSelectedTask] = useState<any>({})
  const [focus, setFocus] = useState<Focused>()
  const [openAddTask, setOpenAddTask] = useState<boolean>(false)
  const [openEditTask, setOpenEditTask] = useState<boolean>(false)

  //Api Calls
  const [triggerCreate, { isSuccess: triggerSuccess }] = usePostCreateTaskMutation()
  const [triggerUpdate, { isSuccess: editApiSuccess }] = usePutUpdateTaskMutation()

  const { isLoading, isSuccess, isError, error } = useGetProfileTasksQuery(profileId)

  // error.msg

  // return (

  //   <>
  //   {profileTask.map(el => el )}
  //   </>
  // )
  //use isLoading state to conditionally render data
  //use global
  console.log(profileTask)
  console.log(isLoading, isSuccess, isError, error)
  const tasksData = profileTask

  //Global localstate useEffect, need to remove and use global global
  useEffect(() => {
    if (tasksData) {
      console.log(tasksData)

      //adds index to data needed for dataGrid display can move to a function
      const dataWithIndex = tasksData.map((obj, index) => {
        return { ...obj, id: index }
      })
      console.log(dataWithIndex)

      setRows(dataWithIndex)
      setData(tasksData)

      // setSelectedTask({})
    }
  }, [tasksData, data])

  //selected Task useeffect

  useEffect(() => {
    openEditDrawer()
  }, [selectedTask])

  function openEditDrawer() {
    console.log(selectedTask)
    handleEditTaskOpen()

    // setOpenAddTask(false)

    // handleEditTaskOpen()
  }

  function handleGetTaskById(choice) {
    setSelectedTask(choice.row)
    setOpenAddTask(true)
  }

  //actual create request
  async function handleCreateClick() {
    const testData = {
      profileId,
      taskName: taskName,
      dueDate: paymentDate,
      assignedTo: 'b12557c2-3a35-4ce6-9e52-959c07e13ce5',
      assignType: 2,
      notes: note
    }
    const postResponse = await triggerCreate(testData).unwrap()
    console.log(postResponse)
  }

  async function handleEditClick() {
    const testEditData = {
      taskId: selectedTask.taskId,
      taskName: taskName,

      dueDate: paymentDate,

      // dueDate: '2023-03-09',
      assignedTo: 'b12557c2-3a35-4ce6-9e52-959c07e13ce5',
      assignType: 2,
      notes: note,
      status: 1
    }
    console.log(testEditData)

    const putResponse = await triggerUpdate(testEditData).unwrap()
    console.log(putResponse)
  }

  // s
  // const [data, setData] = useState<any>(tasksData)

  // const [props, setProps] = useState < any > [{ group, taskName, paymentDate, status, selectedGroup, note }]

  const handleEditTaskOpen = () => {
    setDrawerTitle('Edit')

    setTaskName(selectedTask.taskName ?? '')
    setSelectedGroup('')

    // setPaymentDate(new Date(selectedTask.dueDate ?? ''))
    setPaymentDate(selectedTask.dueDate)

    // setPaymentDate('')
    setStatus('')
    setNote(selectedTask.notes ?? '')
  }

  const handleAddTaskOpen = () => {
    setDrawerTitle('Add')
    setTaskName('')
    setSelectedGroup('')
    setPaymentDate('')

    // setPaymentDate(new Date(''))
    setStatus('')
    setNote('')
    setOpenAddTask(true)
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

  const handleBlur = () => setFocus(undefined)

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    //can do formatting here
    if (target.name === 'task-name') {
      // target.value = formatCreditCardNumber(target.value, Payment)
      console.log('same name target')
      setTaskName(target.value)
    } else if (target.name === 'task-note') {
      // target.value = formatExpirationDate(target.value)
      setNote(target.value)
      console.log('same name note')
    } else if (target.name === 'task-paymentDate') {
      setPaymentDate(target.value)
    }
  }

  const addTask = query => {
    setOpenAddTask(false)

    // handleClick
    console.log('payload', query)
  }

  // const getTask =() =>{

  // }

  // const getTaskbyId =() =>{

  // }

  // async function getTaskById(settings: any) {
  //   console.log(settings)

  //   // await selectedTask
  //   await settings
  //   console.log(settings)
  //   const selected = await data.find(select => select.taskId === settings)
  //   await setSelectedTask(selected)
  //   console.log(selected)
  //   console.log(selectedTask)

  //   //set isLoading, and only open modal after it loads is false

  //   //set selected to task after filtering data list
  // }

  const getTaskById = (settings: any) => {
    console.log(settings)
    const selected = data.find(select => select.taskId === settings)
    setSelectedTask(selected)

    return selected

    // setSelectedTask(selected)
  }

  //fixing and checking for missing values using valueGetter in columns
  const getCompletedDate = (params: GridValueGetterParams) => {
    if (`${params.row.completedDate}`) {
      return 'Incomplete'
    } else {
      return `${params.row.completedDate}`
    }
  }

  // const buttonActions = params => {
  //   console.log(params.row.taskId)

  //   // setSelectedTask(params.row.taskId)
  //   // console.log(selectedTask)

  //   // const setting = selectedTask
  //   const setting = params.row.taskId

  //   getTaskById(setting)

  //   //not being updated before it is sent
  //   console.log(selectedTask)
  //   handleEditTaskOpen()

  //   return params.row.id
  // }

  // function handleSelectItem(item) {
  //   console.log(item.row)
  //   setSelectedTask(item.row)
  //   console.log(selectedTask)
  // }

  //generate button for editById
  const renderEditTaskButton = params => {
    return (
      <strong>
        <IconButton
          sx={{ color: '#497ce2' }}
          onClick={() => {
            handleGetTaskById(params)
          }}
        >
          {/* {params.row.taskId} */}
          <Icon icon='mdi:edit' />
        </IconButton>
      </strong>
    )
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 120, renderCell: renderEditTaskButton },
    {
      field: 'taskName',
      headerName: 'Task Name',
      width: 130,
      editable: true
    },
    {
      field: 'assignedTo',
      headerName: 'Assigned To ',
      width: 150,
      editable: true
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',

      // type: 'text',
      width: 110,
      editable: true
    },
    {
      field: 'completedDate',
      headerName: 'Completed Date',

      // type: 'text',
      width: 110,
      editable: true,
      valueGetter: getCompletedDate
    },
    {
      field: 'statusName',
      headerName: 'Status',

      // type: 'text',
      width: 110,
      editable: true
    },
    {
      field: 'notes',
      headerName: 'Note',

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

  const resetForm = () => {
    console.log('Resetting Drawer')
    setDrawerTitle('Add')
    setTaskName('')
    setSelectedGroup('')
    setPaymentDate('')
    setStatus('')
    setNote('')

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

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {/* <Box sx={{ height: 50, width: '100%' }}> */} <Typography variant='h5'>Tasks</Typography>
          <Button
            size='medium'
            type='submit'
            variant='contained'
            color='secondary'
            sx={{ mb: 7, position: 'absolute', right: '12%' }}
            onClick={handleAddTaskOpen}
          >
            Create Task
          </Button>
          {/* </Box> */}
        </Grid>
        {/* <Grid item xs={12}>
          <Button
            size='medium'
            type='submit'
            variant='contained'
            color='secondary'
            sx={{ mb: 7, position: 'absolute', right: '12%' }}

            // onClick={}
          >
            Bulk Update Task
          </Button>
        </Grid> */}
        <Grid item xs={12}>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} sx={{ mt: 7 }}></DataGrid>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Drawer
            open={openAddTask}
            onClose={() => setOpenAddTask(false)}
            anchor='right'
            variant='temporary'
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
          >
            <Header>
              <Typography variant='h6'>{drawerTitle} Task</Typography>
              <IconButton size='small' sx={{ color: 'text.primary' }}>
                <Icon icon='mdi:close' fontSize={20} />
              </IconButton>
            </Header>

            <Box sx={{ p: 5 }}>
              <Box sx={{ mb: 6 }}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    name='task-name'
                    label='Task Name'
                    value={taskName}
                    // defaultValue='hi'
                    onBlur={handleBlur}
                    placeholder='Task Name'
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 100 }}
                    onFocus={e => setFocus(e.target.name as Focused)}
                  />
                  {/* <InputLabel htmlFor='payment-method'>Task Name</InputLabel>
                  <Select
                    label='Task Name'
                    labelId='task-name'
                    id='task-name-select'
                    defaultValue='select-method'

                    // onChange={handleInputChange}
                  >
                    <MenuItem value='select-method' disabled>
                      Select Task Name

                    </MenuItem> */}
                  {/* swtich to select if edit, else use textfield */}
                  {/* {options.map(option => (
                <MenuItem key={option.taskName} value={option.id}>
                  {option.taskName}
                </MenuItem>
              ))} */}

                  {/* </Select> */}
                </FormControl>
              </Box>
              {/* <Box sx={{ mb: 6 }}>
          <TextField
            fullWidth
            id='companyName'
            label='Task Name'
            InputProps={{ disabled: false }}
            defaultValue='Task Name'
          />
        </Box> */}
              <Box sx={{ mb: 6 }}>
                {/* commented out datepicker and config type */}
                {/* <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                  <DatePicker
                    selected={paymentDate}
                    value={paymentDate}
                    name='task-paymentDate'
                    id='task-paymentDate'
                    customInput={<CustomPaymentInput />}
                    onChange={(paymentDate: Date) => setPaymentDate(paymentDate)}
                  />
                </DatePickerWrapper> */}
                <TextField
                  fullWidth
                  name='task-paymentDate'
                  label='Task Payment Date'
                  value={paymentDate}
                  // defaultValue='hi'
                  onBlur={handleBlur}
                  placeholder='Task Name'
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 100 }}
                  onFocus={e => setFocus(e.target.name as Focused)}
                />
              </Box>
              {/* <Box sx={{ mb: 6 }}>
          <TextField
            fullWidth
            type='number'
            label='Payment Amount'
            InputProps={{
              startAdornment: <InputAdornment position='start'>$</InputAdornment>
            }}
          />
        </Box> */}
              <Box sx={{ mb: 6 }}>{selectedTask.taskId}</Box>
              <Box sx={{ mb: 6 }}>
                <ButtonGroup variant='contained' sx={{ ml: 10 }}>
                  <Button onClick={() => setGroup('Users')}>Users</Button>
                  <Button onClick={() => setGroup('Teams')}>Teams</Button>
                  <Button onClick={() => setGroup('Roles')}>Roles</Button>
                </ButtonGroup>
              </Box>
              {/* {group} */}

              <Box sx={{ mb: 6 }}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='payment-method'>Choose..</InputLabel>
                  <Select
                    label='Select Group'
                    labelId='task-group'
                    name='task-group'
                    id='payment-method-select'
                    defaultValue='select-method'
                  >
                    <MenuItem value='select-method' disabled>
                      Select Group
                    </MenuItem>
                    {/* //Load group from user roles teams, calls api depending on useState of group */}
                    <MenuItem value='Cash'>User1</MenuItem>
                    <MenuItem value='Bank Transfer'>Team1</MenuItem>
                    <MenuItem value='Credit'>Credit</MenuItem>
                    <MenuItem value='Debit'>Debit</MenuItem>
                    <MenuItem value='Paypal'>Paypal</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ mb: 6 }}>
                <FormControl fullWidth>
                  <TextField
                    rows={6}
                    multiline
                    fullWidth
                    name='task-note'
                    label='Note'
                    placeholder='Note'
                    value={note}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 1000 }}
                    onFocus={e => setFocus(e.target.name as Focused)}
                  ></TextField>
                </FormControl>
              </Box>
              <Box sx={{ mb: 6 }}>
                <FormGroup>
                  <FormControlLabel control={<Switch defaultChecked />} name={status} label='Active' />
                </FormGroup>
              </Box>

              <div>
                {/* conditional rendering button */}
                {drawerTitle === 'Add' && (
                  <Button size='large' variant='contained' sx={{ mr: 4 }} onClick={() => handleCreateClick()}>
                    Create
                  </Button>
                )}
                {drawerTitle === 'Edit' && (
                  <Button size='large' variant='contained' sx={{ mr: 4 }} onClick={() => handleEditClick()}>
                    Update
                  </Button>
                )}

                <Button size='large' variant='outlined' color='secondary' onClick={() => setOpenAddTask(false)}>
                  Cancel
                </Button>
              </div>
            </Box>
          </Drawer>
        </Grid>
      </Grid>
    </>
  )
}

export default ProfileTasks
