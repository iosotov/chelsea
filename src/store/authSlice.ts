import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import SolApi from './api/SolApi'

interface LoginData {
  email: string
  password: string
  rememberMe: boolean
}

interface AuthState {
  error: string | null
  loading: boolean
  user: TokenPayload | {}
  token: string | null
  init: boolean
  permissions: string[]
}

interface SetCredentialsPayload {
  user: TokenPayload | {}
  token: string
  permissions: string[]
}

interface TokenPayload {
  Alias: string | null
  Email: string | null
  Name: string | null
  PhoneNumber: string | null
  UserId: string | null
  exp: number | null
  iat: number | null
  nameid: string | null
  nbf: number | null
}

const initialState: AuthState = {
  error: null,
  loading: true,
  user: {
    Alias: null,
    Email: null,
    Name: null,
    PhoneNumber: null,
    UserId: null,
    exp: null,
    iat: null,
    nameid: null,
    nbf: null
  },
  token: null,
  init: false,
  permissions: []
}

export function decodeJwt(token: string) {
  const payloadBase64Url = token.split('.')[1]
  const payloadBase64 = payloadBase64Url.replace('-', '+').replace('_', '/')
  const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8')
  const payload = JSON.parse(payloadJson)

  return payload
}

export const UserAuth = createAsyncThunk('user/auth', async (data: LoginData, { rejectWithValue }) => {
  const { rememberMe, email: username, password } = data
  try {
    const { success, data } = await SolApi.UserAuth({ username, password })
    SolApi.token = data.token
    if (success) {
      const { success, data: permissions } = await SolApi.GetPermissions()
      if (success) {
        data.permissions = permissions
      }
    }

    data.rememberMe = rememberMe

    return data
  } catch (err: unknown) {
    if (Array.isArray(err)) {
      if (err[0].data.message) return rejectWithValue(err[0].data.message)
    }

    return rejectWithValue('An error occurred while authenticating.')
  }
})

export const RefreshToken = createAsyncThunk('user/refresh-token', async (data, { rejectWithValue }) => {
  try {
    const { data } = await SolApi.RefreshToken()
    if (data !== null) {
      SolApi.token = data.token
      const { success, data: permissions } = await SolApi.GetPermissions()
      if (success) {
        data.permissions = permissions
      }

      return data
    }

    // return null
    return null
  } catch (err) {
    if (Array.isArray(err)) {
      if (err[0].data.message) return rejectWithValue(err[0].data.message)
    }

    return rejectWithValue('An error occurred while reauthenticating.')
  }
})

export const Logout = createAsyncThunk('user/revoke-token', async (data, { rejectWithValue }) => {
  try {
    const { success } = await SolApi.RevokeToken()
    if (success) {
      return success
    }

    rejectWithValue('There was an error revoking your token, please clear your cookies to secure your information')
  } catch (err) {
    if (Array.isArray(err)) {
      if (err[0].data.message) return rejectWithValue(err[0].data.message)
    }

    return rejectWithValue('An error occurred while reauthenticating.')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      const { user, token, permissions } = action.payload
      state.user = user
      state.token = token
      state.init = false
      state.permissions = permissions
    },
    logOut: () => {
      return initialState
    }
  },
  extraReducers: builder => {
    builder.addCase(UserAuth.pending, state => {
      state.loading = true
      state.error = null // Reset error when pending
    })
    builder.addCase(UserAuth.fulfilled, (state, action) => {
      const { permissions, rememberMe, token } = action.payload
      const user = decodeJwt(token)
      state.loading = false
      ;(state.user = user), (state.permissions = permissions), (state.token = token)

      if (rememberMe) window.localStorage.setItem('employee_username', action.meta.arg.email)
      else window.localStorage.removeItem('employee_username')
      state.error = null // Reset error when fulfilled
    })
    builder.addCase(UserAuth.rejected, (state, action) => {
      state.loading = false
      if (action.payload) {
        state.error = action.payload as string // Set error message when rejected
      } else {
        state.error = 'An unknown error occurred.' // Set a generic error message
      }
    })
    builder.addCase(RefreshToken.pending, state => {
      state.loading = true
      state.error = null // Reset error when pending
    })
    builder.addCase(RefreshToken.fulfilled, (state, action) => {
      if (!action.payload) {
        state = { ...state, ...initialState, init: true, loading: false }

        return state
      }
      const { permissions, token } = action.payload
      const user = decodeJwt(token)
      state.loading = false
      state.init = true
      ;(state.user = user), (state.permissions = permissions), (state.token = token)

      state.error = null // Reset error when fulfilled
    })
    builder.addCase(RefreshToken.rejected, (state, action) => {
      state.loading = false
      if (action.payload) {
        state.error = action.payload as string // Set error message when rejected
      } else {
        state.error = 'An unknown error occurred.' // Set a generic error message
      }
    })
    builder.addCase(Logout.pending, state => {
      state.loading = true
      state.error = null // Reset error when pending
    })
    builder.addCase(Logout.fulfilled, (state, action) => {
      if (action.payload) {
        ;(state.user = initialState.user),
          (state.permissions = initialState.permissions),
          (state.token = initialState.token),
          (state.loading = false),
          (state.error = null)
      }
    })
    builder.addCase(Logout.rejected, (state, action) => {
      state.loading = false
      if (action.payload) {
        state.error = action.payload as string // Set error message when rejected
      } else {
        state.error = 'An unknown error occurred.' // Set a generic error message
      }
    })
  }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token
export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectAuthState = (state: { auth: AuthState }) => state.auth.loading
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error
export const selectAuthPermissions = (state: { auth: AuthState }) => state.auth.permissions
export const selectRefreshInit = (state: { auth: AuthState }) => state.auth.init
