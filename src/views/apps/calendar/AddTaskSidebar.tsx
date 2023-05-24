// ** React Imports
import { useState, useEffect, forwardRef, useCallback, Fragment, Dispatch, SetStateAction } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Types
import { EventDateType } from 'src/types/apps/calendarTypes'
import { TaskCreateType, TaskStatusEnum, TaskType } from 'src/store/api/taskApiSlice'
import { usePostProfilesSearchQuery, usePostTaskCreateMutation } from 'src/store/api/apiHooks'
import { useAppSelector } from 'src/store/hooks'
import { selectAllProfiles } from 'src/store/profileSlice'

interface PickerProps {
  label?: string
  error?: boolean
  registername?: string
}

interface DefaultStateType {
  url: string
  title: string
  allDay: boolean
  calendar: string
  description: string
  endDate: Date | string
  startDate: Date | string
  guests: string[] | string | undefined
}

const capitalize = (string: string) => string && string[0].toUpperCase() + string.slice(1)


type AddTaskSidebarType = {
  drawerWidth: number
  handleAddTaskSidebarToggle: () => void
  addTaskSidebarOpen: boolean
}


const AddTaskSidebar = (props: AddTaskSidebarType) => {
  // ** Props
  const {
    drawerWidth,
    addTaskSidebarOpen,
    handleAddTaskSidebarToggle
  } = props

  const {  isSuccess: profileSuccess } = usePostProfilesSearchQuery({})

  const profiles = useAppSelector(selectAllProfiles)

  const {
    control,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskCreateType>({ defaultValues: { dueDate: new Date() } })

  // const [addTask, { isLoading: taskLoading, isSuccess: taskSuccess, isError: taskError }] = usePostTaskCreateMutation()

  const handleSidebarClose = async () => {
    reset(),
      clearErrors()
    handleAddTaskSidebarToggle()
  }

  const onSubmit = (data: TaskCreateType) => {
    console.log(data)
    handleSidebarClose()
  }

  const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
    return (
      <TextField
        inputRef={ref}
        fullWidth
        {...props}
        label={props.label || ''}
        sx={{ width: '100%' }}
        error={props.error}
      />
    )
  })


  const RenderSidebarFooter = () => {

    return (
      <Fragment>
        <Button size='large' type='submit' variant='contained' sx={{ mr: 4 }}>
          Add
        </Button>
        <Button size='large' variant='outlined' color='secondary' onClick={() => reset()}>
          Reset
        </Button>
      </Fragment>
    )
  }

  return (
    <Drawer
      anchor='right'
      open={addTaskSidebarOpen}
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', drawerWidth] } }}
    >
      <Box
        className='sidebar-header'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: 'background.default',
          p: theme => theme.spacing(3, 3.255, 3, 5.255)
        }}
      >
        <Typography variant='h6'>
          Add Task
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size='small' onClick={handleSidebarClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
      </Box>
      <Box className='sidebar-body' sx={{ p: theme => theme.spacing(5, 6) }}>
        <DatePickerWrapper>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id='status'>Profile</InputLabel>
              <Controller
                name="profileId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    labelId='profileId'
                    label='Profile'
                    {...field}
                  >
                    {profileSuccess && profiles.map(p => (
                      <MenuItem key={p.profileId} value={p.profileId}>{p.firstName} {p.lastName}</MenuItem>
                    ))}
                    <MenuItem value='Personal'>Personal</MenuItem>
                  </Select>
                )}
              />
              {errors.profileId && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-profileId-error'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                defaultValue=''
                name='taskName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField label='Name' value={value} onChange={onChange} error={Boolean(errors.taskName)} />
                )}
              />
              {errors.taskName && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-taskName-error'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                defaultValue=''
                name='notes'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField label='Notes' value={value} onChange={onChange} error={Boolean(errors.taskName)} />
                )}
              />
              {errors.notes && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-notes-error'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
            <Box sx={{ mb: 6 }}>
              <Controller
                control={control}
                name="dueDate"
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    selected={new Date(value)}
                    id='event-start-date'
                    onChange={(date) => onChange(date)}
                    dateFormat="MM/dd/yyyy"
                    customInput={<PickersComponent label='Due Date' registername='dueDate' />}

                  />
                )}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RenderSidebarFooter />
            </Box>
          </form>
        </DatePickerWrapper>
      </Box>
    </Drawer>
  )
}




export default AddTaskSidebar
