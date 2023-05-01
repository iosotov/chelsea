import { Provider } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import profile, { selectProfileById } from '../profileSlice'
import { JSDOM } from 'jsdom'
import { apiSlice } from '../api/apiSlice'
import auth, { setCredentials } from '../authSlice'
import bankAccount, { selectBankAccountsByProfileId } from '../bankAccountSlice'
import SolApi from '../api/SolApi'
import { bankAccountApiSlice } from '../api/bankAccountApiSlice'

// import { waitForApiCall } from './helper'

let _profileId

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    bankAccount,
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

    _profileId = '1326323286'
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

test('getProfileBankAccounts', async () => {
  const _createTestData = {
    profileId: _profileId,
    bankRoutingNumber: '55555',
    bankName: 'redux',
    bankAccountNumber: '5555555',
    phoneNumber: '1112223333',
    bankAccountType: 0,
    address: 'redux',
    address2: 'redux',
    city: 'redux',
    zipcode: '88888',
    state: 'ca',
    accountName: 'redux'
  }
  let _newBankAccountId

  const _updateTestData = {
    profileId: _profileId,
    bankAccountId: _newBankAccountId,
    bankRoutingNumber: '543534',
    bankName: 'chase 4534 redux',
    bankAccountNumber: '435453',
    phoneNumber: '9495647777',
    bankAccountType: 0,
    address: 'a54343',
    address2: 'b543534',
    city: 'cc43534535',
    zipcode: '12445',
    state: 'ny',
    accountName: 'test clients'
  }

  const useGetBankAccountsQueryMock = jest.spyOn(bankAccountApiSlice, 'useGetBankAccountsQuery')
  const useCreateBankAccountMutationMock = jest.spyOn(bankAccountApiSlice, 'useCreateBankAccountMutation')
  const useUpdateBankAccountMutationMock = jest.spyOn(bankAccountApiSlice, 'useUpdateBankAccountMutation')
  const useDeleteBankAccountMutationMock = jest.spyOn(bankAccountApiSlice, 'useDeleteBankAccountMutation')
  const Wrapper = storeWrapper(({ profileId }) => {
    const { isLoading, isSuccess, isFetching } = useGetBankAccountsQueryMock(profileId)

    const [create, { isLoading: createLoading, isSuccess: createSuccess }] = useCreateBankAccountMutationMock()
    const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] = useUpdateBankAccountMutationMock()
    const [deleteTrigger, { isLoading: deleteLoading, isSuccess: deleteSuccess }] = useDeleteBankAccountMutationMock()

    async function handleCreate() {
      const data = await create(_createTestData).unwrap()
      console.log(data)
      _newBankAccountId = data
    }

    async function handleUpdate() {
      const { data } = await update(_updateTestData).unwrap()
      console.log(data)
    }

    async function handleDelete() {
      const { data } = await deleteTrigger(_newBankAccountId).unwrap()
      console.log(data)
    }

    return (
      <>
        <div>{isLoading && 'isLoading'}</div>

        <div>{isFetching && 'isFetching'}</div>

        <div>
          {isFetching && 'isFetching'}
          {isSuccess && 'isSuccess'}
        </div>

        <div>{createLoading && 'createLoading'}</div>

        <div>{createSuccess && 'createSuccess'}</div>

        <div>{updateLoading && 'updateLoading'}</div>

        <div>{updateSuccess && 'updateSuccess'}</div>

        <div>{deleteLoading && 'deleteLoading'}</div>

        <div>{deleteSuccess && 'deleteSuccess'}</div>

        <button onClick={handleCreate}>create</button>

        <button onClick={handleUpdate}>update</button>

        <button onClick={handleDelete}>delete</button>
      </>
    )
  })

  const { getByText } = render(<Wrapper profileId={_profileId} />)
  await waitFor(() => expect(getByText('isLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument(), { timeout: 5000 })
  let state = store.getState()

  // access tags used for cache management
  let cacheTagIds = state[apiSlice.reducerPath].provided.BANKACCOUNT

  // access all profiles in global state
  let bankaccounts = selectBankAccountsByProfileId(state, _profileId)
  console.log(cacheTagIds)
  console.log(bankaccounts)

  let button = getByText('create')
  fireEvent.click(button)

  await waitFor(() => expect(getByText('createLoading')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(getByText('createSuccess')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(getByText('isFetching')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument(), { timeout: 3000 })

  state = store.getState()

  // access tags used for cache management
  cacheTagIds = state[apiSlice.reducerPath].provided.BANKACCOUNT

  // access all profiles in global state
  bankaccounts = selectBankAccountsByProfileId(state, _profileId)
  console.log(cacheTagIds)
  console.log(bankaccounts)

  button = getByText('delete')
  fireEvent.click(button)

  await waitFor(() => expect(getByText('deleteLoading')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(getByText('deleteSuccess')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(getByText('isFetching')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument(), { timeout: 3000 })

  state = store.getState()

  // access tags used for cache management
  cacheTagIds = state[apiSlice.reducerPath].provided.BANKACCOUNT

  // access all profiles in global state
  bankaccounts = selectBankAccountsByProfileId(store.getState(), _profileId)
  console.log(cacheTagIds)
  console.log(bankaccounts)
})
