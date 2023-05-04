import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { TaskType } from './api/taskApiSlice'

const taskAdapter = createEntityAdapter({
  selectId: (task: TaskType) => task.taskId
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
