import { Provider } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import profile, { selectProfileById } from '../profileSlice'
import { JSDOM } from 'jsdom'
import { apiSlice } from '../api/apiSlice'
import auth, { setCredentials } from '../authSlice'
import liability, { selectLiabilityByProfileId } from '../liabilitySlice'

import SolApi from '../api/SolApi'
import { liabilityApiSlice } from '../api/liabilityApiSlice'

// import { waitForApiCall } from './helper'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    liability,
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

let _profileId = '9158384435'

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

test('liability api', async () => {
  const _createTestData = {
    profileId: _profileId,
    name: 'test',
    type: 'mortgage',
    accountNumber: '1234'
  }

  let _liability = 'fca59617-c297-472b-966d-650523fc9c77'

  const _updateTestData = {
    profileId: _profileId,
    liabilityId: _liability,
    name: 'test REDUXXXXX',
    type: 'credit',
    accountNumber: '12345555'
  }

  const _testDebts = {
    ids: ['2e3efd23-f5ad-4bee-96d0-42bc9e16bc0b', 'fca59617-c297-472b-966d-650523fc9c77']
  }

  const useGetProfileLiabilitiesQueryMock = jest.spyOn(liabilityApiSlice, 'useGetProfileLiabilitiesQuery')
  const usePostCreateLiabilityMutationMock = jest.spyOn(liabilityApiSlice, 'usePostCreateLiabilityMutation')
  const usePutUpdateLiabilityMutationMock = jest.spyOn(liabilityApiSlice, 'usePutUpdateLiabilityMutation')
  const usePutEnrollLiabilitiesMutationMock = jest.spyOn(liabilityApiSlice, 'usePutEnrollLiabilitiesMutation')
  const usePutWithdrawLiabilitiesMutationMock = jest.spyOn(liabilityApiSlice, 'usePutWithdrawLiabilitiesMutation')

  const Wrapper = storeWrapper(({ profileId }) => {
    const {
      isLoading: profileIsLoading,
      isSuccess: profileIsSuccess,
      isFetching: profileIsFetching
    } = useGetProfileLiabilitiesQueryMock(profileId)

    const [create, { isLoading: createLoading, isSuccess: createSuccess }] = usePostCreateLiabilityMutationMock()
    const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] = usePutUpdateLiabilityMutationMock()
    const [enroll, { isLoading: enrollLoading, isSuccess: enrollSuccess }] = usePutEnrollLiabilitiesMutationMock()
    const [withdraw, { isLoading: withdrawLoading, isSuccess: withdrawSuccess }] =
      usePutWithdrawLiabilitiesMutationMock()

    async function handleCreate() {
      const data = await create(_createTestData).unwrap()
      console.log(data)
      _liability = data
    }

    async function handleUpdate() {
      const data = await update(_updateTestData).unwrap()
      console.log(data)
    }

    async function handleEnroll() {
      const data = await enroll(_testDebts).unwrap()
      console.log(data)
      _liability = data
    }

    async function handleWithdraw() {
      const data = await withdraw(_testDebts).unwrap()
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

        <div>{createLoading && 'createLoading'}</div>

        <div>{createSuccess && 'createSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <div>{updateLoading && 'updateLoading'}</div>

        <div>{updateSuccess && 'updateSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <div>{enrollLoading && 'enrollLoading'}</div>

        <div>{enrollSuccess && 'enrollSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <div>{withdrawLoading && 'withdrawLoading'}</div>

        <div>{withdrawSuccess && 'withdrawSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <button onClick={handleCreate}>create</button>

        <button onClick={handleUpdate}>update</button>

        <button onClick={handleEnroll}>enroll</button>

        <button onClick={handleWithdraw}>withdraw</button>
      </>
    )
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let _componentData

  const ListWrapper = storeWrapper(({ liabilityId }) => {
    const useGetLiabilityQueryMock = jest.spyOn(liabilityApiSlice, 'useGetLiabilityQuery')
    const usePostSearchLiabilitiesQueryMock = jest.spyOn(liabilityApiSlice, 'usePostSearchLiabilitiesQuery')

    const {
      isLoading: debtIsLoading,
      isSuccess: debtIsSuccess,
      isFetching: debtIsFetching
    } = useGetLiabilityQueryMock(liabilityId)

    const {
      data,
      isLoading: debtsIsLoading,
      isSuccess: debtsIsSuccess,
      isFetching: debtsIsFetching
    } = usePostSearchLiabilitiesQueryMock({})

    _componentData = data

    return (
      <>
        {/* ////////////////////////////////////////////////// */}

        <div>{debtIsLoading && 'debtIsLoading'}</div>

        <div>{debtIsFetching && 'debtIsFetching'}</div>

        <div>
          {debtIsFetching && 'debtIsFetching'}
          {debtIsSuccess && 'debtIsSuccess'}
        </div>

        {/* ////////////////////////////////////////////////// */}

        <div>{debtsIsLoading && 'debtsIsLoading'}</div>

        <div>{debtsIsFetching && 'debtsIsFetching'}</div>

        <div>
          {debtsIsFetching && 'debtsIsFetching'}
          {debtsIsSuccess && 'debtsIsSuccess'}
        </div>
      </>
    )
  })

  const { getByText } = render(<Wrapper profileId={_profileId} />)
  const { getByText: gbt } = render(<ListWrapper liabilityId={_liability} />)

  await waitFor(() => expect(getByText('profileIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(gbt('debtIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(gbt('debtsIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(getByText('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(gbt('debtIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(gbt('debtsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  let state = store.getState()

  // access tags used for cache management
  let cacheTagIds = state[apiSlice.reducerPath].provided.LIABILITY

  // access all profiles in global state
  let debts = selectLiabilityByProfileId(state, _profileId)
  console.log(cacheTagIds)
  console.log(debts)

  let button = getByText('enroll')
  fireEvent.click(button)

  await waitFor(() => expect(getByText('enrollLoading')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(getByText('enrollSuccess')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(getByText('profileIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(gbt('debtIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(gbt('debtsIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(getByText('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(gbt('debtIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(gbt('debtsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  state = store.getState()

  console.log(_liability)

  // access tags used for cache management
  cacheTagIds = state[apiSlice.reducerPath].provided.LIABILITY

  // access all profiles in global state
  debts = selectLiabilityByProfileId(state, _profileId)
  console.log(cacheTagIds)
  console.log(debts)

  // console.log(_componentData)
}, 10000)
