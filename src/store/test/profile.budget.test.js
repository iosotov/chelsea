import { Provider } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import profile, { selectProfileById } from '../profileSlice'
import { JSDOM } from 'jsdom'
import { apiSlice } from '../api/apiSlice'
import auth, { setCredentials } from '../authSlice'
import profileBudget, { selectAllBudgets, selectProfileBudgetsByProfileId } from '../profileBudgetSlice'

import SolApi from '../api/SolApi'
import { profileBudgetApiSlice } from '../api/profileBudgetApiSlice'

// import { waitForApiCall } from './helper'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
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

test('profile budget api', async () => {
  let _profileId = '9158384435'
  let _budgetId = '4cb707ca-3579-4fb9-aa60-151fd4787ce1'

  const _profileBudgetUpdate = {
    profileId: _profileId,
    budgets: [
      {
        budgetId: 'fb065254-000a-44b4-ab42-de6939938bed',
        amount: 20
      }
    ]
  }

  const _budgetCreate = {
    name: 'Redux Budget',
    budgetType: 0,
    description: 'testing the redux store'
  }

  const _budgetUpdate = {
    budgetId: _budgetId,
    name: 'Redux Budget Update',
    budgetType: 1,
    description: 'testing the redux expense'
  }

  const useGetProfileBudgetsQueryMock = jest.spyOn(profileBudgetApiSlice, 'useGetProfileBudgetsQuery')
  const useGetBudgetsQueryMock = jest.spyOn(profileBudgetApiSlice, 'useGetBudgetsQuery')
  const useGetBudgetInfoQueryMock = jest.spyOn(profileBudgetApiSlice, 'useGetBudgetInfoQuery')
  const usePostProfileBudgetsMutationMock = jest.spyOn(profileBudgetApiSlice, 'usePostProfileBudgetsMutation')
  const usePostBudgetsMutationMock = jest.spyOn(profileBudgetApiSlice, 'usePostBudgetsMutation')
  const usePutDisableBudgetMutationMock = jest.spyOn(profileBudgetApiSlice, 'usePutDisableBudgetMutation')
  const usePutEnableBudgetMutationMock = jest.spyOn(profileBudgetApiSlice, 'usePutEnableBudgetMutation')
  const usePutUpdateBudgetMutationMock = jest.spyOn(profileBudgetApiSlice, 'usePutUpdateBudgetMutation')

  const ProfileWrapper = storeWrapper(({ profileId }) => {
    const {
      isLoading: profileIsLoading,
      isSuccess: profileIsSuccess,
      isFetching: profileIsFetching
    } = useGetProfileBudgetsQueryMock(profileId)

    const [updateProfile, { isLoading: updateProfileLoading, isSuccess: updateProfileSuccess }] =
      usePostProfileBudgetsMutationMock()

    async function handleUpdateProfile() {
      const data = await updateProfile(_profileBudgetUpdate).unwrap()
      console.log(data)
    }

    return (
      <>
        {/* ////////////////////////////////////////////////// */}

        <div>{profileIsLoading && 'profileIsLoading'}</div>

        <div>{profileIsFetching && 'profileIsFetching'}</div>

        <div>
          {profileIsFetching && 'profileIsFetching'}
          {profileIsSuccess && 'profileIsSuccess'}
        </div>

        {/* ////////////////////////////////////////////////// */}

        <div>{updateProfileLoading && 'updateProfileLoading'}</div>

        <div>{updateProfileSuccess && 'updateProfileSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <button onClick={handleUpdateProfile}>updateProfile</button>
      </>
    )
  })

  const BudgetListWrapper = storeWrapper(({ budgetId }) => {
    const {
      isLoading: budgetsIsLoading,
      isSuccess: budgetsIsSuccess,
      isFetching: budgetsIsFetching
    } = useGetBudgetsQueryMock({})

    const [createBudget, { isLoading: createBudgetLoading, isSuccess: createBudgetSuccess }] =
      usePostBudgetsMutationMock()

    const [enableBudget, { isLoading: enableBudgetLoading, isSuccess: enableBudgetSuccess }] =
      usePutEnableBudgetMutationMock()

    const [disableBudget, { isLoading: disableBudgetLoading, isSuccess: disableBudgetSuccess }] =
      usePutDisableBudgetMutationMock()

    async function handleCreateBudget() {
      _budgetId = await createBudget(_budgetCreate).unwrap()
      console.log(data)
    }

    async function handleEnableBudget() {
      const data = await enableBudget(budgetId).unwrap()
      console.log(data)
    }

    async function handleDisableBudget() {
      const data = await disableBudget(budgetId).unwrap()
      console.log(data)
    }

    return (
      <>
        {/* ////////////////////////////////////////////////// */}

        <div>{budgetsIsLoading && 'budgetsIsLoading'}</div>

        <div>{budgetsIsFetching && 'budgetsIsFetching'}</div>

        <div>
          {budgetsIsFetching && 'budgetsIsFetching'}
          {budgetsIsSuccess && 'budgetsIsSuccess'}
        </div>

        {/* ////////////////////////////////////////////////// */}

        <div>{createBudgetLoading && 'createBudgetLoading'}</div>

        <div>{createBudgetSuccess && 'createBudgetSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <div>{enableBudgetLoading && 'enableBudgetLoading'}</div>

        <div>{enableBudgetSuccess && 'enableBudgetSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <div>{disableBudgetLoading && 'disableBudgetLoading'}</div>

        <div>{disableBudgetSuccess && 'disableBudgetSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <button onClick={handleCreateBudget}>createBudget</button>

        <button onClick={handleEnableBudget}>enableBudget</button>

        <button onClick={handleDisableBudget}>disableBudget</button>
      </>
    )
  })

  const BudgetWrapper = storeWrapper(({ budgetId }) => {
    const {
      data,
      isLoading: budgetIsLoading,
      isSuccess: budgetIsSuccess,
      isFetching: budgetIsFetching
    } = useGetBudgetInfoQueryMock(budgetId)

    console.log(data)

    const [updateBudget, { isLoading: updateBudgetLoading, isSuccess: updateBudgetSuccess }] =
      usePutUpdateBudgetMutationMock()

    async function handleUpdateBudget() {
      const data = await updateBudget(_budgetUpdate).unwrap()
      console.log(data)
    }

    return (
      <>
        {/* ////////////////////////////////////////////////// */}

        <div>{budgetIsLoading && 'budgetIsLoading'}</div>

        <div>{budgetIsFetching && 'budgetIsFetching'}</div>

        <div>
          {budgetIsFetching && 'budgetIsFetching'}
          {budgetIsSuccess && 'budgetIsSuccess'}
        </div>

        {/* ////////////////////////////////////////////////// */}

        <div>{updateBudgetLoading && 'updateBudgetLoading'}</div>

        <div>{updateBudgetSuccess && 'updateBudgetSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <button onClick={handleUpdateBudget}>updateBudget</button>
      </>
    )
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const { getByText: profile } = render(<ProfileWrapper profileId={_profileId} />)
  const { getByText: budget } = render(<BudgetWrapper budgetId={_budgetId} />)
  const { getByText: budgets } = render(<BudgetListWrapper budgetId={_budgetId} />)

  await waitFor(() => expect(profile('profileIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(budget('budgetIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(budgets('budgetsIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(profile('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(budget('budgetIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(budgets('budgetsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  let state = store.getState()

  // access tags used for cache management
  let budgetTags = state[apiSlice.reducerPath].provided.BUDGET
  let profileBudgetTags = state[apiSlice.reducerPath].provided['PROFILE-BUDGET']

  let allBudgets = selectAllBudgets(state)
  let profileBudgets = selectProfileBudgetsByProfileId(state, _profileId)

  console.log(budgetTags)
  console.log(profileBudgetTags)

  // console.log(allBudgets, allBudgets.length)
  // console.log(profileBudgets, profileBudgets.length)

  let button = budgets('updateBudget')
  fireEvent.click(button)

  await waitFor(() => expect(budget('updateBudgetLoading')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(budget('updateBudgetSuccess')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(budget('budgetIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(budgets('budgetsIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(profile('profileIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(budget('budgetIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(budgets('budgetsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(profile('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  state = store.getState()

  // access tags used for cache management
  budgetTags = state[apiSlice.reducerPath].provided.BUDGET
  profileBudgetTags = state[apiSlice.reducerPath].provided['PROFILE-BUDGET']

  allBudgets = selectAllBudgets(state)
  profileBudgets = selectProfileBudgetsByProfileId(state, _profileId)

  console.log(budgetTags)
  console.log(profileBudgetTags)

  console.log(allBudgets, allBudgets.length)
  console.log(profileBudgets, profileBudgets.length)
}, 10000)
