import { Provider } from 'react-redux'
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import profile, { profileStatusSlice, selectAllProfiles, selectProfileById } from '../profileSlice'
import { JSDOM } from 'jsdom'
import {
  profileApiSlice,
  useGetProfileInfoQuery,
  useGetProfileStatusQuery,
  useGetProfilesQuery
} from '../api/profileApiSlice'
import { apiSlice } from '../api/apiSlice'
import auth, { setCredentials } from '../authSlice'
import SolApi from '../api/SolApi'
import { useEffect, useRef } from 'react'
import { profileBudgetApiSlice } from '../api/profileBudgetApiSlice'
import profileBudget, {
  selectAllProfileBudgets,
  selectProfileBudgetsByBudgetId,
  selectProfileBudgetsById
} from '../profileBudgetSlice'

let _profileId
let deleted = false

const waitForApiCall = async () => {
  try {
    await waitFor(() => expect(getByText('isFetching')).toBeInTheDocument(), { timeout: 2000 })

    return true
  } catch (error) {
    // Timeout error
    return false
  }
}

function parseCSV(csvString) {
  const lines = csvString.trim().split('\n')
  const headers = lines[0].split(',')
  const data = []

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',')
    const rowData = {}

    for (let j = 0; j < headers.length; j++) {
      rowData[headers[j]] = row[j]
    }

    data.push(rowData)
  }

  return data
}

const delay = (ms, callback) =>
  new Promise(resolve => {
    const interval = setInterval(() => {
      callback()
    }, 100)

    setTimeout(() => {
      clearInterval(interval)
      resolve()
    }, ms)
  })

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    profile,
    profileStatusSlice,
    profileBudget,
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

// beforeAll(async () => {
//   // Set up a fake DOM environment with jsdom
//   const { window } = new JSDOM('<!doctype html><html><body></body></html>')
//   global.window = window
//   global.document = window.document

//   try {
//     // const res = await SolApi.TestAuth() // Call the TestAuth API

//     const authData = {
//       employeeId: 'test',
//       token:
//         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwN2UxMjUwMS1lODI3LTRkYTctYTQyNy0xN2YzYzNmYmExYzciLCJVc2VySWQiOiI2NDQxNGIyMC0xN2EwLTRlNDEtODYwNi05M2U2ZTliN2MwMmIiLCJQaG9uZU51bWJlciI6IjExMTExMTExMjAiLCJOYW1lIjoiTG9uZyAgTHVuYSIsIkVtYWlsIjoibG9uZ0BsdW5hcHBzLmNvIiwiQWxpYXMiOiIxMTExMTExMTIwIiwibmJmIjoxNjgyNjQ2MDUwLCJleHAiOjE2ODI2ODIwNTAsImlhdCI6MTY4MjY0NjA1MH0.IlHOJyEbnWpvV1XmLPBcPnqLV2e_5MBk9Bz91Q9sfTQ',
//       permissions: []
//     }
//     ;(SolApi.token =
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwN2UxMjUwMS1lODI3LTRkYTctYTQyNy0xN2YzYzNmYmExYzciLCJVc2VySWQiOiI2NDQxNGIyMC0xN2EwLTRlNDEtODYwNi05M2U2ZTliN2MwMmIiLCJQaG9uZU51bWJlciI6IjExMTExMTExMjAiLCJOYW1lIjoiTG9uZyAgTHVuYSIsIkVtYWlsIjoibG9uZ0BsdW5hcHBzLmNvIiwiQWxpYXMiOiIxMTExMTExMTIwIiwibmJmIjoxNjgyNjQ2MDUwLCJleHAiOjE2ODI2ODIwNTAsImlhdCI6MTY4MjY0NjA1MH0.IlHOJyEbnWpvV1XmLPBcPnqLV2e_5MBk9Bz91Q9sfTQ'),
//       store.dispatch(setCredentials(authData)) // Dispatch the setCredential action with the token

//     const { data } = await SolApi.TestCreateProfile()
//     _profileId = data
//   } catch (error) {
//     console.error('Error fetching test token:', error[0].data)
//   }
// })
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

    const { data } = await SolApi.TestCreateProfile()
    _profileId = data
  } catch (error) {
    console.error('Error fetching test token:', error[0].data)
  }
})

afterAll(async () => {
  cleanup()

  await SolApi.TestDeleteProfile(_profileId)

  store.dispatch(apiSlice.util.resetApiState())

  delete global.window
  delete global.document
})

