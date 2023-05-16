import { updateUser } from '../userSlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType } from './sharedTypes'

export type UserType = {
  userId: string
  roles: string[]
  active: boolean
}

export type UserPermissionsType = {
  userId: string
  permissions: string[]
}

export type UserUpdateType = {
  userId: string
  password: string
  roles: string[]
  employeeId: string
}

export type UserRolesUpdateType = {
  userId: string
  roleIds: string[]
}

export type UserPasswordUpdateType = {
  userId: string
  password: string
}

export type UserCreateType = {
  firstName: string
  lastName: string
  middleName?: string
  alias?: string
  primaryEmail: string
  primaryPhone: string
  companyId: string
  password: string
  roles: string[]
}

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // ****************************************************************** GET user/userId
    getUser: builder.query<UserType | [], string>({
      query: userId => ({
        url: `/user/${userId}`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching users',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateUser(data))
        } catch (err: any) {
          console.error('API error in getUser:', err.error.data.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'USER', id: arg }] : []
      }
    }),

    // ****************************************************************** POST user
    postUserCreate: builder.mutation<boolean, UserCreateType>({
      query: body => {
        return {
          url: `/user`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating user',
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
          console.error('API error in postUserCreate:', err.error.data.message)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'EMPLOYEE', id: 'LIST' }] : [])
    }),

    // ****************************************************************** PUT user/userId
    putUserUpdate: builder.mutation<boolean, UserUpdateType>({
      query: params => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { employeeId, userId, ...body } = params

        return {
          url: `/user/${userId}`,
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
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putUserUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'USER', id: arg.userId },
              { type: 'EMPLOYEE', id: arg.employeeId }
            ]
          : []
    }),

    // ****************************************************************** PUT user/userId/disable`
    putUserDisable: builder.mutation<boolean, string>({
      query: userId => {
        return {
          url: `/user/${userId}/disable`,
          method: 'PUT'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error disabling user',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(userId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putUserDisable:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'USER', id: arg },
              { type: 'EMPLOYEE', id: 'LIST' }
            ]
          : []
    }),

    // ****************************************************************** PUT user/userId/enable`
    putUserEnable: builder.mutation<boolean, string>({
      query: userId => {
        return {
          url: `/user/${userId}/enable`,
          method: 'PUT'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error bulk enabling user',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(userId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putUserEnable:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'USER', id: arg },
              { type: 'EMPLOYEE', id: 'LIST' }
            ]
          : []
    }),

    // ****************************************************************** PUT user/userId/roles`
    putUserRoleUpdate: builder.mutation<boolean, UserRolesUpdateType>({
      query: params => {
        const { userId, ...body } = params

        return {
          url: `/user/${userId}/roles`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating user roles',
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
          console.error('API error in putUserRoleUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'USER', id: arg.userId },
              { type: 'EMPLOYEE', id: 'LIST' }
            ]
          : []
    }),

    // ****************************************************************** PUT user/userId/roles`
    putUserPasswordUpdate: builder.mutation<boolean, UserPasswordUpdateType>({
      query: params => {
        const { userId, ...body } = params

        return {
          url: `/user/${userId}/password`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating user password',
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
          console.error('API error in getRole:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'USER', id: arg.userId },
              { type: 'EMPLOYEE', id: 'LIST' }
            ]
          : []
    })
  })
})
