// import { MouseEvent, SyntheticEvent, useState } from 'react';

import { Ref, useState, useEffect, forwardRef, ReactElement, ForwardedRef } from 'react'

import Button from '@mui/material/Button'

import TextField from '@mui/material/TextField'

import AddTaskDrawer from './addTaskDrawer'

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

// import DialogActions from '@mui/material/DialogActions'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** MUI Imports

import { styled } from '@mui/material/styles'

import IconButton from '@mui/material/IconButton'

import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import Grid from '@mui/material/Grid'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

interface Props {
  open: boolean
  toggle: () => void
}

// const CustomInput = forwardRef(({ ...props }, ref: ForwardedRef<HTMLElement>) => {
//   return <TextField inputRef={ref} label='Payment Date' {...props} />
// })

// const Header = styled(Box)<BoxProps>(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(3, 4),
//   justifyContent: 'space-between',
//   backgroundColor: theme.palette.background.default
// }))

// const defaultValues = {
//   companyName: '',
//   billingEmail: ''
// }

const ProfileTasks = () => {
  // const Transition = forwardRef(function Transition(
  //   props: FadeProps & { children?: ReactElement<any, any> },
  //   ref: Ref<unknown>
  // ) {
  //   return <Fade ref={ref} {...props} />
  // })

  // ** Hooks
  // const [date, setDate] = useState<DateType>(new Date())
  // const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false)
  // const toggleAddPaymentDrawer = () => setAddPaymentOpen(!addPaymentOpen)
  const [show, setShow] = useState<boolean>(false)

  // const [data, setData] = useState<[]>(initData)
  const [data, setData] = useState<any>([])

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm({ defaultValues })
  // const [show, setShow] = useState<boolean>(false)

  // const onSubmit = () => {
  //   return
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

  // const data = [
  //   { id: 1, taskName: 'task1', assignedTo: 'Jon', dueDate: 35 },
  //   { id: 2, taskName: 'task2', assignedTo: 'Cersei', dueDate: 42 },
  //   { id: 3, taskName: 'task3', assignedTo: 'Jaime', dueDate: 45 },
  //   { id: 4, taskName: 'Stark', assignedTo: 'Arya', dueDate: 16 },
  //   { id: 5, taskName: 'Targaryen', assignedTo: 'Daenerys', dueDate: null },
  //   { id: 6, taskName: 'Melisandre', assignedTo: null, dueDate: 150 },
  //   { id: 7, taskName: 'Clifford', assignedTo: 'Ferrara', dueDate: 44 },
  //   { id: 8, taskName: 'Frances', assignedTo: 'Rossini', dueDate: 36 },
  //   { id: 9, taskName: 'Roxie', assignedTo: 'Harvey', dueDate: 65 }
  // ]
  const ex = [
    { id: 1, taskName: 'task1', assignedTo: 'Jon', dueDate: 35 },
    { id: 2, taskName: 'task2', assignedTo: 'Cersei', dueDate: 42 },
    { id: 3, taskName: 'task3', assignedTo: 'Jaime', dueDate: 45 },
    { id: 4, taskName: 'Stark', assignedTo: 'Arya', dueDate: 16 },
    { id: 5, taskName: 'Targaryen', assignedTo: 'Daenerys', dueDate: null },
    { id: 6, taskName: 'Melisandre', assignedTo: null, dueDate: 150 },
    { id: 7, taskName: 'Clifford', assignedTo: 'Ferrara', dueDate: 44 },
    { id: 8, taskName: 'Frances', assignedTo: 'Rossini', dueDate: 36 },
    { id: 9, taskName: 'Roxie', assignedTo: 'Harvey', dueDate: 65 }
  ]

  // const GetTasks = () => {
  //   //call api to get tasks

  //   return data
  // }

  const GetMine = () => {
    //call api to get tasks

    // const my = ex

    // const [data, setData] = useState(ex)
    setData(ex)
    console.log(data)
    console.log(setData)

    // rows = data
    // console.log(rows)
  }

  useEffect(() => {
    GetMine()
  }, [])

  const updateData = () => {
    const ex = [
      { id: 1, taskName: 'taskNew', assignedTo: 'Jon', dueDate: 35 },
      { id: 2, taskName: 'task2', assignedTo: 'Cersei', dueDate: 42 },
      { id: 3, taskName: 'task3', assignedTo: 'Jaime', dueDate: 45 },
      { id: 4, taskName: 'Stark', assignedTo: 'Arya', dueDate: 16 },
      { id: 5, taskName: 'Targaryen', assignedTo: 'Daenerys', dueDate: null },
      { id: 6, taskName: 'Melisandre', assignedTo: null, dueDate: 150 },
      { id: 7, taskName: 'Clifford', assignedTo: 'Ferrara', dueDate: 44 },
      { id: 8, taskName: 'Frances', assignedTo: 'Rossini', dueDate: 36 },
      { id: 9, taskName: 'Roxie', assignedTo: 'Harvey', dueDate: 65 }
    ]
    setData(ex)
  }

  return (
    <>
      {/* <GetTasks></GetTasks> */}
      <Button onClick={updateData}>hi</Button>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <AddTaskDrawer open={show} toggle={() => setShow(false)} />
        </Grid>

        <Grid item xs={12}>
          {/* <Box sx={{ height: 50, width: '100%' }}> */} <Typography variant='h5'>Tasks</Typography>
          <Button
            size='medium'
            type='submit'
            variant='contained'
            color='secondary'
            sx={{ mb: 7, position: 'absolute', right: '12%' }}
            onClick={() => setShow(true)}
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
      </Grid>
    </>
  )
}

export default ProfileTasks
