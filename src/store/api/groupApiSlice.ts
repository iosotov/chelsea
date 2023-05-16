import { setGroups, updateGroup } from '../groupSlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType } from './sharedTypes'

export type GroupType = {
  groupId: string
  name: string
  description: string
  employees: string[]
}

export type GroupUpdateType = {
  groupId: string
  name: string
  description: string
  employeeIds?: string[]
}

export type GroupCreateType = {
  name: string
  description: string
}

export const groupApiSlice = apiSlice.injectEndpoints({
  // ***************************************************** GET group/groupId/basic
  endpoints: builder => ({
    getGroup: builder.query<GroupType | null, string>({
      query: groupId => ({
        url: `/group/${groupId}/basic`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching group information',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(groupId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateGroup(data))
        } catch (err: any) {
          console.error('API error in getGroup:', err.error.data.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'GROUP', id: arg }] : []
      }
    }),

    // ***************************************************** GET group/all
    getGroups: builder.query<GroupType[] | null, undefined>({
      query: () => ({
        url: `/group/all`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching groups',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setGroups(data))
        } catch (err: any) {
          console.error('API error in getGroups:', err.error.data.message)
        }
      },
      providesTags: result => {
        return result
          ? [{ type: 'GROUP', id: 'LIST' }, ...result.map(g => ({ type: 'GROUP' as const, id: g.groupId }))]
          : []
      }
    }),

    // ***************************************************** GET group/profileId/profile
    postGroupCreate: builder.mutation<boolean, GroupCreateType>({
      query: body => {
        return {
          url: `/group`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating group',
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
          console.error('API error in postGroupCreate:', err.error.data.message)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'GROUP', id: 'LIST' }] : [])
    }),

    // ***************************************************** GET group/profileId/profile
    putGroupUpdate: builder.mutation<boolean, GroupUpdateType>({
      query: params => {
        const { groupId, ...body } = params
        console.log(body)

        return {
          url: `/group/${groupId}`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating group',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.data
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putGroupUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'GROUP', id: arg.groupId }] : [])
    }),

    // ***************************************************** GET group/profileId/profile
    deleteGroup: builder.mutation<boolean, string>({
      query: groupId => {
        return {
          url: `/group/${groupId}`,
          method: 'DELETE'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error deleting group',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(groupId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in deleteGroup:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'GROUP', id: arg }] : [])
    })
  })
})