describe('ProileApiSlice', () => {
  test('getProfiles updates the profileSlice', async () => {
    const Wrapper = storeWrapper(({ searchParams = {} }) => {
      const { data } = useGetProfilesQuery(searchParams)

      return data ? <div>success</div> : <div>loading</div>
    })

    const { getByText } = render(<Wrapper searchParams={{}} />)

    expect(getByText('loading')).toBeInTheDocument()

    await delay(300, () => true)

    await waitFor(() => expect(getByText('success')).toBeInTheDocument())

    const state = store.getState()

    // access tags used for cache management
    const cacheTagIds = Object.keys(state[apiSlice.reducerPath].provided.PROFILE)

    // access all profiles in global state
    const profiles = selectAllProfiles(state)

    expect(profiles.length).toBeGreaterThan(0)
    expect(cacheTagIds.length).toBe(1)
  })
  test('getProfileInfo updates the profileSlice', async () => {
    const useGetProfileInfoQueryMock = jest.spyOn(profileApiSlice, 'useGetProfileInfoQuery')
    const Wrapper = storeWrapper(({ profileId }) => {
      // use mock function to track number of times it is called
      const { isFetching, isLoading, isSuccess } = useGetProfileInfoQueryMock(profileId)

      return (
        <>
          {/* Query is currently loading for the first time. No data yet. */}
          {isLoading && 'isLoading'}

          {/* Query has data from a successful load. */}
          {isSuccess && 'isSuccess'}

          {/* Query is currently fetching, but might have data from an earlier request. */}
          {!isLoading && isFetching && 'isFetching'}
        </>
      )
    })

    const { getByText, unmount } = render(<Wrapper profileId={_profileId} />)
    expect(getByText('isLoading')).toBeInTheDocument()

    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

    const state = store.getState()

    // access tags used for cache management
    const cacheTagIds = store.getState()[apiSlice.reducerPath].provided.PROFILE

    // access all profiles in global state
    const profile = selectProfileById(state, _profileId)
    expect(cacheTagIds[_profileId][0]).toMatch(`getProfileInfo("${_profileId}")`)
    expect(profile.profileId).toBe(_profileId)

    /*
    UNCOMMENT IF YOU WANT TO TEST CACHE MANAGEMENT: TEST REQUIRES 2 SEC

    // Simulate leaving and coming back to the Wrapper page
    unmount(<Wrapper profileId={_profileId} />)
    render(<Wrapper profileId={_profileId} />)

    //following tests ensure cache management is working correct
    expect(getByText('isSuccess')).toBeInTheDocument()

    // if isLoading returns true, redundant api call made
    const isFetching = await waitForApiCall()

    expect(isFetching).toBe(false)

    */
  })

  test('getProfileStatus updates the profileSlice and profileStatusSlice', async () => {
    const useGetProfileStatusQueryMock = jest.spyOn(profileApiSlice, 'useGetProfileStatusQuery')
    const Wrapper = storeWrapper(({ profileId }) => {
      // use mock function to track number of times it is called
      const { isFetching, isLoading, isSuccess } = useGetProfileStatusQueryMock(profileId)

      return (
        <>
          {/* Query is currently loading for the first time. No data yet. */}
          {isLoading && 'isLoading'}

          {/* Query has data from a successful load. */}
          {isSuccess && 'isSuccess'}

          {/* Query is currently fetching, but might have data from an earlier request. */}
          {!isLoading && isFetching && 'isFetching'}
        </>
      )
    })

    const { getByText, unmount } = render(<Wrapper profileId={_profileId} />)
    expect(getByText('isLoading')).toBeInTheDocument()

    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

    const state = store.getState()

    // access tags used for cache management
    const cacheTagIds = store.getState()[apiSlice.reducerPath].provided['PROFILE-STATUS']

    // access all profiles in global state
    const profile = selectProfileById(state, _profileId)
    expect(cacheTagIds[_profileId][0]).toMatch(`getProfileStatus("${_profileId}")`)
    expect(profile.profileId).toBe(_profileId)

    // UNCOMMENT BELOW IF YOU WANT TO TEST CACHE MANAGEMENT

    /*
    UNCOMMENT IF YOU WANT TO TEST CACHE MANAGEMENT: TEST REQUIRES 2 SEC

    // Simulate leaving and coming back to the Wrapper page
    unmount(<Wrapper profileId={_profileId} />)
    render(<Wrapper profileId={_profileId} />)

    //following tests ensure cache management is working correct
    expect(getByText('isSuccess')).toBeInTheDocument()

    // if isLoading returns true, redundant api call made
    const isFetching = await waitForApiCall()

    expect(isFetching).toBe(false)
    */
  })

  test('getProfileQuickSearch API', async () => {
    const useProfileQuickSearchQueryMock = jest.spyOn(profileApiSlice, 'useProfileQuickSearchQuery')
    const Wrapper = storeWrapper(({ keyword }) => {
      // use mock function to track number of times it is called
      const { data, isLoading, isSuccess } = useProfileQuickSearchQueryMock(keyword, { skip: !keyword.length })

      const hookInfoRef = useRef({ data, isLoading, isSuccess })

      useEffect(() => {
        hookInfoRef.current = { data, isLoading, isSuccess }
      }, [data, isLoading, isSuccess])

      return (
        <>
          {/* Query is currently loading for the first time. No data yet. */}
          {isLoading && 'isLoading'}

          {/* Query has data from a successful load. */}
          {isSuccess && 'isSuccess'}

          <div data-testid='hook-info-ref' ref={hookInfoRef}></div>
        </>
      )
    })

    const { rerender, getByTestId, getByText } = render(<Wrapper keyword={''} />)

    // provides us access to data, isLoading, and isSuccess variable in component
    const hookInfoRefBefore = Object.values(getByTestId('hook-info-ref'))[0].ref.current

    // ensure API is never called
    await delay(200, () => true)

    const { data, isLoading, isSuccess } = hookInfoRefBefore

    expect(data).toBe(undefined)
    expect(isLoading).toBeFalsy()
    expect(isSuccess).toBeFalsy()

    // proves the hook was called but the API was not called
    expect(useProfileQuickSearchQueryMock).toHaveBeenCalled()

    // rerender with keyword phrase
    rerender(<Wrapper keyword={'Test'} />)

    await waitFor(() => expect(getByText('isLoading')).toBeInTheDocument())

    // check hookInfoRef.current.success
    expect(Object.values(getByTestId('hook-info-ref'))[0].ref.current.isSuccess).toBeFalsy()

    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

    const hookInfoRefAfter = Object.values(getByTestId('hook-info-ref'))[0].ref.current
    const { data: dataAfter, isLoading: isLoadingAfter, isSuccess: isSuccessAfter } = hookInfoRefAfter

    // final assertions
    expect(isSuccessAfter).toBeTruthy()
    expect(isLoadingAfter).toBeFalsy()
    expect(dataAfter.length).toBeGreaterThan(0)
  })

  test('createProfile creates user and updates state', async () => {
    const useCreateProfileMutationMock = jest.spyOn(profileApiSlice, 'useCreateProfileMutation')
    let _newProfile
    const Wrapper = storeWrapper(() => {
      // use mock function to track number of times it is called
      const [trigger, { isUninitialized, isLoading, isSuccess }] = useCreateProfileMutationMock()

      // called to check if trigger invalidates LIST and updates with new profile
      useGetProfilesQuery()

      // trigger is called to create user, and new user is saved to global variable _newProfile
      async function handleClick() {
        const testData = {
          firstName: 'Redux',
          lastName: 'Working-Test',
          birthdate: '2000-01-17',
          campaignId: 'bf58cf1e-e03f-4097-b2bc-a410564bd933',
          gender: 1,
          profileAddresses: [
            {
              addressId: '133898fc-bbe4-4556-8694-a6291e045907',
              address1: '124124',
              address2: '124124',
              city: '124',
              state: 'FL',
              zipCode: '92832'
            }
          ]
        }

        /*

        unwrap will return transformed data from API
        unless previously discussed, do not access data this way
        always access data from redux store

        */

        _newProfile = await trigger(testData).unwrap()
      }

      return (
        <>
          {/* Query is currently loading for the first time. No data yet. */}
          {isUninitialized && 'isUninitialized'}

          {/* Query is currently loading for the first time. No data yet. */}
          {isLoading && 'isLoading'}

          {/* Query has data from a successful load. */}
          {isSuccess && 'isSuccess'}
          <button onClick={handleClick}>create</button>
        </>
      )
    })

    const { getByText } = render(<Wrapper />)

    expect(getByText('isUninitialized')).toBeInTheDocument()

    // store number of profiles in state before
    const profilesBefore = selectAllProfiles(store.getState()).length

    const button = getByText('create')
    fireEvent.click(button)

    await waitFor(() => expect(getByText('isLoading')).toBeInTheDocument())

    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

    // store number of profiles in state after
    const profilesAfter = selectAllProfiles(store.getState()).length

    // ensure new profile has saved to state
    const profile = selectProfileById(store.getState(), _newProfile.profileId)
    expect(profile.firstName).toBe(_newProfile.firstName)
    expect(profilesAfter).toBe(profilesBefore + 1)
  })

  test('assignProfile updates profileSlice', async () => {
    let newAssignment

    const useAssignProfileMutationMock = jest.spyOn(profileApiSlice, 'useAssignProfileMutation')

    const Wrapper = storeWrapper(({ profileId }) => {
      // use mock function to track number of times it is called
      const [trigger, { isSuccess: triggerSuccess }] = useAssignProfileMutationMock()

      // called to check if trigger invalidates LIST and updates with new profile
      const { isLoading, isSuccess, isFetching } = useGetProfileInfoQuery(profileId)

      // trigger is called to create user, and new user is saved to global variable _newProfile
      async function handleClick() {
        const testData = {
          assigneeId: '1b775b2e-66c5-45f3-bab0-f9dfe586720b',
          employeeId: 'ddcd31df-e42a-45f9-913b-1db6e62becab',
          profileId
        }

        const data = await trigger(testData).unwrap()
        newAssignment = data
      }

      return (
        <>
          {/* Query is currently loading for the first time. No data yet. */}
          {isLoading && 'isLoading'}

          {/* Query has data from a successful load. */}
          {isSuccess && 'isSuccess'}

          {/* Query is currently fetching, but might have data from an earlier request. */}
          {!isLoading && isFetching && 'isFetching'}

          <button onClick={handleClick}>status</button>

          <div>{triggerSuccess && 'triggerSuccess'}</div>
        </>
      )
    })

    const { getByText } = render(<Wrapper profileId={_profileId} />)
    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

    // ensure profile has no assignees before
    const profileBefore = selectProfileById(store.getState(), _profileId)
    expect(profileBefore.profileAssignees.length).toBe(0)

    // fire button
    const button = getByText('status')
    fireEvent.click(button)

    await waitFor(() => expect(getByText('triggerSuccess')).toBeInTheDocument())

    await act(async () => {
      await delay(300, () => true)
    })

    // store number of profiles in state after
    const profileAfter = selectProfileById(store.getState(), _profileId)

    // ensure API was called and profile updated with new assignee information
    expect(profileAfter.profileAssignees.length).toBe(1)
    expect(profileAfter.profileAssignees[0].assigneeId).toBe(newAssignment.assigneeId)
  })

  test('postProfileCustomField updates profileSlice', async () => {
    let newCustomField
    const useCreateProfileCustomFieldMutationMock = jest.spyOn(profileApiSlice, 'useCreateProfileCustomFieldMutation')
    const Wrapper = storeWrapper(({ profileId }) => {
      // use mock function to track number of times it is called
      const [trigger, { isSuccess: triggerSuccess }] = useCreateProfileCustomFieldMutationMock()

      // called to check if trigger invalidates LIST and updates with new profile
      const { isLoading, isSuccess, isFetching } = useGetProfileInfoQuery(profileId)

      // trigger is called to create user, and new user is saved to global variable _newProfile
      async function handleClick() {
        const testData = {
          profileId,
          customFields: [
            {
              customFieldId: '653B142B-2FAC-4782-BD2A-D2D2EA93E800',
              value: 'test custom field'
            }
          ]
        }

        const data = await trigger(testData).unwrap()
        newCustomField = data.customFields[0]
      }

      return (
        <>
          {/* Query is currently loading for the first time. No data yet. */}
          {isLoading && 'isLoading'}

          {/* Query has data from a successful load. */}
          {isSuccess && 'isSuccess'}

          {/* Query is currently fetching, but might have data from an earlier request. */}
          {!isLoading && isFetching && 'isFetching'}

          <button onClick={handleClick}>customField</button>

          <div>{triggerSuccess && 'triggerSuccess'}</div>
        </>
      )
    })

    const { getByText } = render(<Wrapper profileId={_profileId} />)
    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

    // ensure profile has no assignees before
    const profileBefore = selectProfileById(store.getState(), _profileId)
    expect(profileBefore.profileCustomFields.length).toBe(0)

    // fire button
    const button = getByText('customField')
    fireEvent.click(button)

    await waitFor(() => expect(getByText('triggerSuccess')).toBeInTheDocument())

    await act(async () => {
      await delay(300, () => true)
    })

    // store number of profiles in state after
    const profileAfter = selectProfileById(store.getState(), _profileId)

    // ensure API was called and profile updated with new assignee information
    expect(profileAfter.profileCustomFields.length).toBe(1)
    expect(profileAfter.profileCustomFields[0].value).toBe(newCustomField.value)
  })

  test('postProfileSubmit updates profileSlice', async () => {
    const usePostProfileSubmitMutationMock = jest.spyOn(profileApiSlice, 'usePostProfileSubmitMutation')
    const Wrapper = storeWrapper(({ profileId }) => {
      // use mock function to track number of times it is called
      const [trigger, { isSuccess: triggerSuccess }] = usePostProfileSubmitMutationMock()

      // called to check if trigger invalidates LIST and updates with new profile
      const { isLoading, isSuccess, isFetching } = useGetProfileInfoQuery(profileId)
      const {
        isLoading: statusLoading,
        isSuccess: statusSuccess,
        isFetching: statusFetching
      } = useGetProfileStatusQuery(profileId)

      // trigger is called to create user, and new user is saved to global variable _newProfile
      async function handleClick() {
        const data = await trigger(profileId).unwrap()
      }

      return (
        <>
          {/* Query is currently loading for the first time. No data yet. */}
          {isLoading && 'isLoading'}

          {/* Query has data from a successful load. */}
          {isSuccess && 'isSuccess'}

          {/* Query is currently fetching, but might have data from an earlier request. */}
          {!isLoading && isFetching && 'isFetching'}

          <button onClick={handleClick}>submit</button>

          <div>{triggerSuccess && 'triggerSuccess'}</div>
        </>
      )
    })

    const profileBefore = selectProfileById(store.getState(), _profileId)

    // assertions before trigger
    expect(profileBefore.status).toBe(0)
    expect(profileBefore.statusName).toBe('Inactive')

    const { getByText } = render(<Wrapper profileId={_profileId} />)

    // Profile has already been loaded so isSuccess should be true
    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

    // fire button
    const button = getByText('submit')
    fireEvent.click(button)

    await waitFor(() => expect(getByText('triggerSuccess')).toBeInTheDocument())

    await act(async () => {
      await delay(300, () => true)
    })

    // store number of profiles in state after
    const profileAfter = selectProfileById(store.getState(), _profileId)

    // assertions before trigger
    expect(profileAfter.status).toBe(1)
    expect(profileAfter.statusName).toBe('Submitted')
  })

  test('getProfileLabelsQuery and postProfileLabelMutation updates profile budgets', async () => {
    const useGetProfileLabelsQueryMock = jest.spyOn(profileBudgetApiSlice, 'useGetProfileLabelsQuery')
    const usePostProfileLabelsMutationMock = jest.spyOn(profileBudgetApiSlice, 'usePostProfileLabelsMutation')

    const Wrapper = storeWrapper(({ profileId }) => {
      // use mock function to track number of times it is called
      const { isLoading, isSuccess } = useGetProfileLabelsQueryMock(profileId)

      useGetProfileInfoQuery(_profileId)

      const [trigger, { isSuccess: triggerSuccess }] = usePostProfileLabelsMutationMock()

      async function handleClick() {
        const testData = {
          profileId,
          labelIds: ['ec8afd3b-af30-4abb-a3db-ef197fbbbfc2']
        }

        const data = await trigger(testData).unwrap()
      }

      return (
        <>
          <div>{isLoading && 'isLoading'}</div>

          <div>{isSuccess && 'isSuccess'}</div>

          <div>{triggerSuccess && 'triggerSuccess'}</div>

          <button onClick={handleClick}>postLabels</button>
        </>
      )
    })

    const { getByText } = render(<Wrapper profileId={_profileId} />)

    await waitFor(() => expect(getByText('isLoading')).toBeInTheDocument())

    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

    const profileBefore = selectProfileById(store.getState(), _profileId)

    console.log(profileBefore)

    // fire button
    const button = getByText('postLabels')
    fireEvent.click(button)

    await waitFor(() => expect(getByText('triggerSuccess')).toBeInTheDocument())

    // give time for state to update with new profileInformation
    await act(async () => {
      await delay(300, () => true)
    })

    const profileAfter = selectProfileById(store.getState(), _profileId)

    console.log(profileAfter)
  })

  test('postProfileReject updates profileSlice', async () => {
    const usePostProfileRejectMutationMock = jest.spyOn(profileApiSlice, 'usePostProfileRejectMutation')
    const Wrapper = storeWrapper(({ profileId }) => {
      // use mock function to track number of times it is called
      const [trigger, { isSuccess: triggerSuccess }] = usePostProfileRejectMutationMock()

      // called to check if trigger invalidates LIST and updates with new profile
      const { isLoading, isSuccess, isFetching } = useGetProfileInfoQuery(profileId)
      const {
        isLoading: statusLoading,
        isSuccess: statusSuccess,
        isFetching: statusFetching
      } = useGetProfileStatusQuery(profileId)

      // trigger is called to create user, and new user is saved to global variable _newProfile
      async function handleClick() {
        const data = await trigger(profileId).unwrap()
      }

      return (
        <>
          {/* Query is currently loading for the first time. No data yet. */}
          {isLoading && 'isLoading'}

          {/* Query has data from a successful load. */}
          {isSuccess && 'isSuccess'}

          {/* Query is currently fetching, but might have data from an earlier request. */}
          {!isLoading && isFetching && 'isFetching'}

          <button onClick={handleClick}>reject</button>

          <div>{triggerSuccess && 'triggerSuccess'}</div>
        </>
      )
    })

    const profileBefore = selectProfileById(store.getState(), _profileId)

    // assertions before trigger
    expect(profileBefore.status).toBe(1)
    expect(profileBefore.statusName).toBe('Submitted')

    const { getByText } = render(<Wrapper profileId={_profileId} />)

    // Profile has already been loaded so isSuccess should be true
    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

    // fire button
    const button = getByText('reject')
    fireEvent.click(button)

    await waitFor(() => expect(getByText('triggerSuccess')).toBeInTheDocument())

    await act(async () => {
      await delay(300, () => true)
    })

    // store number of profiles in state after
    const profileAfter = selectProfileById(store.getState(), _profileId)

    // assertions before trigger
    expect(profileAfter.status).toBe(0)
    expect(profileAfter.statusName).toBe('Inactive')
  })

  test('postProfileGrantAuth updates profileSlice', async () => {
    const useProfileGrantAuthMutationMock = jest.spyOn(profileApiSlice, 'useProfileGrantAuthMutation')
    const Wrapper = storeWrapper(({ profileId }) => {
      // use mock function to track number of times it is called
      const [trigger, { isSuccess: triggerSuccess }] = useProfileGrantAuthMutationMock()

      // called to check if trigger invalidates LIST and updates with new profile
      const { isLoading, isSuccess, isFetching } = useGetProfileInfoQuery(profileId)
      const {
        isLoading: statusLoading,
        isSuccess: statusSuccess,
        isFetching: statusFetching
      } = useGetProfileStatusQuery(profileId)

      // trigger is called to create user, and new user is saved to global variable _newProfile
      async function handleClick() {
        const testData = { profileId, password: '123' }
        const data = await trigger(testData).unwrap()
      }

      return (
        <>
          {/* Query is currently loading for the first time. No data yet. */}
          {isLoading && 'isLoading'}

          {/* Query has data from a successful load. */}
          {isSuccess && 'isSuccess'}

          {/* Query is currently fetching, but might have data from an earlier request. */}
          {!isLoading && isFetching && 'isFetching'}

          <button onClick={handleClick}>authGrant</button>

          <div>{triggerSuccess && 'triggerSuccess'}</div>
        </>
      )
    })

    const profileBefore = selectProfileById(store.getState(), _profileId)

    // assertions before trigger
    expect(profileBefore.hasAuthentication).toBe(false)

    const { getByText } = render(<Wrapper profileId={_profileId} />)

    // Profile has already been loaded so isSuccess should be true
    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

    // fire button
    const button = getByText('authGrant')
    fireEvent.click(button)

    await waitFor(() => expect(getByText('triggerSuccess')).toBeInTheDocument())

    await act(async () => {
      await delay(300, () => true)
    })

    // store number of profiles in state after
    const profileAfter = selectProfileById(store.getState(), _profileId)

    // call API directly to ensure state in client and backend match
    const { data: profileInDB } = await SolApi.GetProfile(_profileId)

    // assertions before trigger
    expect(profileAfter.hasAuthentication).toBe(true)
    expect(profileInDB.hasAuthentication).toBe(true)
    Object.keys(profileInDB).forEach(key => {
      expect(profileAfter).toHaveProperty(key, profileInDB[key])
    })
  })

  // test('postProfileDisableAuth updates profileSlice', async () => {
  //   const useProfileDisableAuthMutationMock = jest.spyOn(profileApiSlice, 'useProfileDisableAuthMutation')
  //   const Wrapper = storeWrapper(({ profileId }) => {
  //     // use mock function to track number of times it is called
  //     const [trigger, { isSuccess: triggerSuccess }] = useProfileDisableAuthMutationMock()

  //     // called to check if trigger invalidates LIST and updates with new profile
  //     const { isLoading, isSuccess, isFetching } = useGetProfileInfoQuery(profileId)
  //     const {
  //       isLoading: statusLoading,
  //       isSuccess: statusSuccess,
  //       isFetching: statusFetching
  //     } = useGetProfileStatusQuery(profileId)

  //     // trigger is called to create user, and new user is saved to global variable _newProfile
  //     async function handleClick() {
  //       const data = await trigger(profileId).unwrap()
  //       console.log(data)
  //     }

  //     return (
  //       <>
  //         {/* Query is currently loading for the first time. No data yet. */}
  //         {isLoading && 'isLoading'}

  //         {/* Query has data from a successful load. */}
  //         {isSuccess && 'isSuccess'}

  //         {/* Query is currently fetching, but might have data from an earlier request. */}
  //         {!isLoading && isFetching && 'isFetching'}

  //         <button onClick={handleClick}>authDisable</button>

  //         <div>{triggerSuccess && 'triggerSuccess'}</div>
  //       </>
  //     )
  //   })

  //   const profileBefore = selectProfileById(store.getState(), _profileId)
  //   console.log(profileBefore)

  //   // assertions before trigger
  //   expect(profileBefore.hasAuthentication).toBe(true)

  //   const { getByText } = render(<Wrapper profileId={_profileId} />)

  //   // Profile has already been loaded so isSuccess should be true
  //   await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

  //   // fire button
  //   const button = getByText('authDisable')
  //   fireEvent.click(button)

  //   // await waitFor(() => expect(getByText('triggerSuccess')).toBeInTheDocument())

  //   await act(async () => {
  //     await delay(300, () => true)
  //   })

  //   // store number of profiles in state after
  //   const profileAfter = selectProfileById(store.getState(), _profileId)
  //   console.log(profileAfter)

  //   // call API directly to ensure state in client and backend match
  //   const { data: profileInDB } = await SolApi.GetProfile(_profileId)

  //   // assertions before trigger
  //   expect(profileAfter.hasAuthentication).toBe(false)
  //   expect(profileInDB.hasAuthentication).toBe(false)
  //   Object.keys(profileInDB).forEach(key => {
  //     expect(profileAfter).toHaveProperty(key, profileInDB[key])
  //   })
  // })

  test('putUpdateProfileStatus updates profileSlice', async () => {
    const usePutUpdateProfileStatusMutationMock = jest.spyOn(profileApiSlice, 'usePutUpdateProfileStatusMutation')
    const Wrapper = storeWrapper(({ profileId }) => {
      // use mock function to track number of times it is called
      const [trigger, { isSuccess: triggerSuccess }] = usePutUpdateProfileStatusMutationMock()

      // called to check if trigger invalidates LIST and updates with new profile
      const { isLoading, isSuccess, isFetching } = useGetProfileInfoQuery(profileId)
      const {
        isLoading: statusLoading,
        isSuccess: statusSuccess,
        isFetching: statusFetching
      } = useGetProfileStatusQuery(profileId)

      // trigger is called to create user, and new user is saved to global variable _newProfile
      async function handleClick() {
        const testData = {
          profileId,
          stage: '9212ea41-12fb-48cc-9867-58731eef71dd',
          stageStatus: 'ed43ba86-e670-4310-b5ed-e831812a8c9e'
        }
        const data = await trigger(testData).unwrap()
      }

      return (
        <>
          {/* Query is currently loading for the first time. No data yet. */}
          {isLoading && 'isLoading'}

          {/* Query has data from a successful load. */}
          {isSuccess && 'isSuccess'}

          {/* Query is currently fetching, but might have data from an earlier request. */}
          {!isLoading && isFetching && 'isFetching'}

          <button onClick={handleClick}>updateProfileStatus</button>

          <div>{triggerSuccess && 'triggerSuccess'}</div>
        </>
      )
    })

    const profileBefore = selectProfileById(store.getState(), _profileId)

    // assertions before trigger
    expect(profileBefore.stage).toBe(null)
    expect(profileBefore.stageName).toBe(null)
    expect(profileBefore.stageStatus).toBe(null)
    expect(profileBefore.stageStatusName).toBe(null)

    const { getByText } = render(<Wrapper profileId={_profileId} />)

    // Profile has already been loaded so isSuccess should be true
    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

    // fire button
    const button = getByText('updateProfileStatus')
    fireEvent.click(button)

    await waitFor(() => expect(getByText('triggerSuccess')).toBeInTheDocument())

    await act(async () => {
      await delay(300, () => true)
    })

    // store number of profiles in state after
    const profileAfter = selectProfileById(store.getState(), _profileId)

    // assertions before trigger
    expect(profileAfter.stage).toBe('9212ea41-12fb-48cc-9867-58731eef71dd')
    expect(profileAfter.stageName).toBe('Sales Flow')
    expect(profileAfter.stageStatus).toBe('ed43ba86-e670-4310-b5ed-e831812a8c9e')

    // expect(profileAfter.stageStatusName).toBe('New Lead')
  })

  test('putUpdateProfile updates profileSlice', async () => {
    const usePutUpdateProfileMutationMock = jest.spyOn(profileApiSlice, 'usePutUpdateProfileMutation')
    const Wrapper = storeWrapper(({ profileId }) => {
      // use mock function to track number of times it is called
      const [trigger, { isSuccess: triggerSuccess }] = usePutUpdateProfileMutationMock()

      // called to check if trigger invalidates LIST and updates with new profile
      const { isLoading, isSuccess, isFetching } = useGetProfileInfoQuery(profileId)
      const {
        isLoading: statusLoading,
        isSuccess: statusSuccess,
        isFetching: statusFetching
      } = useGetProfileStatusQuery(profileId)

      // trigger is called to create user, and new user is saved to global variable _newProfile
      async function handleClick() {
        const testData = {
          profileId,
          firstName: 'Testing123',
          lastName: 'Testing456',
          campaignId: 'bf58cf1e-e03f-4097-b2bc-a410564bd933'
        }
        const data = await trigger(testData).unwrap()
      }

      return (
        <>
          {/* Query is currently loading for the first time. No data yet. */}
          {isLoading && 'isLoading'}

          {/* Query has data from a successful load. */}
          {isSuccess && 'isSuccess'}

          {/* Query is currently fetching, but might have data from an earlier request. */}
          {!isLoading && isFetching && 'isFetching'}

          <button onClick={handleClick}>updateProfile</button>

          <div>{triggerSuccess && 'triggerSuccess'}</div>
        </>
      )
    })

    // get profileStateBefore component renders, or trigger is called
    const profileBefore = selectProfileById(store.getState(), _profileId)

    const { getByText } = render(<Wrapper profileId={_profileId} />)

    // Profile has already been loaded so isSuccess should be true
    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

    // fire button
    const button = getByText('updateProfile')
    fireEvent.click(button)

    await waitFor(() => expect(getByText('triggerSuccess')).toBeInTheDocument())

    // give time for state to update with new profileInformation
    await act(async () => {
      await delay(300, () => true)
    })

    const profileAfter = selectProfileById(store.getState(), _profileId)

    // assertions after trigger
    expect(profileAfter.firstName).not.toBe(profileBefore.firstName)
    expect(profileAfter.lastName).not.toBe(profileBefore.lastName)
  })

  test('postExportProfiles updates profileSlice', async () => {
    const usePostExportProfilesMutationMock = jest.spyOn(profileApiSlice, 'usePostExportProfilesMutation')

    let componentData
    const Wrapper = storeWrapper(({ profileId }) => {
      // use mock function to track number of times it is called
      const [trigger, { data, isSuccess, isLoading }] = usePostExportProfilesMutationMock()

      // trigger is called to create user, and new user is saved to global variable _newProfile
      async function handleClick() {
        const testData = {
          start: 0,
          length: 10000,
          columns: [
            {
              columnName: 'profileId',
              search: {
                value: profileId,
                operator: 0
              }
            }
          ]
        }
        const triggerResult = await trigger(testData).unwrap()
        componentData = triggerResult
      }

      return (
        <>
          <button onClick={handleClick}>export</button>

          <div>{isLoading && 'isLoading'}</div>

          <div>{isSuccess && 'isSuccess'}</div>
        </>
      )
    })

    const { getByText } = render(<Wrapper profileId={_profileId} />)

    // fire button
    const button = getByText('export')
    fireEvent.click(button)

    await waitFor(() => expect(getByText('isLoading')).toBeInTheDocument())

    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

    // assertions after trigger
    // component Data should hold csv file
    expect(componentData).toBeDefined()
  }),
    test('getProfileBudgetsQuery updates profile budgets', async () => {
      const useGetProfileBudgetsQueryMock = jest.spyOn(profileBudgetApiSlice, 'useGetProfileBudgetsQuery')
      const usePostProfileBudgetsMutationMock = jest.spyOn(profileBudgetApiSlice, 'usePostProfileBudgetsMutation')

      const Wrapper = storeWrapper(({ profileId }) => {
        // use mock function to track number of times it is called
        const { isLoading, isSuccess } = useGetProfileBudgetsQueryMock(profileId)

        const [trigger, { isSuccess: triggerSuccess }] = usePostProfileBudgetsMutationMock()

        async function handleClick() {
          const testData = {
            profileId,
            budgets: [
              {
                budgetId: '9da97f8e-6e71-4091-b590-ed22be4cddb2',
                amount: 10
              },
              {
                budgetId: 'a7028bfb-c866-4938-90c0-f245c5909683',
                amount: 20
              }
            ]
          }

          const data = await trigger(testData).unwrap()
        }

        return (
          <>
            <div>{isLoading && 'isLoading'}</div>

            <div>{isSuccess && 'isSuccess'}</div>

            <div>{triggerSuccess && 'triggerSuccess'}</div>

            <button onClick={handleClick}>postBudgets</button>
          </>
        )
      })

      const { getByText } = render(<Wrapper profileId={_profileId} />)

      await waitFor(() => expect(getByText('isLoading')).toBeInTheDocument())

      await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

      const budgetsBefore = selectProfileBudgetsByBudgetId(store.getState(), _profileId)

      // fire button
      const button = getByText('postBudgets')
      fireEvent.click(button)

      await waitFor(() => expect(getByText('triggerSuccess')).toBeInTheDocument())

      // give time for state to update with new profileInformation
      await act(async () => {
        await delay(300, () => true)
      })

      const budgetsAfter = selectProfileBudgetsByBudgetId(store.getState(), _profileId)
      const allBudgets = selectAllProfileBudgets(store.getState())
    })

  test('putDeleteProfile updates profileSlice', async () => {
    const usePutDeleteProfileMutationMock = jest.spyOn(profileApiSlice, 'usePutDeleteProfileMutation')
    const Wrapper = storeWrapper(({ profileId }) => {
      // use mock function to track number of times it is called
      const [trigger, { isSuccess: triggerSuccess }] = usePutDeleteProfileMutationMock()

      // called to check if trigger invalidates LIST and updates with new profile
      const { isLoading, isSuccess, isFetching } = useGetProfileInfoQuery(profileId)
      const {
        isLoading: statusLoading,
        isSuccess: statusSuccess,
        isFetching: statusFetching
      } = useGetProfileStatusQuery(profileId)

      // trigger is called to create user, and new user is saved to global variable _newProfile
      async function handleClick() {
        const data = await trigger(profileId).unwrap()
        console.log(data)
      }

      return (
        <>
          {/* Query is currently loading for the first time. No data yet. */}
          {isLoading && 'isLoading'}

          {/* Query has data from a successful load. */}
          {isSuccess && 'isSuccess'}

          {/* Query is currently fetching, but might have data from an earlier request. */}
          {!isLoading && isFetching && 'isFetching'}

          <button onClick={handleClick}>deleteProfile</button>

          <div>{triggerSuccess && 'triggerSuccess'}</div>
        </>
      )
    })

    // get profileStateBefore component renders, or trigger is called
    const profileBefore = selectProfileById(store.getState(), _profileId)
    expect(profileBefore).toBeDefined()

    const { getByText } = render(<Wrapper profileId={_profileId} />)

    // Profile has already been loaded so isSuccess should be true
    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

    // fire button
    const button = getByText('deleteProfile')
    fireEvent.click(button)

    await waitFor(() => expect(getByText('triggerSuccess')).toBeInTheDocument())

    // give time for state to update with new profileInformation
    await act(async () => {
      await delay(300, () => true)
    })

    const profileAfter = selectProfileById(store.getState(), _profileId)

    // assertions after trigger
    // profile should no longer exist in the store
    expect(profileAfter).toBeUndefined()
  })
})

