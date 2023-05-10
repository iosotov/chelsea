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
  employees?: string[]
}

export type GroupCreateType = {
  name: string
  description: string
}

export const groupApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getGroup: builder.query<GroupType, string>({
      query: groupId => ({
        url: `/group/${groupId}/basic`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching group information')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(groupId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateGroup(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'GROUP', id: arg }] : []
      }
    }),
    getGroups: builder.query<GroupType[], undefined>({
      query: () => ({
        url: `/group/all`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching groups')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(setGroups(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: result => {
        return result
          ? [{ type: 'GROUP', id: 'LIST' }, ...result.map(g => ({ type: 'GROUP' as const, id: g.groupId }))]
          : []
      }
    }),
    createGroup: builder.mutation<string, GroupCreateType>({
      query: body => {
        return {
          url: `/group`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating group')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'GROUP', id: 'LIST' }] : [])
    }),
    updateGroup: builder.mutation<string, GroupUpdateType>({
      query: params => {
        const { groupId, ...body } = params
        console.log(body)

        return {
          url: `/group/${groupId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error updating group information')

        console.log(arg.groupId)

        return arg.groupId
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
      invalidatesTags: res => (res ? [{ type: 'GROUP', id: res }] : [])
    }),
    deleteGroup: builder.mutation<string, string>({
      query: groupId => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return {
          url: `/group/${groupId}`,
          method: 'DELETE'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error deleting group')

        return arg
      },
      async onQueryStarted(groupId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'GROUP', id: res }] : [])
    })
  })
})
