import { logOut, setCredentials, setInit } from '../authSlice'
import SolApi from './SolApi'
import { apiSlice } from './apiSlice'
import { EmployeeInfoType } from './employeeApiSlice'
import { ErrorResponseType, LunaResponseType } from './sharedTypes'
import { decode } from 'jsonwebtoken'

export type UserAuthType = {
  username: string
  password: string
}

export type UserAuthResponseType = {
  token: string | null
  refreshToken: string | null
  employee: EmployeeInfoType
  init?: boolean
}

export type TokenPayload = {
  Alias: string
  Email: string
  Name: string
  PhoneNumber: string
  UserId: string
  exp: number
  iat: number
  nameid: string
  nbf: number
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // ******************************************* POST user/auth/login
    postAuthLogin: builder.mutation<UserAuthResponseType | null, UserAuthType>({
      query: body => ({
        url: `/user/auth`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue): ErrorResponseType {
        return {
          status: baseQueryReturnValue.status,
          message: 'Invalid username/password provided',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        if (!res.success) return null

        SolApi.token = res.data.token
        const { data: employeeData, success: employeeSuccess } = await SolApi.GetEmployeeInfo(res.data.employeeId)

        if (!employeeSuccess) return null

        const result = {
          token: res.data.token,
          refreshToken: res.data.refreshToken,
          employee: employeeData
        }

        return result
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setCredentials(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in postAuthLogin:', error.message)
        }

        dispatch(setInit())
      }
    }),

    // ******************************************* POST user/revoke-token
    postAuthRevokeToken: builder.mutation<boolean | null, void>({
      query: () => ({
        url: `/user/revoke-token`,
        method: 'POST'
      }),
      transformErrorResponse(baseQueryReturnValue): ErrorResponseType {
        return {
          status: baseQueryReturnValue.status,
          message: 'Invalid username/password provided',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(logOut())
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in postAuthRevokeToken:', error.message)
        }
      }
    }),

    // ******************************************* POST user/auth/login
    postAuthRefreshToken: builder.query<UserAuthResponseType | null, undefined>({
      query: () => ({
        url: `/user/refresh-token`,
        method: 'POST'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'No refreshToken',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        if (!res.data) return null

        const payload = decode(res.data.token) as TokenPayload
        SolApi.token = res.data.token
        const { data: employeeData, success: employeeSuccess } = await SolApi.GetEmployeeInfo(payload.nameid)

        if (!employeeSuccess) return null

        const result = {
          token: res.data.token,
          refreshToken: res.data.refreshToken,
          employee: employeeData
        }

        return result
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setCredentials(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in postAuthLogin:', error.message)
        }

        dispatch(setInit())
      },
      providesTags: res => (res ? [{ type: 'AUTH', id: res.employee.userId }] : [])
    })
  })
})
