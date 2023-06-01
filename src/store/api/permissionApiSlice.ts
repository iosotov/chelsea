import { setPermissions, updatePermission } from '../permissionSlice'
import { apiSlice } from './apiSlice'
import { ErrorResponseType, LunaResponseType } from './sharedTypes'

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
    // ***************************************************** GET permission/permissionId/info
    getPermission: builder.query<PermissionType | null, string>({
      query: permissionId => ({
        url: `/permission/${permissionId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching permission',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(permissionId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updatePermission(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getPermission:', error.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'PERMISSION', id: arg }] : []
      }
    }),

    // ***************************************************** GET permission/permission/all
    getPermissions: builder.query<PermissionType[] | null, undefined>({
      query: () => ({
        url: `/permission/all`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching permissions',
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

          if (data) dispatch(setPermissions(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getPermissions:', error.message)
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

    // ***************************************************** POST permission
    postPermissionCreate: builder.mutation<boolean, PermissionCreateType>({
      query: body => {
        return {
          url: `/permission`,
          method: 'POST',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating permission',
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
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in postPermissionCreate:', error.message)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'PERMISSION', id: 'LIST' }] : [])
    }),

    // ***************************************************** PUT permission/permissionId
    putPermissionUpdate: builder.mutation<boolean, PermissionUpdateType>({
      query: params => {
        const { permissionId, ...body } = params

        return {
          url: `/permission/${permissionId}`,
          method: 'PUT',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating permission',
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
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in putPermissionUpdate:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'PERMISSION', id: arg.permissionId }] : [])
    }),

    // ***************************************************** DELETE permission/permissionId
    deletePermission: builder.mutation<boolean, string>({
      query: permissionId => {
        return {
          url: `/permission/${permissionId}`,
          method: 'DELETE'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error deleting permission',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(permissionId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in deletePermission:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'PERMISSION', id: arg }] : [])
    })
  })
})
