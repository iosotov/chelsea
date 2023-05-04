import { Provider } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import profile, { selectProfileById } from '../profileSlice'
import { JSDOM } from 'jsdom'
import { apiSlice } from '../api/apiSlice'
import auth, { setCredentials } from '../authSlice'

import SolApi from '../api/SolApi'
import { profileApiSlice } from '../api/profileApiSlice'

// import { waitForApiCall } from './helper'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth,
    profile
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
    SolApi.token = res.data.token
    store.dispatch(setCredentials(authData)) // Dispatch the setCredential action with the token
  } catch (error) {
    console.error('Error fetching test token:', error[0].data)
  }
})

afterAll(async () => {
  cleanup()
  store.dispatch(apiSlice.util.resetApiState())

  delete global.window
  delete global.document
})

test('profile', async () => {
  let _profileId = '9158384435'

  const useGetProfileInfoQueryMock = jest.spyOn(profileApiSlice, 'useGetProfileInfoQuery')

  const ProfileWrapper = storeWrapper(({ profileId }) => {
    const {
      isLoading: profileIsLoading,
      isSuccess: profileIsSuccess,
      isFetching: profileIsFetching
    } = useGetProfileInfoQueryMock(profileId)

    return (
      <>
        {/* ////////////////////////////////////////////////// */}

        <div>{profileIsLoading && 'profileIsLoading'}</div>

        <div>{profileIsFetching && 'profileIsFetching'}</div>

        <div>
          {profileIsFetching && 'profileIsFetching'}
          {profileIsSuccess && 'profileIsSuccess'}
        </div>
      </>
    )
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const { getByText } = render(<ProfileWrapper profileId={_profileId} />)

  await waitFor(() => expect(getByText('profileIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(getByText('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  let state = store.getState()

  // access tags used for cache management
  let profileTags = state[apiSlice.reducerPath].provided.PROFILE

  let profile = selectProfileById(state, _profileId)

  console.log(profileTags)
  console.log(profile)
}, 10000)
