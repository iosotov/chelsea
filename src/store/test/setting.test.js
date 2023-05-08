/* eslint-disable @typescript-eslint/no-unused-vars */
import { Provider } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSDOM } from 'jsdom'
import { apiSlice } from '../api/apiSlice'
import auth, { setCredentials } from '../authSlice'
import setting, {
  selectAllAddresses,
  selectAllAssignees,
  selectAllContacts,
  selectAllCustomFields,
  selectAllLabels
} from '../settingSlice'

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

test('LABEL', async () => {
  let _settingId = '3e23e714-d251-4de8-b627-a2de696a08e7'

  let _createData = {
    name: 'REDUX',
    type: 0
  }

  let _updateData = {
    labelId: _settingId,
    name: 'REDUX UPDATE',
    type: 0
  }

  const useGetLabelQueryMock = jest.spyOn(settingApiSlice, 'useGetLabelQuery')
  const usePostLabelSearchQueryMock = jest.spyOn(settingApiSlice, 'usePostLabelSearchQuery')
  const usePostLabelMutationMock = jest.spyOn(settingApiSlice, 'usePostLabelMutation')
  const usePutLabelMutationMock = jest.spyOn(settingApiSlice, 'usePutLabelMutation')
  const usePutLabelEnableMutationMock = jest.spyOn(settingApiSlice, 'usePutLabelEnableMutation')
  const usePutLabelDisableMutationMock = jest.spyOn(settingApiSlice, 'usePutLabelDisableMutation')

  const ListWrapper = storeWrapper(() => {
    const {
      isLoading: settingsIsLoading,
      isSuccess: settingsIsSuccess,
      isFetching: settingsIsFetching
    } = usePostLabelSearchQueryMock({})

    const [create, { isSuccess: createSuccess, isLoading: createLoading }] = usePostLabelMutationMock()
    const [enable, { isSuccess: enableSuccess, isLoading: enableLoading }] = usePutLabelEnableMutationMock()
    const [disable, { isSuccess: disableSuccess, isLoading: disableLoading }] = usePutLabelDisableMutationMock()

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

  const SettingWrapper = storeWrapper(({ settingId }) => {
    const {
      data,
      isLoading: settingIsLoading,
      isSuccess: settingIsSuccess,
      isFetching: settingIsFetching
    } = useGetLabelQueryMock(settingId)

    console.log(data)

    const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] = usePutLabelMutationMock()

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

  // const { getByText: setting } = render(<SettingWrapper settingId={_settingId} />)
  const { getByText: settings } = render(<ListWrapper />)

  // await waitFor(() => expect(setting('settingIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('settingsIsLoading')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(setting('settingIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('settingsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  let state = store.getState()

  // access tags used for cache management
  let settingTags = state[apiSlice.reducerPath].provided['SETTING-LABEL']

  let allSettings = selectAllLabels(state)

  console.log(settingTags)
  console.log(allSettings)

  let button = settings('disable')
  fireEvent.click(button)

  await waitFor(() => expect(settings('disableLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('disableSuccess')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(setting('settingIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('settingsIsFetching')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(setting('settingIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('settingsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  state = store.getState()

  settingTags = state[apiSlice.reducerPath].provided['SETTING-LABEL']

  allSettings = selectAllLabels(state)

  console.log(settingTags)
  console.log(allSettings)
}, 10000)

test('contact', async () => {
  let _settingId = 'd45631a2-5cfc-44f2-bcfc-0a8c43469447'

  let _createData = {
    name: 'Work Phone',
    type: 0
  }

  let _updateData = {
    contactId: _settingId,
    name: 'Employer Phone',
    type: 0
  }

  const useGetContactQueryMock = jest.spyOn(settingApiSlice, 'useGetContactQuery')
  const usePostContactSearchQueryMock = jest.spyOn(settingApiSlice, 'usePostContactSearchQuery')
  const usePostContactMutationMock = jest.spyOn(settingApiSlice, 'usePostContactMutation')
  const usePutContactMutationMock = jest.spyOn(settingApiSlice, 'usePutContactMutation')
  const usePutContactEnableMutationMock = jest.spyOn(settingApiSlice, 'usePutContactEnableMutation')
  const usePutContactDisableMutationMock = jest.spyOn(settingApiSlice, 'usePutContactDisableMutation')

  const ListWrapper = storeWrapper(() => {
    const {
      isLoading: settingsIsLoading,
      isSuccess: settingsIsSuccess,
      isFetching: settingsIsFetching
    } = usePostContactSearchQueryMock({})

    const [create, { isSuccess: createSuccess, isLoading: createLoading }] = usePostContactMutationMock()
    const [enable, { isSuccess: enableSuccess, isLoading: enableLoading }] = usePutContactEnableMutationMock()
    const [disable, { isSuccess: disableSuccess, isLoading: disableLoading }] = usePutContactDisableMutationMock()

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

  const SettingWrapper = storeWrapper(({ settingId }) => {
    const {
      data,
      isLoading: settingIsLoading,
      isSuccess: settingIsSuccess,
      isFetching: settingIsFetching
    } = useGetContactQueryMock(settingId)

    console.log(data)

    const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] = usePutContactMutationMock()

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

  // const { getByText: setting } = render(<SettingWrapper settingId={_settingId} />)
  const { getByText: settings } = render(<ListWrapper />)

  // await waitFor(() => expect(setting('settingIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('settingsIsLoading')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(setting('settingIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('settingsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  let state = store.getState()

  // access tags used for cache management
  let settingTags = state[apiSlice.reducerPath].provided['SETTING-CONTACT']

  let allSettings = selectAllContacts(state)

  console.log(settingTags)
  console.log(allSettings)

  let button = settings('disable')
  fireEvent.click(button)

  await waitFor(() => expect(settings('disableLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('disableSuccess')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(setting('settingIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('settingsIsFetching')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(setting('settingIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(settings('settingsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  state = store.getState()

  // access tags used for cache management
  settingTags = state[apiSlice.reducerPath].provided['SETTING-CONTACT']

  allSettings = selectAllContacts(state)

  console.log(settingTags)
  console.log(allSettings)
}, 10000)

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

test('assignee', async () => {
  let _settingId = '1b775b2e-66c5-45f3-bab0-f9dfe586720b'

  let _createData = {
    name: 'Account Manager 002',
    filters: {
      dataSourceType: 'systemsetting_datasource_employee',
      filters: {
        columns: [
          {
            index: 0,
            displayName: 'RoleName',
            columnName: 'RoleName',
            search: {
              value: 'SALES',
              operator: 0
            }
          }
        ],
        order: [
          {
            columnName: 'EmployeeAlias',
            direction: 0
          }
        ]
      }
    },
    companyName: '920502EB-684B-43DB-BB03-0BEF5FE00CE0',
    description: 'testing redux'
  }

  let _updateData = {
    assigneeId: _settingId,
    name: 'Account Manager 0003',
    filters: {
      dataSourceType: 'systemsetting_datasource_employee',
      filters: {
        columns: [
          {
            index: 0,
            displayName: 'RoleName',
            columnName: 'RoleName',
            search: {
              value: 'SALES',
              operator: 0
            }
          }
        ],
        order: [
          {
            columnName: 'EmployeeAlias',
            direction: 0
          }
        ]
      }
    },
    companyName: '920502EB-684B-43DB-BB03-0BEF5FE00CE0',
    description: 'testing redux updated'
  }

  const useGetAssigneeQueryMock = jest.spyOn(settingApiSlice, 'useGetAssigneeQuery')
  const useGetAssigneesQueryMock = jest.spyOn(settingApiSlice, 'useGetAssigneesQuery')
  const useGetAssigneeDatasourceQueryMock = jest.spyOn(settingApiSlice, 'useGetAssigneeDatasourceQuery')
  const usePostAssigneeMutationMock = jest.spyOn(settingApiSlice, 'usePostAssigneeMutation')
  const usePutAssigneeMutationMock = jest.spyOn(settingApiSlice, 'usePutAssigneeMutation')
  const usePutAssigneeEnableMutationMock = jest.spyOn(settingApiSlice, 'usePutAssigneeEnableMutation')
  const usePutAssigneeDisableMutationMock = jest.spyOn(settingApiSlice, 'usePutAssigneeDisableMutation')

  const ListWrapper = storeWrapper(() => {
    const {
      isLoading: settingsIsLoading,
      isSuccess: settingsIsSuccess,
      isFetching: settingsIsFetching
    } = useGetAssigneesQueryMock()

    const [create, { isSuccess: createSuccess, isLoading: createLoading }] = usePostAssigneeMutationMock()
    const [enable, { isSuccess: enableSuccess, isLoading: enableLoading }] = usePutAssigneeEnableMutationMock()
    const [disable, { isSuccess: disableSuccess, isLoading: disableLoading }] = usePutAssigneeDisableMutationMock()

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
  const SettingWrapper = storeWrapper(({ settingId }) => {
    const {
      data,
      isLoading: settingIsLoading,
      isSuccess: settingIsSuccess,
      isFetching: settingIsFetching
    } = useGetAssigneeQueryMock(settingId)
    const {
      data: datasource,
      isLoading: datasourceIsLoading,
      isSuccess: datasourceIsSuccess,
      isFetching: datasourceIsFetching
    } = useGetAssigneeDatasourceQueryMock(settingId)

    console.log(data)
    console.log(datasource)

    const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] = usePutAssigneeMutationMock()

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

        <div>{datasourceIsLoading && 'datasourceIsLoading'}</div>

        <div>{datasourceIsFetching && 'datasourceIsFetching'}</div>

        <div>
          {datasourceIsFetching && 'datasourceIsFetching'}
          {datasourceIsSuccess && 'datasourceIsSuccess'}
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

  const { getByText: setting } = render(<SettingWrapper settingId={_settingId} />)
  const { getByText: settings } = render(<ListWrapper />)

  await waitFor(() => expect(settings('settingsIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(setting('settingIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(setting('datasourceIsLoading')).toBeInTheDocument(), { timeout: 5000 })

  await waitFor(() => expect(settings('settingsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(setting('settingIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(setting('datasourceIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  let state = store.getState()

  // access tags used for cache management
  let settingTags = state[apiSlice.reducerPath].provided['SETTING-ASSIGNEE']

  let allSettings = selectAllAssignees(state)

  console.log(settingTags)
  console.log(allSettings)

  // let button = settings('disable')
  // fireEvent.click(button)

  // await waitFor(() => expect(settings('disableLoading')).toBeInTheDocument(), { timeout: 5000 })
  // await waitFor(() => expect(settings('disableSuccess')).toBeInTheDocument(), { timeout: 5000 })
  // await waitFor(() => expect(settings('settingsIsFetching')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(setting('settingIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  // await waitFor(() => expect(settings('settingsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(setting('settingIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  // state = store.getState()

  // // access tags used for cache management
  // settingTags = state[apiSlice.reducerPath].provided['SETTING-ASSIGNEE']

  // allSettings = selectAllAssignees(state)

  // console.log(settingTags)
  // console.log(allSettings)
}, 10000)
