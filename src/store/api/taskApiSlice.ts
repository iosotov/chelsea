import { deleteTask } from '../taskSlice'
import { setTasks, updateTasks } from '../taskSlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType, SearchFilterType } from './sharedTypes'

export type TaskType = {
  taskId: string
  taskName: string
  status: number
  statusName: string
  dueDate: string
  assignedTo: string
  assignedToName: string
  notes: string
  completedDate: string
  rescheduleDate: string
  profileId: string
  liabilityId: string
  createdBy: string
  createdCompanyId: string
  createdCompanyName: string
  assignedCompanyId: string
  assignedCompanyName: string
}

export type TaskCreateType = {
  taskName: string
  dueDate: string
  assignedTo: string
  assignType?: number
  notes?: string
  liabilityId?: string
  profileId: string
}

export type TaskUpdateType = {
  taskId: string
  taskName: string
  status: TaskStatusEnum
  dueDate: string
  assignedTo: string
  assignType?: number
  notes?: string

  // I need profile ID to invalidate the proper tags
  profileId: string
  completedDate?: string
  rescheduleDate?: string
}

export type TaskBulkUpdateType = {
  taskIds: string[]
  status: number
  dueDate: string
  notes: string
  assignedTo: string
}

export enum TaskStatusEnum {
  'Open',
  'Attempted',
  'Completed',
  'Closed'
}

export const taskApiSlice = apiSlice.injectEndpoints({
  // ****************************************************************** GET task/taskId/info
  endpoints: builder => ({
    getTask: builder.query<TaskType | null, string>({
      query: taskId => ({
        url: `/task/${taskId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching task',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(taskId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateTasks([data]))
        } catch (err: any) {
          console.error('API error in getTask:', err.error.data.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'TASK', id: arg }] : []
      }
    }),

    // ****************************************************************** GET task/profileId/profile
    getProfileTasks: builder.query<TaskType[] | null, string>({
      query: profileId => ({
        url: `/task/${profileId}/profile`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching profile tasks',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(taskId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateTasks(data))
        } catch (err: any) {
          console.error('API error in getProfileTasks:', err.error.data.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result
          ? [{ type: 'TASK', id: arg }, ...result.map(task => ({ type: 'TASK' as const, id: task.taskId }))]
          : []
      }
    }),

    // ****************************************************************** POST task/profileId/profile
    postTaskCreate: builder.mutation<boolean, TaskCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/task/${profileId}/profile`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating task',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postTaskCreate:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'TASK', id: arg.profileId },
              { type: 'TASK', id: 'LIST' }
            ]
          : []
    }),

    // ****************************************************************** POST task/search
    postTaskSearch: builder.query<TaskType[] | null, SearchFilterType>({
      query: body => {
        return {
          url: `/task/search`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error searching task',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setTasks(data))
        } catch (err: any) {
          console.error('API error in postTaskSearch:', err.error.data.message)
        }
      },
      providesTags: res =>
        res ? [{ type: 'TASK', id: 'LIST' }, ...res.map(task => ({ type: 'TASK' as const, id: task.taskId }))] : []
    }),

    // ****************************************************************** PUT task/taskId
    putTaskUpdate: builder.mutation<boolean, TaskUpdateType>({
      query: params => {
        const { taskId, ...body } = params

        return {
          url: `/task/${taskId}`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating task',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putTaskUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'TASK', id: arg.taskId },
              { type: 'TASK', id: arg.profileId }
            ]
          : []
    }),

    // ****************************************************************** DELETE task/taskId
    deleteTask: builder.mutation<boolean, string>({
      query: taskId => {
        return {
          url: `/task/${taskId}`,
          method: 'DELETE'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error deleting task',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(deleteTask(data))
        } catch (err: any) {
          console.error('API error in deleteTask:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'TASK', id: 'LIST' },
              { type: 'TASK', id: arg }
            ]
          : []
    }),

    // ****************************************************************** PUT task/task-update
    putTasksBulkUpdate: builder.mutation<boolean, TaskBulkUpdateType>({
      query: body => {
        return {
          url: `/task/bulk-update`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error bulk updating tasks',
          data: baseQueryReturnValue.data
        }
      },

      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putTasksBulkUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res ? [{ type: 'TASK', id: 'LIST' }, ...arg.taskIds.map(id => ({ type: 'TASK' as const, id }))] : []
    })
  })
})
