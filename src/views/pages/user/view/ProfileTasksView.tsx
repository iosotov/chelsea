// import { MouseEvent, SyntheticEvent, useState } from 'react';

import { Ref, useState, forwardRef, ReactElement, ForwardedRef } from 'react'

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
      field: 'type',
      headerName: 'Type',
      width: 150,
      editable: true
    },
    {
      field: 'createdBy',
      headerName: 'Created By ',
      width: 150,
      editable: true
    },
    {
      field: 'description',
      headerName: 'Age',

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

  const rows = [
    { id: 1, type: 'Snow', createdBy: 'Jon', description: 35 },
    { id: 2, type: 'Lannister', createdBy: 'Cersei', description: 42 },
    { id: 3, type: 'Lannister', createdBy: 'Jaime', description: 45 },
    { id: 4, type: 'Stark', createdBy: 'Arya', description: 16 },
    { id: 5, type: 'Targaryen', createdBy: 'Daenerys', description: null },
    { id: 6, type: 'Melisandre', createdBy: null, description: 150 },
    { id: 7, type: 'Clifford', createdBy: 'Ferrara', description: 44 },
    { id: 8, type: 'Frances', createdBy: 'Rossini', description: 36 },
    { id: 9, type: 'Roxie', createdBy: 'Harvey', description: 65 }
  ]

  return (
    <>
      <AddTaskDrawer open={show} toggle={() => setShow(false)} />
      <Box sx={{ height: 50, width: '100%' }}>
        {' '}
        <Button
          size='medium'
          type='submit'
          variant='contained'
          color='secondary'
          sx={{ mb: 7, position: 'absolute', right: '8%' }}
          onClick={() => setShow(true)}
        >
          Create Task
        </Button>
      </Box>

      <br></br>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} checkboxSelection sx={{ mt: 7 }} />
      </Box>
    </>
  )
}

export default ProfileTasks
