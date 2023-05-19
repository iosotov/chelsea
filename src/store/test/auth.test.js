import { Provider } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import profile, { selectProfileById } from '../profileSlice'
import { JSDOM } from 'jsdom'
import { apiSlice } from '../api/apiSlice'
import auth from '../authSlice'
import { authApiSlice } from '../api/authApiSlice'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})

const storeWrapper = Component => {
  return props => (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  )
}

beforeAll(async () => {
  // Set up a fake DOM environment with jsdom
  const { window } = new JSDOM('<!doctype html><html><body></body></html>')
  global.window = window
  global.document = window.document
})

afterAll(async () => {
  cleanup()
  store.dispatch(apiSlice.util.resetApiState())

  delete global.window
  delete global.document
})

test('auth', async () => {
  const testLogin = {
    username: 'celine@prime-logix.c',
    password: '123'
  }

  const usePostAuthLoginMutationMock = jest.spyOn(authApiSlice, 'usePostAuthLoginMutation')
  const usePostAuthRefreshTokenMutationMock = jest.spyOn(authApiSlice, 'usePostAuthRefreshTokenMutation')
  const Wrapper = storeWrapper(() => {
    const [
      auth,
      { isLoading: authLoading, isSuccess: authSuccess, isUninitialized: authUnInit, isError: authError, error }
    ] = usePostAuthLoginMutationMock()

    async function handleAuth() {
      await auth(testLogin)
    }

    console.log(error)

    return (
      <>
        <div>{authUnInit && 'authUnInit'}</div>

        <div>{authError && 'authError'}</div>

        <div>{authLoading && 'authLoading'}</div>

        <div>{authSuccess && 'authSuccess'}</div>

        <button onClick={handleAuth}>auth</button>
      </>
    )
  })

  const RefreshWrapper = storeWrapper(({ token }) => {
    const [
      refresh,
      {
        isLoading: refreshLoading,
        isSuccess: refreshSuccess,
        isUninitialized: refreshUnInit,
        isError: refreshError,
        error
      }
    ] = usePostAuthRefreshTokenMutationMock()

    console.log(error)

    if (!token) refresh()

    return (
      <>
        <div>{refreshUnInit && 'refreshUnInit'}</div>
        <div>{refreshError && 'refreshError'}</div>
        <div>{refreshLoading && 'refreshLoading'}</div>
        <div>{refreshSuccess && 'refreshSuccess'}</div>\{' '}
      </>
    )
  })

  const { getByText: auth } = render(<Wrapper />)
  const { getByText: refresh } = render(<RefreshWrapper />)
  await waitFor(() => expect(auth('authUnInit')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(refresh('refreshLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(refresh('refreshError')).toBeInTheDocument(), { timeout: 5000 })

  let state = store.getState()
  console.log(state.auth)

  // let button = auth('auth')
  // fireEvent.click(button)

  // await waitFor(() => expect(auth('authLoading')).toBeInTheDocument(), { timeout: 5000 })
  // await waitFor(() => expect(auth('authError')).toBeInTheDocument(), { timeout: 5000 })

  // state = store.getState()
  // console.log(state.auth)
})
