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
  taskStatus: TaskStatusEnum
  dueDate: string
  assignedTo: string
  assignType?: number
  notes?: string
  liabilityId?: string
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
  endpoints: builder => ({
    getTask: builder.query<TaskType, string>({
      query: taskId => ({
        url: `/task/${taskId}/info`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching task')

        return res.data
      },
      async onQueryStarted(taskId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)

          dispatch(updateTasks([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'TASK', id: arg }] : []
      }
    }),
    getProfileTasks: builder.query<TaskType[], string>({
      query: profileId => ({
        url: `/task/${profileId}/profile`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching profile tasks')

        return res.data
      },
      async onQueryStarted(taskId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)

          dispatch(updateTasks(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result
          ? [{ type: 'TASK', id: arg }, ...result.map(task => ({ type: 'TASK' as const, id: task.taskId }))]
          : []
      }
    }),
    postCreateTask: builder.mutation<string, TaskCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/task/${profileId}/profile/`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating task')

        return res.data
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
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
    postSearchTask: builder.query<TaskType[], SearchFilterType>({
      query: body => {
        return {
          url: `/task/search`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating task')

        return res.data.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setTasks(data))

          // console.log(data)
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: res =>
        res ? [{ type: 'TASK', id: 'LIST' }, ...res.map(task => ({ type: 'TASK' as const, id: task.taskId }))] : []
    }),
    putUpdateTask: builder.mutation<boolean, TaskUpdateType>({
      query: params => {
        const { taskId, ...body } = params

        return {
          url: `/task/${taskId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error updating task')
        console.log(res.data)

        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
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
    deleteTask: builder.mutation<string, string>({
      query: taskId => {
        return {
          url: `/task/${taskId}`,
          method: 'DELETE'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error updating task')
        console.log(res.data)

        return arg
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(deleteTask(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
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
    putBulkUpdateTasks: builder.mutation<boolean, TaskBulkUpdateType>({
      query: body => {
        return {
          url: `/task/bulk-update`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error bulk updating tasks')
        console.log(res.data)

        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res ? [{ type: 'TASK', id: 'LIST' }, ...arg.taskIds.map(id => ({ type: 'TASK' as const, id }))] : []
    })
  })
})
