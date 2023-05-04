import { Provider } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSDOM } from 'jsdom'
import { apiSlice } from '../api/apiSlice'
import auth, { setCredentials } from '../authSlice'
import setting, { selectAllAddresses } from '../settingSlice'

import SolApi from '../api/SolApi'
import { settingApiSlice } from '../api/settingApiSlice'

// import { waitForApiCall } from './helper'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth,
    setting
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

test('address', async () => {
  let _settingId = '43916d1e-1461-493e-b170-c19c64409dfe'

  let _createData = {
    name: 'Redux Address'
  }

  let _updateData = {
    addressId: _settingId,
    name: 'REDUX update address'
  }

  const useGetAddressQueryMock = jest.spyOn(settingApiSlice, 'useGetAddressQuery')
  const useGetAddressesQueryMock = jest.spyOn(settingApiSlice, 'useGetAddressesQuery')
  const usePostAddressMutationMock = jest.spyOn(settingApiSlice, 'usePostAddressMutation')
  const usePostAddressSearchQueryMock = jest.spyOn(settingApiSlice, 'usePostAddressSearchQuery')
  const usePutAddressMutationMock = jest.spyOn(settingApiSlice, 'usePutAddressMutation')
  const usePutAddressEnableMutationMock = jest.spyOn(settingApiSlice, 'usePutAddressEnableMutation')
  const usePutAddressDisableMutationMock = jest.spyOn(settingApiSlice, 'usePutAddressDisableMutation')

  const ListWrapper = storeWrapper(() => {
    const {
      isLoading: settingsIsLoading,
      isSuccess: settingsIsSuccess,
      isFetching: settingsIsFetching
    } = useGetAddressesQueryMock()

    const [create, { isSuccess: createSuccess, isLoading: createLoading }] = usePostAddressMutationMock()
    const [enable, { isSuccess: enableSuccess, isLoading: enableLoading }] = usePutAddressEnableMutationMock()
    const [disable, { isSuccess: disableSuccess, isLoading: disableLoading }] = usePutAddressDisableMutationMock()

    async function handleCreate() {
      const data = await create(_createData).unwrap()
      console.log(data)
    }

    async function handleEnable() {
      const data = await enable(_settingId).unwrap()
      console.log(data)
    }

    async function handleDisable() {
      const data = await disable(_settingId).unwrap()
      console.log(data)
    }

    return (
      <>
        {/* ////////////////////////////////////////////////// */}

        <div>{settingsIsLoading && 'settingsIsLoading'}</div>

        <div>{settingsIsFetching && 'settingsIsFetching'}</div>

        <div>
          {settingsIsFetching && 'settingsIsFetching'}
          {settingsIsSuccess && 'settingsIsSuccess'}
        </div>

        {/* ////////////////////////////////////////////////// */}

        <div>{createLoading && 'createLoading'}</div>

        <div>{createSuccess && 'createSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <div>{enableLoading && 'enableLoading'}</div>

        <div>{enableSuccess && 'enableSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <div>{disableLoading && 'disableLoading'}</div>

        <div>{disableSuccess && 'disableSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <button onClick={handleCreate}>create</button>

        <button onClick={handleEnable}>enable</button>

        <button onClick={handleDisable}>disable</button>
      </>
    )
  })
  const SearchWrapper = storeWrapper(() => {
    const {
      data,
      isLoading: searchIsLoading,
      isSuccess: searchIsSuccess,
      isFetching: searchIsFetching
    } = usePostAddressSearchQueryMock({})

    console.log(data)

    return (
      <>
        {/* ////////////////////////////////////////////////// */}

        <div>{searchIsLoading && 'searchIsLoading'}</div>

        <div>{searchIsFetching && 'searchIsFetching'}</div>

        <div>
          {searchIsFetching && 'searchIsFetching'}
          {searchIsSuccess && 'searchIsSuccess'}
        </div>
      </>
    )
  })
  const SettingWrapper = storeWrapper(({ settingId }) => {
    const {
      data,
      isLoading: settingIsLoading,
      isSuccess: settingIsSuccess,
      isFetching: settingIsFetching
    } = useGetAddressQueryMock(settingId)

    console.log(data)

    const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] = usePutAddressMutationMock()

    async function handleUpdate() {
      const data = await update(_updateData)
      console.log(data.error)
    }

    return (
      <>
        {/* ////////////////////////////////////////////////// */}

        <div>{settingIsLoading && 'settingIsLoading'}</div>

        <div>{settingIsFetching && 'settingIsFetching'}</div>

        <div>
          {settingIsFetching && 'settingIsFetching'}
          {settingIsSuccess && 'settingIsSuccess'}
        </div>

        {/* ////////////////////////////////////////////////// */}

        <div>{updateLoading && 'updateLoading'}</div>

        <div>{updateSuccess && 'updateSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <button onClick={handleUpdate}>update</button>
      </>
    )
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const { getByText: search } = render(<SearchWrapper />)

  // const { getByText: setting } = render(<SettingWrapper settingId={_settingId} />)
  const { getByText: settings } = render(<ListWrapper />)

  // await waitFor(() => expect(setting('settingIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('settingsIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(search('searchIsLoading')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(setting('settingIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('settingsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(search('searchIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  let state = store.getState()

  // access tags used for cache management
  let settingTags = state[apiSlice.reducerPath].provided['SETTING-ADDRESS']

  let allSettings = selectAllAddresses(state)

  console.log(settingTags)
  console.log(allSettings)

  let button = settings('disable')
  fireEvent.click(button)

  await waitFor(() => expect(settings('disableLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('disableSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('settingsIsFetching')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(setting('settingIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(search('searchIsFetching')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(setting('settingIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('settingsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(search('searchIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  state = store.getState()

  // access tags used for cache management
  settingTags = state[apiSlice.reducerPath].provided['SETTING-ADDRESS']

  allSettings = selectAllAddresses(state)

  console.log(settingTags)
  console.log(allSettings)
}, 10000)
