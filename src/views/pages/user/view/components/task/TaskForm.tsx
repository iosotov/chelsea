import { Box, BoxProps, Button, ButtonGroup, Drawer, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, TextField, Typography, styled } from "@mui/material"
import { Fragment, forwardRef, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker"
import DatePicker from 'react-datepicker'
import { useDeleteTaskMutation, useGetGroupsQuery, useGetRolesQuery, usePostEmployeeSearchQuery, usePostProfilesSearchQuery, usePostTaskCreateMutation, usePostTemplateSearchQuery, usePutTaskUpdateMutation, usePutTasksBulkUpdateMutation } from "src/store/api/apiHooks"
import { TaskBulkUpdateType, TaskCreateType, TaskStatusEnum, TaskUpdateType } from "src/store/api/taskApiSlice"
import { useAppSelector } from "src/store/hooks"
import { selectAllProfiles } from "src/store/profileSlice"
import { selectAllEmployeeSelectOptions } from "src/store/employeeSlice"
import { selectAllGroupSelectOptions } from "src/store/groupSlice"
import { selectAllRoleSelectOptions } from "src/store/roleSlice"
import { v4 as uuid } from 'uuid';
import { selectTaskById } from "src/store/taskSlice"
import { toast } from "react-hot-toast"
import { store } from "src/store/store"
import { selectTemplatesByType } from "src/store/templateSlice"

export type TaskFormProps = {
  formMode: number
  calendarMode: boolean
  openTaskModal: boolean
  setOpenTaskModal: (state: boolean) => void
  selectedTasks: string[]
  profileId?: string
  drawerWidth?: number
}

interface PickerProps {
  label?: string
  error?: boolean
  registername?: string
}

interface FilteredOptionsType {
  label: string
  value: string
}

interface FormValues {
  taskName: string
  dueDate: Date
  assignedTo: string
  assignType?: number
  notes?: string
  liabilityId?: string
  profileId?: string
  status?: TaskStatusEnum
  completedDate?: string
  rescheduleDate?: string
  taskIds?: string[]
}

export const DrawerTitles = ["Create Task", "Edit Task", "Bulk Update Tasks"]
const StatusValues = ["Open", "Attempted", "Completed", "Closed"]
const assignTypes = ["Employees", "Groups", "Roles"]

const values: FormValues = {
  profileId: "",
  taskName: "",
  dueDate: new Date(),
  assignedTo: "",
  notes: ""
}

const defaultValues = {
  profileId: "",
  taskName: "",
  dueDate: new Date(),
  assignedTo: "",
  notes: "",
  status: 0
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

export function TaskForm({ formMode, calendarMode, openTaskModal, setOpenTaskModal, selectedTasks, profileId = "", drawerWidth = 400 }: TaskFormProps) {

  const { isSuccess: profileSuccess } = usePostProfilesSearchQuery({})
  const { isSuccess: templateSuccess } = usePostTemplateSearchQuery({})

  usePostEmployeeSearchQuery({})
  useGetGroupsQuery()
  useGetRolesQuery()

  const employees: FilteredOptionsType[] = useAppSelector(state => selectAllEmployeeSelectOptions(state))
  const groups: FilteredOptionsType[] = useAppSelector(state => selectAllGroupSelectOptions(state))
  const roles: FilteredOptionsType[] = useAppSelector(state => selectAllRoleSelectOptions(state))

  const taskTemplates = useAppSelector(state => selectTemplatesByType(state, 4))
  console.log(taskTemplates)


  const [assignType, setAssigneeType] = useState<number>(0)
  const task = useAppSelector(state => selectTaskById(state, selectedTasks[0]))

  const { handleSubmit, reset, control, getValues, formState: { errors }, setValue } = useForm<FormValues>({ defaultValues, shouldUnregister: true })

  useEffect(() => {
    if (formMode === 1) {
      const task = store.getState().task.entities[selectedTasks[0]]
      if (task) {
        const { taskName, dueDate, assignedTo, notes, completedDate, rescheduleDate, status, profileId } = task
        reset({ ...values, taskName, dueDate: new Date(dueDate), assignedTo, notes, completedDate, rescheduleDate, status, profileId })
      }
    } else {
      reset({ ...defaultValues })
    }
  }, [formMode, profileId, reset, selectedTasks, task])

  const [createTask, { isLoading: createLoading }] = usePostTaskCreateMutation()
  const [updateTask, { isLoading: updateLoading }] = usePutTaskUpdateMutation()
  const [bulkUpdate, { isLoading: bulkLoading }] = usePutTasksBulkUpdateMutation()
  const [deleteTask, { isLoading: deleteLoading }] = useDeleteTaskMutation()

  const profiles = useAppSelector(selectAllProfiles)

  async function onSubmit(data: FormValues) {

    if (formMode === 0) {
      const currProfileId = calendarMode && data.profileId ? data.profileId : profileId
      const createData: TaskCreateType = { ...data, assignType, dueDate: data.dueDate.toISOString(), profileId: currProfileId }
      console.log(createData)

      const success = await createTask(createData)
      if (success) {
        toast.success("You successfully created a task")
      } handleClose()
    }

    if (formMode === 1 && task) {
      const updateData: TaskUpdateType = { ...data, taskId: task.taskId, assignType, profileId, status: data.status || task.status, dueDate: data.dueDate.toISOString() }
      const success = await updateTask(updateData)
      if (success) {
        toast.success("You successfully updated a task")
        handleClose()
      }
    }


    if (formMode > 1) {
      const bulkUpdateData: TaskBulkUpdateType = { ...data, taskIds: selectedTasks, status: data.status || defaultValues.status, assignType, dueDate: data.dueDate.toISOString() }
      const success = await bulkUpdate(bulkUpdateData)
      if (success) {
        toast.success("You successfully bulk updated a task")
        handleClose()
      }
    }
  }

  async function handleDelete() {
    const success = await deleteTask(selectedTasks[0])
    if (success) {
      toast.success("You successfully deleted task")
      handleClose()
    }
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
      <Box sx={{ mb: 6 }}>
        {formMode === 0 && (
          <Button disabled={createLoading} size='medium' variant='contained' sx={{ mr: 4 }} type="submit" >
            Create
          </Button>
        )}
        {formMode === 1 && (
          <>
            <Button disabled={updateLoading} size='medium' variant='contained' sx={{ mr: 2 }} type="submit">
              Update
            </Button>
            <Button
              disabled={deleteLoading}
              size='medium'
              variant='outlined'
              color='error'
              sx={{ mr: 2 }}
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
          </>
        )}
        {formMode > 1 && (
          <Button disabled={bulkLoading} size='medium' variant='contained' type="submit" sx={{ mr: 1 }}>
            Bulk Update
          </Button>
        )}
        <Button size='medium' variant='outlined' color='error' onClick={handleClose}>
          Cancel
        </Button>
      </Box>
    )
  }

  const selectedDataSource = [employees, groups, roles]


  const selectedDataSourceType = assignType === 0 ? "Employee"
    : assignType === 1 ? "Group"
      : "Role"


  function changeAssignee(idx: number) {
    const { profileId, taskName, notes, dueDate, status, completedDate, rescheduleDate } = getValues()
    reset({ profileId, taskName, notes, dueDate, status, completedDate, rescheduleDate, assignedTo: "" })
    setAssigneeType(idx)
  }

  function handleClose() {
    setOpenTaskModal(false)
  }


  return (
    <Drawer
      open={openTaskModal}
      onClose={handleClose}
      anchor='right'
      variant='temporary'
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', drawerWidth] } }}
    >
      <Header>
        <Typography variant='h6'>{DrawerTitles[formMode]}</Typography>
        <IconButton size='small' sx={{ color: 'text.primary' }} onClick={handleClose}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>

      <Box className='sidebar-body' sx={{ p: theme => theme.spacing(5, 6) }}>
        <DatePickerWrapper>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            {calendarMode && (
              <FormControl fullWidth sx={{ mb: 6 }}>
                <InputLabel id='profileId'>Profile</InputLabel>
                <Controller
                  name="profileId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      labelId='profileId'
                      label='Profile'
                      {...field}
                    >
                      {profileSuccess && profiles.map(p => (
                        <MenuItem key={p.profileId} value={p.profileId}>{p.firstName} {p.lastName}</MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.profileId && (
                  <FormHelperText sx={{ color: 'error.main' }} id='event-profileId-error'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            )}
            {formMode < 2 && (
              <FormControl fullWidth sx={{ mb: 6 }}>
                <InputLabel id='taskName'>Name</InputLabel>
                <Controller
                  name="taskName"
                  control={control}
                  render={({ field: { value } }) => (
                    <Select
                      labelId='taskName'
                      label='Name'
                      value={value}
                      onChange={(e) => {
                        const template = store.getState().template.entities[e.target.value]
                        if (template?.content) setValue("notes", template.content)
                        setValue('taskName', e.target.value)
                      }
                      }
                    >
                      {task && <MenuItem value={task.taskName}>{task.taskName}</MenuItem>}
                      {formMode === 0 && <MenuItem value="" disabled>Name</MenuItem>}

                      {templateSuccess && taskTemplates.map(t => {
                        const currTaskName = getValues("taskName")

                        return currTaskName === t.name ? "" : <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>
                      })}
                    </Select>
                  )}
                />
                {errors.profileId && (
                  <FormHelperText sx={{ color: 'error.main' }} id='event-profileId-error'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            )}
            {/* {formMode < 2 && <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='taskName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField disabled={formMode === 2} label='Name' value={value} onChange={onChange} error={Boolean(errors.taskName)} />
                )}
              />
              {errors.taskName && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-taskName-error'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>} */}
            <Box sx={{ mb: 6 }}>
              <Controller
                control={control}
                rules={{ required: true }}
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
              {errors.dueDate && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-dueDate-error'>
                  This field is required
                </FormHelperText>
              )}
            </Box>
            {formMode === 1 && <Box sx={{ mb: 6 }}>
              <Controller
                control={control}
                name="completedDate"

                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    selected={value ? new Date(value) : null}
                    id='event-completedDate'
                    onChange={(date) => onChange(date)}
                    dateFormat="MM/dd/yyyy"
                    customInput={<PickersComponent label='Completed Date' registername='completedDate' />}

                  />
                )}
              />
              {errors.completedDate && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-completedDate-error'>
                  This field is required
                </FormHelperText>
              )}
            </Box>}
            {formMode === 1 && <Box sx={{ mb: 6 }}>
              <Controller
                control={control}
                name="rescheduleDate"
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    selected={value ? new Date(value) : null}
                    id='event-rescheduleDate'
                    onChange={(date) => onChange(date)}
                    dateFormat="MM/dd/yyyy"
                    customInput={<PickersComponent label='Reschedule Date' registername='rescheduleDate' />}

                  />
                )}
              />
              {errors.rescheduleDate && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-rescheduleDate-error'>
                  This field is required
                </FormHelperText>
              )}
            </Box>}
            <Box sx={{ mb: 6, display: "grid", placeItems: 'center' }}>
              <ButtonGroup variant='contained'>
                {assignTypes.map((a, i) => (
                  <Button key={uuid()} onClick={(() => changeAssignee(i))}>{a}</Button>
                ))}
              </ButtonGroup>
            </Box>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel htmlFor='assignedTo'>Select {selectedDataSourceType}</InputLabel>
              <Controller
                name="assignedTo"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    label={`Select ${selectedDataSourceType}`}
                    labelId='assignedTo'
                    id='assignedTo'
                    error={Boolean(errors.assignedTo)}
                    {...field}
                  >
                    {formMode === 1 && (
                      <MenuItem value={values.assignedTo} disabled>
                        {task?.assignedToName || `Select ${selectedDataSourceType}`}
                      </MenuItem>
                    )}
                    {formMode !== 1 && (
                      <MenuItem value={""} >
                        Select {selectedDataSourceType}
                      </MenuItem>
                    )}

                    {selectedDataSource[assignType].map((option: FilteredOptionsType) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.assignedTo && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-assignedTo-error'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
            {formMode > 0 && (<FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel htmlFor='status'>Select Status</InputLabel>
              <Controller
                name="status"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    label="Select Status"
                    labelId='status'
                    id='status'
                    error={Boolean(errors.status)}
                    {...field}
                  >
                    <MenuItem value={undefined} disabled>
                      Select Status
                    </MenuItem>
                    {StatusValues.map((e, i) => (
                      <MenuItem key={uuid()} value={i}>
                        {e}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.status && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-status-error'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>)}
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='notes'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField label='Notes' multiline rows={4} value={value} onChange={onChange} error={Boolean(errors.taskName)} />
                )}
              />
              {errors.notes && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-notes-error'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <RenderSidebarFooter />
            </Box>
          </form>
        </DatePickerWrapper>
      </Box>
    </Drawer >

  )
}
