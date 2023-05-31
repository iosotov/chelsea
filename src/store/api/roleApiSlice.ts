import { setRoles, updateRolePermissions, updateRoles } from '../roleSlice'
import { apiSlice } from './apiSlice'
import { PermissionType } from './permissionApiSlice'
import { ErrorResponseType, LunaResponseType, SearchFilterType } from './sharedTypes'

export type RoleType = {
  roleId: string
  name: string
  description?: string
  permissionIds: string[]
}

export type RoleUpdateType = {
  roleId: string
  name: string
  description?: string
}

export type RoleCreateType = {
  roleId?: string
  name: string
  description?: string
}

export type RolePermissionsType = {
  roleId: string
  permissions: PermissionType[]
}

export type RolePermissionPostType = {
  roleId: string
  permissions: string[]
}

export const roleApiSlice = apiSlice.injectEndpoints({
  // ****************************************************************** GET role/roleId/info
  endpoints: builder => ({
    getRole: builder.query<RoleType | null, string>({
      query: roleId => ({
        url: `/role/${roleId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching role information',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(roleId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateRoles([data]))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getRole:', error.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'ROLE', id: arg }] : []
      }
    }),

    // ****************************************************************** GET role/roleId/permission
    getRolePermissions: builder.query<RolePermissionsType | null, string>({
      query: roleId => ({
        url: `/role/${roleId}/permission`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating role permissions',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) return null
        const result: RolePermissionsType = { roleId: arg, permissions: res.data }

        return result
      },
      async onQueryStarted(roleId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateRolePermissions([data]))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getRolePermissions:', error.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'ROLE', id: arg }] : []
      }
    }),

    // ****************************************************************** GET role/all
    getRoles: builder.query<RoleType[] | null, void>({
      query: () => ({
        url: `/role/all`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching roles',
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

          if (data) dispatch(setRoles(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getRoles:', error.message)
        }
      },
      providesTags: result => {
        return result
          ? [{ type: 'ROLE', id: 'LIST' }, ...result.map(p => ({ type: 'ROLE' as const, id: p.roleId }))]
          : []
      }
    }),

    // ****************************************************************** POST role/search
    postRoleSearch: builder.query<RoleType[] | null, SearchFilterType>({
      query: body => {
        return {
          url: `/role/search`,
          method: 'POST',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching roles',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data.data
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setRoles(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in postRoleSearch:', error.message)
        }
      }
    }),

    // ****************************************************************** POST role
    postRoleCreate: builder.mutation<boolean, RoleCreateType>({
      query: body => {
        return {
          url: `/role`,
          method: 'POST',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating role',
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
          console.error('API error in postRoleCreate:', error.message)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'ROLE', id: 'LIST' }] : [])
    }),

    // ****************************************************************** POST role/roleId/assign-permission
    postRoleAssignPermissions: builder.mutation<boolean, RolePermissionPostType>({
      query: body => {
        return {
          url: `/role/${body.roleId}/assign-permissions`,
          method: 'POST',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error assigning permission',
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
          console.error('API error in postRoleAssignPermissions:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'ROLE', id: arg.roleId }] : [])
    }),

    // ****************************************************************** PUT role/roleId
    putRoleUpdate: builder.mutation<boolean, RoleUpdateType>({
      query: params => {
        const { roleId, ...body } = params

        return {
          url: `/role/${roleId}`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating role',
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
          console.error('API error in putRoleUpdate:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'ROLE', id: arg.roleId }] : [])
    }),

    // ****************************************************************** DELETE role/roleId
    deleteRole: builder.mutation<boolean, string>({
      query: roleId => {
        return {
          url: `/role/${roleId}`,
          method: 'DELETE'
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error deleting role',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(roleId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in deleteRole:', error.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'ROLE', id: arg }] : [])
    })
  })
})
