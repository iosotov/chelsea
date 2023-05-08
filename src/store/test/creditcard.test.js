import { Provider } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import profile, { selectProfileById } from '../profileSlice'
import { JSDOM } from 'jsdom'
import { apiSlice } from '../api/apiSlice'
import auth, { setCredentials } from '../authSlice'
import creditCard, { selectCreditCardsByProfileId } from '../creditCardSlice'

import SolApi from '../api/SolApi'
import { creditCardApiSlice } from '../api/creditCardApiSlice'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    creditCard,
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

test('profile creditCard api', async () => {
  let _profileId = '1326323286'
  let _creditCardId = 'd1a987f2-495a-405f-b9df-b7401e22f892'

  const _createData = {
    name: 'REDUX CARD',
    profileId: _profileId,
    type: 0,
    cardNumber: '1234567890',
    expirationMonth: '12',
    expirationYear: '26',
    securityCode: '123',
    address: '123 almador',
    address2: null,
    city: 'Irvine',
    state: 'ca',
    zipcode: '12345'
  }

  const _updateData = {
    name: 'REDUX CARD UPDATE',
    profileId: _profileId,
    creditCardId: _creditCardId,
    type: 1,
    cardNumber: '0987654321',
    expirationMonth: '12',
    expirationYear: '26',
    securityCode: '123',
    address: '123 almador',
    address2: null,
    city: 'Irvine',
    state: 'ca',
    zipcode: '12345'
  }

  const useGetCreditCardsQueryMock = jest.spyOn(creditCardApiSlice, 'useGetCreditCardsQuery')
  const useCreateCreditCardMutationMock = jest.spyOn(creditCardApiSlice, 'useCreateCreditCardMutation')
  const useUpdateCreditCardMutationMock = jest.spyOn(creditCardApiSlice, 'useUpdateCreditCardMutation')
  const useDeleteCreditCardMutationMock = jest.spyOn(creditCardApiSlice, 'useDeleteCreditCardMutation')

  const ProfileWrapper = storeWrapper(({ profileId }) => {
    const {
      isLoading: profileIsLoading,
      isSuccess: profileIsSuccess,
      isFetching: profileIsFetching
    } = useGetCreditCardsQueryMock(profileId)

    const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] = useUpdateCreditCardMutationMock()

    const [create, { isLoading: createLoading, isSuccess: createSuccess }] = useCreateCreditCardMutationMock()

    const [disable, { isLoading: disableLoading, isSuccess: disableSuccess }] = useDeleteCreditCardMutationMock()

    async function handleUpdate() {
      const data = await update(_updateData).unwrap()
      console.log(data)
    }

    async function handleCreate() {
      const data = await create(_createData).unwrap()
      console.log(data)
    }

    async function handleDelete() {
      const data = await disable(_creditCardId).unwrap()
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

        <div>{updateLoading && 'updateLoading'}</div>

        <div>{updateSuccess && 'updateSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <div>{createLoading && 'createLoading'}</div>

        <div>{createSuccess && 'createSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <div>{disableLoading && 'disableLoading'}</div>

        <div>{disableSuccess && 'disableSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <button onClick={handleUpdate}>update</button>

        <button onClick={handleCreate}>create</button>

        <button onClick={handleDelete}>disable</button>
      </>
    )
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const { getByText: profile } = render(<ProfileWrapper profileId={_profileId} />)

  await waitFor(() => expect(profile('profileIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(profile('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  let state = store.getState()

  // access tags used for cache management
  let creditCardTags = state[apiSlice.reducerPath].provided.CREDITCARD

  let ccs = selectCreditCardsByProfileId(state, _profileId)

  console.log(creditCardTags)
  console.log(ccs)

  let button = profile('disable')
  fireEvent.click(button)

  await waitFor(() => expect(profile('disableLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(profile('disableSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(profile('profileIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(profile('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  state = store.getState()

  creditCardTags = state[apiSlice.reducerPath].provided.CREDITCARD

  ccs = selectCreditCardsByProfileId(state, _profileId)

  console.log(creditCardTags)
  console.log(ccs)
}, 10000)
