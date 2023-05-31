import { setEmployees, updateEmployee } from '../employeeSlice'
import { apiSlice } from './apiSlice'
import { ErrorResponseType, LunaResponseType, SearchFilterType } from './sharedTypes'

export type EmployeePhoneNumberType = {
  name: string
  phoneNumber: string
  order: number
  active: true
}

export type EmployeeEmailType = {
  name: string
  employee: string
  order: number
  active: true
}

export type EmployeeInfoType = {
  employeeId: string
  firstName: string
  lastName: string
  middleName: string
  employeeAlias: string
  alias?: string
  primaryEmail: string
  primaryPhone: string
  hasAuthentication: boolean | null
  companyId: string
  companyName: string
  active: boolean | null
  createdAt: string
  userId: string
  phoneNumbers: EmployeePhoneNumberType[] | []
  employeeAddresses: EmployeeEmailType[] | []
  companies: string[] | []
  permissions: string[] | []
  members: string[] | []
  roles: string[] | []
  groups: string[] | []
  allowedIps: string[] | []
}

export type EmployeeBasicType = {
  employeeId: string
  firstName: string
  lastName: string
  middleName: string
  alias: string
  primaryEmail: string
  primaryPhone: string
  userId: string
  phoneNumbers: EmployeePhoneNumberType[]
  employeeAddresses: EmployeeEmailType[]
}

export type EmployeeSnapshotType = {
  firstName: string
  lastName: string
  primaryEmail: string
  primaryPhone: string
}

export type EmployeeCreateType = {
  firstName: string
  lastName: string
  middleName?: string
  alias?: string
  primaryEmail: string
  primaryPhone: string
  companyId: string
}

export type EmployeeUpdateType = {
  employeeId: string
  firstName: string
  lastName: string
  middleName?: string
  alias?: string
  primaryEmail: string
  primaryPhone: string
  companyId: string
}

export type EmployeeGrantAuthType = {
  employeeId: string
  password: string
  roles: string[]
}

export const employeeApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // ***************************************************** GET employee/employeeId/info
    getEmployeeInfo: builder.query<EmployeeInfoType | null, string>({
      query: employeeId => ({
        url: `/employee/${employeeId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching employee info',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(employeeId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateEmployee(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getEmployeeInfo:', error.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'EMPLOYEE', id: arg }] : []
      }
    }),

    // ***************************************************** GET employee/employeeId/basic
    getEmployeeBasic: builder.query<EmployeeBasicType | null, string>({
      query: employeeId => ({
        url: `/employee/${employeeId}/basic`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching employee info',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(employeeId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateEmployee(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getEmployeeBasic:', error.message)
        }
      },
      providesTags: (result, error, arg) => {
        return [{ type: 'EMPLOYEE', id: arg }]
      }
    }),

    // ***************************************************** GET employee/employeeId/employee
    getEmployeeSnapshot: builder.query<EmployeeSnapshotType | null, string>({
      query: employeeId => ({
        url: `/employee/${employeeId}/snapshot`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching employee info',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(employeeId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateEmployee(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getEmployeeSnapshot:', error.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'EMPLOYEE', id: arg }] : []
      }
    }),

    // ***************************************************** POST employee/employeeId/employee
    postEmployeeSearch: builder.query<EmployeeInfoType[] | null, SearchFilterType | {}>({
      query: body => ({
        url: `/employee/search`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching employees',
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

          if (data) dispatch(setEmployees(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in postEmployeeSearch:', error.message)
        }
      },
      providesTags: result => {
        return result
          ? [{ type: 'EMPLOYEE', id: 'LIST' }, ...result.map(e => ({ type: 'EMPLOYEE' as const, id: e.employeeId }))]
          : []
      }
    }),

    // ***************************************************** POST employee
    postEmployeeCreate: builder.mutation<boolean, EmployeeCreateType>({
      query: body => ({
        url: `/employee`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating employee',
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
          console.error('API error in postEmployeeCreate:', error.message)
        }
      },
      invalidatesTags: result => {
        return result ? [{ type: 'EMPLOYEE', id: 'LIST' }] : []
      }
    }),

    // ***************************************************** POST employee/employeeId/employee
    postEmployeeGrantAuth: builder.mutation<boolean, EmployeeGrantAuthType>({
      query: params => {
        const { employeeId, ...body } = params

        return {
          url: `/employee/${employeeId}/grant-auth`,
          method: 'POST',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error authenticating employee',
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
          console.error('API error in postEmployeeGrantAuth:', error.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'EMPLOYEE', id: arg.employeeId }] : []
      }
    }),

    // ***************************************************** GET employee/employeeId/employee
    putEmployeeUpdate: builder.mutation<boolean, EmployeeUpdateType>({
      query: params => {
        const { employeeId, ...body } = params

        return {
          url: `/employee/${employeeId}`,
          method: 'PUT',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating employee',
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
          console.error('API error in putEmployeeUpdate:', error.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'EMPLOYEE', id: arg.employeeId }] : []
      }
    }),

    // ***************************************************** GET employee/employeeId/employee
    putEmployeeDisable: builder.mutation<boolean, string>({
      query: employeeId => {
        return {
          url: `/employee/${employeeId}/disable`,
          method: 'PUT'
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error disabling employee',
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
          console.error('API error in putEmployeeDisable:', error.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'EMPLOYEE', id: arg }] : []
      }
    }),

    // ***************************************************** GET employee/employeeId/employee
    putEmployeeEnable: builder.mutation<boolean, string>({
      query: employeeId => {
        return {
          url: `/employee/${employeeId}/enable`,
          method: 'PUT'
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error enabling employee',
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
          console.error('API error in putEmployeeEnable:', error.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'EMPLOYEE', id: arg }] : []
      }
    })
  })
})
