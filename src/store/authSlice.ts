import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import SolApi from './api/SolApi'

interface LoginData {
  email: string
  password: string
}

interface AuthState {
  employeeId: string | null
  token: string | null
  init: boolean
  permissions: string[]
}

interface SetCredentialsPayload {
  employeeId: string
  token: string
  permissions: string[]
}

const initialState: AuthState = {
  employeeId: null,
  token: null,
  init: true,
  permissions: []
}

export const login = createAsyncThunk('auth/login', async (data: LoginData) => {
  const res = await SolApi.UserAuth(data)
  console.log(res)
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      const { employeeId, token, permissions } = action.payload
      state.employeeId = employeeId
      state.token = token
      state.init = false
      state.permissions = permissions
    },
    logOut: state => {
      state.employeeId = null
      state.token = null
    }
  }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token
export const selectEmployeeId = (state: { auth: AuthState }) => state.auth.employeeId
