import { setEmployees, updateEmployee } from '../employeeSlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType, SearchFilterType } from './sharedTypes'

export type EmployeePhoneNumberType = {
  name: string
  phoneNumber: string
  order: number
  active: true
}

export type EmployeeEmailType = {
  name: string
  email: string
  order: number
  active: true
}

export type EmployeeInfoType = {
  employeeId: string
  firstName: string
  lastName: string
  middleName: string
  alias: string
  primaryEmail: string
  primaryPhone: string
  hasAuthentication: boolean
  companyId: string
  companyName: string
  active: boolean
  createdAt: string
  userId: string
  phoneNumbers: EmployeePhoneNumberType[]
  emailAddresses: EmployeeEmailType[]
  companies: string[]
  permissions: string[]
  members: string[]
  roles: string[]
  groups: string[]
  allowedIps: string[]
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
  emailAddresses: EmployeeEmailType[]
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
    getEmployeeInfo: builder.query<EmployeeInfoType, string>({
      query: employeeId => ({
        url: `/employee/${employeeId}/info`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching employee info')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(employeeId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateEmployee(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'EMPLOYEE', id: arg }] : []
      }
    }),
    getEmployeeBasic: builder.query<EmployeeBasicType, string>({
      query: employeeId => ({
        url: `/employee/${employeeId}/basic`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching employee info')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(employeeId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateEmployee(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return [{ type: 'EMPLOYEE', id: arg }]
      }
    }),
    getEmployeeSnapshot: builder.query<EmployeeSnapshotType, string>({
      query: employeeId => ({
        url: `/employee/${employeeId}/snapshot`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching employee info')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(employeeId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateEmployee(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'EMPLOYEE', id: arg }] : []
      }
    }),
    postEmployeeSearch: builder.query<EmployeeInfoType[], SearchFilterType | {}>({
      query: body => ({
        url: `/employee/search`,
        method: 'POST',
        body
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching employees')

        return res.data.data
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(setEmployees(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: result => {
        return result
          ? [{ type: 'EMPLOYEE', id: 'LIST' }, ...result.map(e => ({ type: 'EMPLOYEE' as const, id: e.employeeId }))]
          : []
      }
    }),
    postEmployeeCreate: builder.mutation<EmployeeInfoType[], EmployeeCreateType>({
      query: body => ({
        url: `/employee`,
        method: 'POST',
        body
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating employee')
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
      invalidatesTags: result => {
        return result ? [{ type: 'EMPLOYEE', id: 'LIST' }] : []
      }
    }),
    postEmployeeGrantAuth: builder.mutation<string, EmployeeGrantAuthType>({
      query: params => {
        const { employeeId, ...body } = params

        return {
          url: `/employee/${employeeId}/grant-auth`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error granting employee authorization')
        console.log(res.data)

        return arg.employeeId
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
      invalidatesTags: result => {
        return result ? [{ type: 'EMPLOYEE', id: result }] : []
      }
    }),
    putEmployeeUpdate: builder.mutation<string, EmployeeUpdateType>({
      query: params => {
        const { employeeId, ...body } = params

        return {
          url: `/employee/${employeeId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error updating employee information')
        console.log(res.data)

        return arg.employeeId
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
      invalidatesTags: result => {
        return result ? [{ type: 'EMPLOYEE', id: result }] : []
      }
    }),
    putEmployeeDisable: builder.mutation<string, string>({
      query: employeeId => {
        return {
          url: `/employee/${employeeId}/disable`,
          method: 'PUT'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error disabling employee')
        console.log(res.data)

        return arg
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
      invalidatesTags: result => {
        return result ? [{ type: 'EMPLOYEE', id: result }] : []
      }
    }),
    putEmployeeEnable: builder.mutation<string, string>({
      query: employeeId => {
        return {
          url: `/employee/${employeeId}/enable`,
          method: 'PUT'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error enabling employee')
        console.log(res.data)

        return arg
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
      invalidatesTags: result => {
        return result ? [{ type: 'EMPLOYEE', id: result }] : []
      }
    })
  })
})
