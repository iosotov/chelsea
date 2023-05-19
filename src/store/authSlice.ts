import { createSlice } from '@reduxjs/toolkit'
import { UserAuthResponseType } from './api/authApiSlice'

const initialState: UserAuthResponseType = {
  employee: {
    employeeId: '',
    firstName: '',
    lastName: '',
    middleName: '',
    alias: '',
    primaryEmail: '',
    primaryPhone: '',
    hasAuthentication: null,
    companyId: '',
    companyName: '',
    active: null,
    createdAt: '',
    userId: '',
    phoneNumbers: [],
    employeeAddresses: [],
    companies: [],
    permissions: [],
    members: [],
    roles: [],
    groups: [],
    allowedIps: []
  },
  token: null,
  refreshToken: null,
  init: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { employee, token, refreshToken } = action.payload

      return { employee, token, refreshToken }
    },
    logOut: () => {
      return { ...initialState, init: true }
    },
    setInit: state => {
      state.init = true
    }
  }
})

export const { setCredentials, logOut, setInit } = authSlice.actions

export default authSlice.reducer