// test('getProfileLabels works with postProfileLabels', async () => {
//   const usePostExportProfilesMutationMock = jest.spyOn(profileApiSlice, 'usePostExportProfilesMutation')

//   let componentData
//   const Wrapper = storeWrapper(({ profileId }) => {
//     // use mock function to track number of times it is called
//     const [trigger, { data, isSuccess, isLoading }] = usePostExportProfilesMutationMock()

//     // trigger is called to create user, and new user is saved to global variable _newProfile
//     async function handleClick() {
//       const testData = {
//         start: 0,
//         length: 10000,
//         columns: [
//           {
//             columnName: 'profileId',
//             search: {
//               value: profileId,
//               operator: 0
//             }
//           }
//         ]
//       }
//       const triggerResult = await trigger(testData).unwrap()
//       componentData = triggerResult
//     }

//     return (
//       <>
//         <button onClick={handleClick}>export</button>

//         <div>{isLoading && 'isLoading'}</div>

//         <div>{isSuccess && 'isSuccess'}</div>
//       </>
//     )
//   })

//   const { getByText } = render(<Wrapper profileId={_profileId} />)

//   // fire button
//   const button = getByText('export')
//   fireEvent.click(button)

//   await waitFor(() => expect(getByText('isLoading')).toBeInTheDocument())

//   await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument())

//   // assertions after trigger
//   // component Data should hold csv file
//   expect(componentData).toBeDefined()

//   console.log(componentData)
// })
// })

/*
waiting to update:

- profile status summary => only returning empty lists
- profile approve
- profile submit
- profile enroll
- profile disable auth
- profile put stage
- profile get labels

 */
