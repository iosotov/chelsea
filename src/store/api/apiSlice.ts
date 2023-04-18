import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { RootState } from 'src/store/store'

// import { setCredentials, logOut } from '../../features/auth/authSlice';

interface QueryArg {
  url: string
  method?: string
  body?: any
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://monolivia.com/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  }
})

const baseQueryWithReauth: BaseQueryFn<QueryArg, unknown, any> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403) {
    console.log('sending refresh token')

    const refreshResult = await baseQuery('/user/refresh-token', api, extraOptions)
    if (refreshResult?.data) {
      const employeeId = (api.getState() as RootState).auth.employeeId
      console.log(employeeId)

      // api.dispatch(setCredentials({ ...refreshResult.data, user }));

      result = await baseQuery(args, api, extraOptions)
    } else {
      // api.dispatch(logOut());
    }
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ProfileInfo', 'Debt', 'Enrollment', 'Payment', 'Documents'],

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: builder => ({})
})
