// ** React Imports
import { useState, forwardRef, ForwardedRef, useEffect, ChangeEvent } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { ButtonGroup } from '@mui/material'

interface Props {
  open: boolean
  close: boolean
  data: []
}

const CustomInput = forwardRef(({ ...props }, ref: ForwardedRef<HTMLElement>) => {
  return <TextField inputRef={ref} label='Payment Date' {...props} />
})

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const AddTaskDrawer = ({ open, data, close }: Props) => {
  // ** State
  const [date, setDate] = useState<DateType>(new Date())
  console.log(data)
  console.log(open)
  console.log(close)

  // const data =[];

  //Form Values
  // const [options, setOptions] = useState<any>(data)
  const [drawerTitle, setDrawerTitle] = useState<string>('Add')
  const [group, setGroup] = useState<string>('Users')
  const [taskName, setTaskName] = useState<string>('')
  const [paymentDate, setPaymentDate] = useState<number>()
  const [status, setStatus] = useState<string>('')

  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [note, setNote] = useState<string>('')

  const [openAddTask, setOpenAddTask] = useState<boolean>(false)
  const [openEditTask, setOpenEditTask] = useState<boolean>(false)

  // console.log(data)

  // useEffect(() => {
  //   setOptions(data)
  // }, [data])

  // function handleSubmit(event) {
  //   event.preventDefault()
  //   console.log({ taskName, paymentDate, group, selectedGroup, note })

  //   onSubmit({ taskName, paymentDate, group, selectedGroup, note })
  // }

  // const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
  //   if (target.name === 'group') {
  //     // target.value = formatCreditCardNumber(target.value, Payment)
  //     setGroup(target.value)
  //   } else if (target.name === 'taskName') {
  //     // target.value = formatExpirationDate(target.value)

  //     setTaskName(target.value)
  //   } else if (target.name === 'note') {
  //     // target.value = formatCVC(target.value, cardNumber, Payment)
  //     setNote(target.value)
  //   }
  // }
  const handleEditTaskClose = () => {
    const props = [drawerTitle, group, taskName, paymentDate, status, selectedGroup, note]
    console.log(props)
    open = false
    console.log(open)
  }

  return (
    <Drawer
      open={open}
      onClose={() => handleEditTaskClose}
      anchor='right'
      variant='temporary'
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
    >
      <Header>
        <Typography variant='h6'>Add Task</Typography>
        <IconButton size='small' sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>

      <Box sx={{ p: 5 }}>
        <Box sx={{ mb: 6 }}>
          <FormControl fullWidth>
            <InputLabel htmlFor='payment-method'>Task Name</InputLabel>
            <Select
              label='Task Name'
              labelId='payment-method'
              id='payment-method-select'
              defaultValue='select-method'

              // onChange={handleInputChange}
            >
              <MenuItem value='select-method' disabled>
                Select Task Name
                {/* {taskName} */}
              </MenuItem>
              {/* {options.map(option => (
                <MenuItem key={option.taskName} value={option.id}>
                  {option.taskName}
                </MenuItem>
              ))} */}
              {/* <MenuItem value='select-method' disabled>
                Select Task Name
              </MenuItem>
              <MenuItem value='Cash'>120 Day</MenuItem>
              <MenuItem value='Bank Transfer'>test</MenuItem>
              <MenuItem value='Credit'>Name of Task</MenuItem>
              <MenuItem value='Debit'>Task1</MenuItem>
              <MenuItem value='Paypal'>Paypal</MenuItem> */}
            </Select>
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
              selected={date}
              id='invoice-payment-date'
              customInput={<CustomInput />}
              onChange={(date: Date) => setDate(date)}
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
            {/* <Button onClick={() => setGroup('Users')}>Users</Button>
            <Button onClick={() => setGroup('Teams')}>Teams</Button>
            <Button onClick={() => setGroup('Roles')}>Roles</Button> */}
          </ButtonGroup>
        </Box>
        {/* {group} */}

        <Box sx={{ mb: 6 }}>
          <FormControl fullWidth>
            <InputLabel htmlFor='payment-method'>Choose..</InputLabel>
            <Select
              label='Select Group'
              labelId='payment-method'
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
          <TextField rows={6} multiline fullWidth label='Note' placeholder='Note' />
        </Box>

        <div>
          <Button type='submit' size='large' variant='contained' sx={{ mr: 4 }}>
            Send
          </Button>
          <Button size='large' variant='outlined' color='secondary'>
            Cancel
          </Button>
        </div>
      </Box>
    </Drawer>
  )
}

export default AddTaskDrawer
