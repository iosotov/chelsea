import { Provider } from 'react-redux'
import { cleanup, render, waitFor } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import profile, { profileStatusSlice, selectAllProfiles } from '../profileSlice'
import { JSDOM } from 'jsdom'
import { useGetProfilesQuery } from '../api/profileApiSlice'
import { apiSlice } from '../api/apiSlice'
import auth, { setCredentials } from '../authSlice'
import SolApi from '../api/SolApi'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    profile,
    profileStatusSlice,
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

  try {
    const res = await SolApi.TestAuth() // Call the TestAuth API

    const authData = {
      employeeId: 'test',
      token: res.data.token,
      permissions: []
    }
    console.log(authData)
    store.dispatch(setCredentials(authData)) // Dispatch the setCredential action with the token
  } catch (error) {
    console.error('Error fetching test token:', error)
  }
})

afterAll(async () => {
  cleanup()

  console.log(apiSlice.endpoints.getProfiles)

  store.dispatch(apiSlice.util.resetApiState())

  delete global.window
  delete global.document
})

test('getProfiles updates the profileSlice', async () => {
  const Wrapper = storeWrapper(({ searchParams = {} }) => {
    const { data } = useGetProfilesQuery(searchParams)

    return data ? <div>success</div> : <div>loading</div>
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { getByText, rerender } = render(<Wrapper searchParams={{}} />)
  expect(getByText('loading')).toBeInTheDocument()

  await waitFor(() => expect(getByText('success')).toBeInTheDocument())

  const state = store.getState()
  const profiles = selectAllProfiles(state)
  expect(profiles.length).toBeGreaterThan(0)

  // Add more assertions to test the data in the Redux store
})
