import { setRoles, updateRolePermissions, updateRoles } from '../roleSlice'
import { apiSlice } from './apiSlice'
import { PermissionType } from './permissionApiSlice'
import { LunaResponseType, SearchFilterType } from './sharedTypes'

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
  endpoints: builder => ({
    getRole: builder.query<RoleType, string>({
      query: roleId => ({
        url: `/role/${roleId}/info`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching role information')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(roleId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateRoles([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'ROLE', id: arg }] : []
      }
    }),
    getRolePermissions: builder.query<RolePermissionsType, string>({
      query: roleId => ({
        url: `/role/${roleId}/permission`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error fetching role information')
        const result: RolePermissionsType = { roleId: arg, permissions: res.data }

        return result
      },
      async onQueryStarted(roleId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateRolePermissions([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'ROLE', id: arg }] : []
      }
    }),
    getRoles: builder.query<RoleType[], undefined>({
      query: () => ({
        url: `/role/all`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching roles')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(setRoles(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: result => {
        return result
          ? [{ type: 'ROLE', id: 'LIST' }, ...result.map(p => ({ type: 'ROLE' as const, id: p.roleId }))]
          : []
      }
    }),
    postRoleSearch: builder.query<RoleType[], SearchFilterType>({
      query: body => {
        return {
          url: `/role/search`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching roles')
        console.log(res.data)

        return res.data.data
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setRoles(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    }),
    postRoleCreate: builder.mutation<string, RoleCreateType>({
      query: body => {
        return {
          url: `/role`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating role')
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
      invalidatesTags: res => (res ? [{ type: 'ROLE', id: 'LIST' }] : [])
    }),
    postRoleAssignPermissions: builder.mutation<string, RolePermissionPostType>({
      query: body => {
        return {
          url: `/role/${body.roleId}/assign-permissions`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error assigning permissions to role')
        console.log(res.data)

        return arg.roleId
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
      invalidatesTags: res => (res ? [{ type: 'ROLE', id: res }] : [])
    }),
    putRoleUpdate: builder.mutation<string, RoleUpdateType>({
      query: params => {
        const { roleId, ...body } = params
        console.log(body)

        return {
          url: `/role/${roleId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error updating role information')

        console.log(arg.roleId)

        return arg.roleId
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
      invalidatesTags: res => (res ? [{ type: 'ROLE', id: res }] : [])
    }),
    deleteRole: builder.mutation<string, string>({
      query: roleId => {
        return {
          url: `/role/${roleId}`,
          method: 'DELETE'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error deleting role')

        return arg
      },
      async onQueryStarted(roleId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'ROLE', id: res }] : [])
    })
  })
})
