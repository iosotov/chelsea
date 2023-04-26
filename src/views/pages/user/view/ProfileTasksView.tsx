// import { MouseEvent, SyntheticEvent, useState } from 'react';

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

interface Props {
  open: boolean

  // toggle: () => void
}

interface TaskType {
  id: number
  taskName?: string

  dueDate: DateType

  // dueDate: number
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

const ProfileTasks = () => {
  // console.log(data)

  // const Transition = forwardRef(function Transition(
  //   props: FadeProps & { children?: ReactElement<any, any> },
  //   ref: Ref<unknown>
  // ) {
  //   return <Fade ref={ref} {...props} />
  // })

  // ** Hooks

  const [drawerTitle, setDrawerTitle] = useState<string>('Add')
  const [group, setGroup] = useState<string>('Users')
  const [taskName, setTaskName] = useState<string>('')
  const [paymentDate, setPaymentDate] = useState<DateType>(new Date())
  const [status, setStatus] = useState<string>('')
  const [focus, setFocus] = useState<Focused>()

  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [note, setNote] = useState<string>('')

  const [openAddTask, setOpenAddTask] = useState<boolean>(false)
  const [openEditTask, setOpenEditTask] = useState<boolean>(false)

  // const [data, setData] = useState<[]>(initData)
  // const [data, setData] = useState<TaskType>()
  //fake data, set up TaskType data structure
  const ex = [
    { id: 1, taskName: 'task1', assignedTo: 'Jon', dueDate: new Date('01/01/2020'), note: 'hi', status: 'open' },
    { id: 2, taskName: 'task2', assignedTo: 'Cersei', dueDate: new Date('01/01/2020'), note: 'hi', status: 'open' },
    { id: 3, taskName: 'task3', assignedTo: 'Jaime', dueDate: new Date('01/01/2020'), note: 'hi', status: 'open' },
    { id: 4, taskName: 'Stark', assignedTo: 'Arya', dueDate: new Date('01/01/2020'), note: 'hi', status: 'open' },
    {
      id: 5,
      taskName: 'Targaryen',
      assignedTo: 'Daenerys',
      dueDate: new Date('01/01/2020'),
      note: 'hi',
      status: 'false'
    },
    { id: 6, taskName: 'Melisandre', assignedTo: 'null', dueDate: new Date('01/01/2020'), note: 'hi', status: 'true' },
    {
      id: 7,
      taskName: 'Clifford',
      assignedTo: 'Ferrara',
      dueDate: new Date('01/01/2020'),
      note: 'hi',
      status: 'false'
    },
    { id: 8, taskName: 'Frances', assignedTo: 'Rossini', dueDate: new Date('01/01/2020'), note: 'hi', status: 'true' },
    { id: 9, taskName: 'Roxie', assignedTo: 'Harvey', dueDate: new Date('01/01/2020'), note: 'hi', status: 'true' }
  ]

  // s
  const [data, setData] = useState<any>(ex)

  // const [props, setProps] = useState < any > [{ group, taskName, paymentDate, status, selectedGroup, note }]

  const handleEditTaskOpen = () => {
    console.log('HANLING')
    setDrawerTitle('Edit')
    setTaskName('')
    setSelectedGroup('')
    setPaymentDate(new Date('01/01/2020'))
    setStatus('')
    setNote('')
    setOpenEditTask(true)
  }

  const handleAddTaskOpen = () => {
    console.log(drawerTitle, taskName, selectedGroup, paymentDate, status, note)
    console.log('HANLING')
    setDrawerTitle('Add')
    setTaskName('')
    setSelectedGroup('')
    setPaymentDate(new Date('01/01/2020'))
    setStatus('')
    setNote('')
    setOpenAddTask(true)
    console.log(drawerTitle, taskName, selectedGroup, paymentDate, status, note)
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
    if (target.name === 'task-name') {
      // target.value = formatCreditCardNumber(target.value, Payment)
      console.log('same name target')
      setTaskName(target.value)
    } else if (target.name === 'task-note') {
      // target.value = formatExpirationDate(target.value)
      setNote(target.value)
      console.log('same name note')

      // else if (target.name === 'task-paymentDate') {

      //   setPaymentDate(target.value)
      // }
    }
  }

  //API calls
  // const getTasks = () =>{
  //   useEffect(() => {
  //     async function fetchData() {
  //       const result = await fetchAPI('https://api.example.com/data');
  //       setData(result);
  //     })
  // }

  const addTask = query => {
    setOpenAddTask(false)
    console.log('payload', query)
  }

  // const getTask =() =>{

  // }

  // const getTaskbyId =() =>{

  // }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'taskName',
      headerName: 'Task Name',
      width: 150,
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
      editable: true
    },
    {
      field: 'status',
      headerName: 'Status',

      // type: 'text',
      width: 110,
      editable: true
    },
    {
      field: 'note',
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

  const rows = []
  console.log(new Date())

  // const GetTasks = () => {
  //   //call api to get tasks

  //   return data
  // }

  // useEffect(() => {
  //   GetMine()
  // }, [])

  // const updateData = () => {
  //   const ex = [
  //     { id: 1, taskName: 'taskNew', assignedTo: 'Jon', dueDate: 35 },
  //     { id: 2, taskName: 'task2', assignedTo: 'Cersei', dueDate: 42 },
  //     { id: 3, taskName: 'task3', assignedTo: 'Jaime', dueDate: 45 },
  //     { id: 4, taskName: 'Stark', assignedTo: 'Arya', dueDate: 16 },
  //     { id: 5, taskName: 'Targaryen', assignedTo: 'Daenerys', dueDate: null },
  //     { id: 6, taskName: 'Melisandre', assignedTo: null, dueDate: 150 },
  //     { id: 7, taskName: 'Clifford', assignedTo: 'Ferrara', dueDate: 44 },
  //     { id: 8, taskName: 'Frances', assignedTo: 'Rossini', dueDate: 36 },
  //     { id: 9, taskName: 'Roxie', assignedTo: 'Harvey', dueDate: 65 }
  //   ]
  //   setData(ex)
  // }
  const resetForm = () => {
    console.log('resetting')
    setDrawerTitle('Add')
    setTaskName('')
    setSelectedGroup('')
    setPaymentDate(1)
    setStatus('')
    setNote('')

    // setOpenEditTask(false)
    console.log(drawerTitle, taskName, selectedGroup, paymentDate, status, note)
  }

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
        <Grid item xs={12}>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid rows={data} columns={columns} sx={{ mt: 7 }} />
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
                <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                  <DatePicker
                    selected={paymentDate}
                    name='task-paymentDate'
                    id='task-paymentDate'
                    customInput={<CustomPaymentInput />}
                    onChange={(paymentDate: Date) => setPaymentDate(paymentDate)}
                  />
                </DatePickerWrapper>
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
                <Button
                  size='large'
                  variant='contained'
                  sx={{ mr: 4 }}
                  onClick={() => addTask({ taskName, note, paymentDate, group, selectedGroup })}
                >
                  Send
                </Button>
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
