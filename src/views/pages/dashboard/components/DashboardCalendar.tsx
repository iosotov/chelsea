// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Types
// import { CalendarColors, CalendarFiltersType } from 'src/types/apps/calendarTypes'

// ** FullCalendar & App Components Imports
import Calendar, { blankEvent } from 'src/views/apps/calendar/Calendar'
import SidebarLeft from 'src/views/apps/calendar/SidebarLeft'
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import { ThemeColor } from 'src/@core/layouts/types'
import { useAppSelector } from 'src/store/hooks'
import { selectTasksByStatusTypes } from 'src/store/taskSlice'
import { store } from 'src/store/store'
import { EventType } from 'src/types/apps/calendarTypes'
import { TaskType } from 'src/store/api/taskApiSlice'
import AddTaskSidebar from 'src/views/apps/calendar/AddTaskSidebar'

type CalendarColors = {
  Open: ThemeColor
  Attempted: ThemeColor
  Completed: ThemeColor
}

// ** CalendarColors
const calendarsColor: CalendarColors = {
  Open: 'error',
  Attempted: 'primary',
  Completed: 'success',
}

const DashboardCalendar = () => {
  // ** States
  const [selectedTasks, setSelectedTasks] = useState<number[]>([0, 1, 2])
  const [selectedTask, setSelectedTask] = useState<TaskType | null>()
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [addTaskSidebarOpen, setAddTaskSidebarOpen] = useState<boolean>(false)
  const [updateTaskSidebarOpen, setUpdateTaskSidebarOpen] = useState<boolean>(false)

  console.log(selectedTask)

  const tasks = useAppSelector(state => selectTasksByStatusTypes(state, selectedTasks))



  // ** Hooks
  const { settings } = useSettings()

  // ** Vars
  const leftSidebarWidth = 260
  const addEventSidebarWidth = 400
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)


  // handle add task modal
  const handleAddTaskSidebarToggle = () => {
    setAddTaskSidebarOpen(!addTaskSidebarOpen)
  }

  // handle update task modal
  const handleUpdateTaskSidebarToggle = (taskId: string) => {
    const task = store.getState().task.entities[taskId]
    setSelectedTask(task)
    setUpdateTaskSidebarOpen(!addTaskSidebarOpen)
  }

  return (
    <CalendarWrapper
      className='app-calendar'
      sx={{
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
      }}
    >
      <SidebarLeft
        mdAbove={mdAbove}
        selectedTasks={selectedTasks}
        setSelectedTasks={setSelectedTasks}
        calendarsColor={calendarsColor}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarWidth={leftSidebarWidth}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleAddTaskSidebarToggle={handleAddTaskSidebarToggle}
      />
      <Box
        sx={{
          p: 5,
          pb: 0,
          flexGrow: 1,
          borderRadius: 1,
          boxShadow: 'none',
          backgroundColor: 'background.paper',
          ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})
        }}
      >
        <Calendar
          tasks={tasks}
          direction={direction}
          calendarsColor={calendarsColor}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          handleUpdateTaskSidebarToggle={handleUpdateTaskSidebarToggle}
          handleAddTaskSidebarToggle={handleAddTaskSidebarToggle}
        />
      </Box>
      <AddTaskSidebar
        drawerWidth={addEventSidebarWidth}
        addTaskSidebarOpen={addTaskSidebarOpen}
        handleAddTaskSidebarToggle={handleAddTaskSidebarToggle}
      />
      {/* <UpdateTaskSidebar
        drawerWidth={addEventSidebarWidth}
        setSelectedTask={setSelectedTask}
        selectedTask={selectedTask}
        updateTaskSidebarOpen={updateTaskSidebarOpen}
        handleAddTaskSidebarToggle={handleAddTaskSidebarToggle}
      /> */}
    </CalendarWrapper>
  )
}

export default DashboardCalendar
