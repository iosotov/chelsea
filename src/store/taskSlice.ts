import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { startOfWeek, endOfWeek, isWithinInterval, getDay, parseISO } from 'date-fns'

import { RootState } from './store'
import { TaskType } from './api/taskApiSlice'

const taskAdapter = createEntityAdapter({
  selectId: (task: TaskType) => task.taskId,
  sortComparer: (a: TaskType, b: TaskType) => {
    const dateA = new Date(a.dueDate)
    const dateB = new Date(b.dueDate)

    return dateB.getTime() - dateA.getTime()
  }
})

const initialState = taskAdapter.getInitialState()

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      taskAdapter.setAll(state, action.payload)
    },
    updateTasks: (state, action) => {
      taskAdapter.upsertMany(state, action.payload)
    },
    deleteTask: (state, action) => {
      taskAdapter.removeOne(state, action.payload)
    }
  }
})

export const { setTasks, updateTasks, deleteTask } = taskSlice.actions

export default taskSlice.reducer

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds
} = taskAdapter.getSelectors((state: RootState) => state.task)

export const selectTaskEntities = (state: RootState) => state.task.entities

export const selectTaskByProfileId = createSelector(
  selectAllTasks,
  (_: RootState, profileId: string) => profileId,
  (tasks, profileId) => {
    return tasks.filter(task => task.profileId === profileId)
  }
)

export const selectCompletedTasksForCurrentWeek = createSelector(selectAllTasks, tasks => {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday
  const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 }) // Sunday

  // Filter tasks that were completed this week
  const completedTasksThisWeek = tasks.filter((task: TaskType) => {
    if (task.completedDate) {
      const completedDate = parseISO(task.completedDate)

      return isWithinInterval(completedDate, { start: currentWeekStart, end: currentWeekEnd })
    }

    return false
  })

  // Array to hold task counts for Monday through Friday
  const weeklyTasks: number[] = new Array(5).fill(0)

  // Populate the weeklyTasks array
  completedTasksThisWeek.forEach((task: TaskType) => {
    const completedDate = parseISO(task.completedDate!)
    const dayOfWeek = getDay(completedDate) - 1 // subtract 1 because getDay() returns 1 for Monday and we need 0

    if (dayOfWeek >= 0 && dayOfWeek <= 4) {
      // Monday through Friday
      weeklyTasks[dayOfWeek]++
    }
  })

  return weeklyTasks
})

export const selectTaskCountByStatus = createSelector(selectAllTasks, tasks => {
  const count = [0, 0, 0]

  for (const task of tasks) {
    if (task.status === 0) {
      count[0] += 1
    } else if (task.status === 1) {
      count[1] += 1
    } else if (task.status === 2) {
      count[2] += 1
    }
  }

  return count
})

export const selectTasksByStatusTypes = createSelector(
  selectAllTasks,
  (_: RootState, statusTypes: number[]) => statusTypes,
  (tasks, statusTypes) => {
    if (!statusTypes.length) return []
    if (statusTypes.length === 3) return tasks

    return tasks.filter(task => statusTypes.includes(task.status))
  }
)

export const selectTasksByStatus = createSelector(
  selectAllTasks,
  (_: RootState, statusType: number) => statusType,
  (tasks, statusType) => {
    if (statusType < 0) return tasks

    return tasks.filter(t => t.status === statusType)
  }
)

export const selectTasksByStatusAndAssignee = createSelector(
  selectAllTasks,
  (_: RootState, statusType: number, assignee: string) => ({ statusType, assignee }),
  (tasks, { statusType, assignee }) => {
    if (statusType < 0 && !assignee) return tasks
    if (statusType < 0 && assignee) return tasks.filter(t => t.assignedTo === assignee)
    if (!assignee) return tasks.filter(t => t.status === statusType)
    if (!statusType) return tasks.filter(t => t.assignedTo === assignee)

    return tasks.filter(t => t.status === statusType && t.assignedTo === assignee)
  }
)
