// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Redux Imports

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Types
// import { CalendarColors, CalendarFiltersType } from 'src/types/apps/calendarTypes'

// ** FullCalendar & App Components Imports
import Calendar from 'src/views/apps/calendar/Calendar'
import SidebarLeft from 'src/views/apps/calendar/SidebarLeft'
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import { ThemeColor } from 'src/@core/layouts/types'
import { useAppSelector } from 'src/store/hooks'
import { selectTasksByStatusTypes } from 'src/store/taskSlice'
import { TaskForm } from '../../user/view/components/task/TaskForm'

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
  const [selectedTask, setSelectedTask] = useState<string[]>([])
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [addTaskSidebarOpen, setAddTaskSidebarOpen] = useState<boolean>(false)


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
        setSelectedTask={setSelectedTask}
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
          setSelectedTask={setSelectedTask}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          handleAddTaskSidebarToggle={handleAddTaskSidebarToggle}
        />
      </Box>
      <TaskForm drawerWidth={addEventSidebarWidth} formMode={selectedTask.length} calendarMode={true} openTaskModal={addTaskSidebarOpen} setOpenTaskModal={setAddTaskSidebarOpen} selectedTasks={selectedTask} />
    </CalendarWrapper>
  )
}

export default DashboardCalendar
