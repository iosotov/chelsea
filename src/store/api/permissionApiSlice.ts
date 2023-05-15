import { setPermissions, updatePermission } from '../permissionSlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType } from './sharedTypes'

export type PermissionType = {
  permissionId: string
  description: string
  permissionCode: string
  parentPermissionCode: string
}

export type PermissionUpdateType = {
  permissionId: string
  name: string
  description?: string
  permissionCode: string
  parentPermissionId?: string
}

export type PermissionCreateType = {
  permissionId: string
  name: string
  description?: string
  permissionCode: string
  parentPermissionId?: string
}

export const permissionApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPermission: builder.query<PermissionType, string>({
      query: permissionId => ({
        url: `/permission/${permissionId}/info`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching permission information')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(permissionId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(updatePermission(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'PERMISSION', id: arg }] : []
      }
    }),
    getPermissions: builder.query<PermissionType[], undefined>({
      query: () => ({
        url: `/permission/all`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching permissions')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(setPermissions(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: result => {
        return result
          ? [
              { type: 'PERMISSION', id: 'LIST' },
              ...result.map(p => ({ type: 'PERMISSION' as const, id: p.permissionId }))
            ]
          : []
      }
    }),
    postPermissionCreate: builder.mutation<string, PermissionCreateType>({
      query: body => {
        return {
          url: `/permission`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating permission')
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
      invalidatesTags: res => (res ? [{ type: 'PERMISSION', id: 'LIST' }] : [])
    }),
    putPermissionUpdate: builder.mutation<string, PermissionUpdateType>({
      query: params => {
        const { permissionId, ...body } = params
        console.log(body)

        return {
          url: `/permission/${permissionId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error updating permission information')

        console.log(arg.permissionId)

        return arg.permissionId
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
      invalidatesTags: res => (res ? [{ type: 'PERMISSION', id: res }] : [])
    }),
    deletePermission: builder.mutation<string, string>({
      query: permissionId => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return {
          url: `/permission/${permissionId}`,
          method: 'DELETE'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error deleting permission')

        return arg
      },
      async onQueryStarted(permissionId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'PERMISSION', id: res }] : [])
    })
  })
})
