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
    getUser: builder.query<UserType, string>({
      query: userId => ({
        url: `/user/${userId}`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching user information')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateUser(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'USER', id: arg }] : []
      }
    }),
    postUserCreate: builder.mutation<string, UserCreateType>({
      query: body => {
        return {
          url: `/user`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating user')
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
      invalidatesTags: res => (res ? [{ type: 'EMPLOYEE', id: 'LIST' }] : [])
    }),
    putUserUpdate: builder.mutation<string, UserUpdateType>({
      query: params => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { employeeId, userId, ...body } = params

        return {
          url: `/user/${userId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error updating user information')

        console.log(arg.userId)

        return arg.userId
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
              { type: 'USER', id: res },
              { type: 'EMPLOYEE', id: arg.employeeId }
            ]
          : []
    }),
    putUserDisable: builder.mutation<string, string>({
      query: userId => {
        return {
          url: `/user/${userId}/disable`,
          method: 'PUT'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error disabling user')

        return arg
      },
      async onQueryStarted(userId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res =>
        res
          ? [
              { type: 'USER', id: res },
              { type: 'EMPLOYEE', id: 'LIST' }
            ]
          : []
    }),
    putUserEnable: builder.mutation<string, string>({
      query: userId => {
        return {
          url: `/user/${userId}/enable`,
          method: 'PUT'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error enabling user')

        return arg
      },
      async onQueryStarted(userId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res =>
        res
          ? [
              { type: 'USER', id: res },
              { type: 'EMPLOYEE', id: 'LIST' }
            ]
          : []
    }),
    putUserRoleUpdate: builder.mutation<string, UserRolesUpdateType>({
      query: params => {
        const { userId, ...body } = params

        return {
          url: `/user/${userId}/roles`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error updating user roles')

        return arg.userId
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
      invalidatesTags: res =>
        res
          ? [
              { type: 'USER', id: res },
              { type: 'EMPLOYEE', id: 'LIST' }
            ]
          : []
    }),
    putUserPasswordUpdate: builder.mutation<string, UserPasswordUpdateType>({
      query: params => {
        const { userId, ...body } = params

        return {
          url: `/user/${userId}/password`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error enabling user')

        return arg.userId
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
      invalidatesTags: res =>
        res
          ? [
              { type: 'USER', id: res },
              { type: 'EMPLOYEE', id: 'LIST' }
            ]
          : []
    })
  })
})
