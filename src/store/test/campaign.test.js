import { Provider } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import profile, { selectProfileById } from '../profileSlice'
import { JSDOM } from 'jsdom'
import { apiSlice } from '../api/apiSlice'
import auth, { setCredentials } from '../authSlice'
import campaign, { selectAllCampaigns } from '../campaignSlice'

import SolApi from '../api/SolApi'
import { campaignApiSlice } from '../api/campaignApiSlice'

// import { waitForApiCall } from './helper'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    campaign,
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

    _campaignId = 'DCF4CB92-F823-4261-9AC1-B73F06C62600'
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

test('campaign api', async () => {
  const _createTestData = {
    campaignName: 'ReduxCampaign',
    description: 'testing redux',
    phone: '4447777888',
    displayName: 'Redux test',
    companyId: 'f8a75745-f63e-4924-b8b4-7dbdf4dcf9e4'
  }

  let _newCampaign = 'ecf66081-20b0-4b76-8330-7ce1d7671635'

  const _updateTestData = {
    campaignId: _newCampaign,
    campaignName: 'test redux update',
    description: null,
    phone: '9999999991',
    displayName: 'Redux test update',
    companyId: '920502eb-684b-43db-bb03-0bef5fe00ce0'
  }

  const useGetCampaignQueryMock = jest.spyOn(campaignApiSlice, 'useGetCampaignQuery')
  const useGetCampaignsQueryMock = jest.spyOn(campaignApiSlice, 'useGetCampaignsQuery')
  const useCreateCampaignMutationMock = jest.spyOn(campaignApiSlice, 'useCreateCampaignMutation')
  const useUpdateCampaignMutationMock = jest.spyOn(campaignApiSlice, 'useUpdateCampaignMutation')
  const useDeleteCampaignMutationMock = jest.spyOn(campaignApiSlice, 'useDeleteCampaignMutation')

  const Wrapper = storeWrapper(({ campaignId }) => {
    const {
      isLoading: campaignIsLoading,
      isSuccess: campaignIsSuccess,
      isFetching: campaignIsFetching
    } = useGetCampaignQueryMock(campaignId)

    // const { isLoading, isSuccess, isFetching } = useGetCampaignsQueryMock({})

    const [create, { isLoading: createLoading, isSuccess: createSuccess }] = useCreateCampaignMutationMock()
    const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] = useUpdateCampaignMutationMock()
    const [deleteTrigger, { isLoading: deleteLoading, isSuccess: deleteSuccess }] = useDeleteCampaignMutationMock()

    async function handleCreate() {
      const data = await create(_createTestData).unwrap()
      console.log(data)
      _newCampaign = data
    }

    async function handleUpdate() {
      const { data } = await update(_updateTestData).unwrap()
      console.log(data)
    }

    async function handleDelete() {
      const { data } = await deleteTrigger(_newCampaign).unwrap()
      console.log(data)
    }

    return (
      <>
        {/* <div>{isLoading && 'isLoading'}</div>

        <div>{isFetching && 'isFetching'}</div>

        <div>
          {isFetching && 'isFetching'}
          {isSuccess && 'isSuccess'}
        </div> */}

        {/* ////////////////////////////////////////////////// */}
        <div>{campaignIsLoading && 'campaignIsLoading'}</div>

        <div>{campaignIsFetching && 'campaignIsFetching'}</div>

        <div>
          {campaignIsFetching && 'campaignIsFetching'}
          {campaignIsSuccess && 'campaignIsSuccess'}
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
  const ListWrapper = storeWrapper(() => {
    const { isLoading, isSuccess, isFetching } = useGetCampaignsQueryMock({})

    // const [create, { isLoading: createLoading, isSuccess: createSuccess }] = useCreateCampaignMutationMock()
    // const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] = useUpdateCampaignMutationMock()
    // const [deleteTrigger, { isLoading: deleteLoading, isSuccess: deleteSuccess }] = useDeleteCampaignMutationMock()

    // async function handleCreate() {
    //   const data = await create(_createTestData).unwrap()
    //   console.log(data)
    //   _newBankAccountId = data
    // }

    // async function handleUpdate() {
    //   const { data } = await update(_updateTestData).unwrap()
    //   console.log(data)
    // }

    // async function handleDelete() {
    //   const { data } = await deleteTrigger(_newBankAccountId).unwrap()
    //   console.log(data)
    // }

    return (
      <>
        <div>{isLoading && 'isLoading'}</div>

        <div>{isFetching && 'isFetching'}</div>

        <div>
          {isFetching && 'isFetching'}
          {isSuccess && 'isSuccess'}
        </div>

        {/* ////////////////////////////////////////////////// */}
        {/* <div>{campaignIsLoading && 'campaignIsLoading'}</div>

        <div>{campaignIsFetching && 'campaignIsFetching'}</div>

        <div>
          {campaignIsFetching && 'campaignIsFetching'}
          {campaignIsSuccess && 'campaignIsSuccess'}
        </div>

        <div>{createLoading && 'createLoading'}</div>

        <div>{createSuccess && 'createSuccess'}</div>

        <div>{updateLoading && 'updateLoading'}</div>

        <div>{updateSuccess && 'updateSuccess'}</div>

        <div>{deleteLoading && 'deleteLoading'}</div>

        <div>{deleteSuccess && 'deleteSuccess'}</div>

        <button onClick={handleCreate}>create</button>

        <button onClick={handleUpdate}>update</button>

        <button onClick={handleDelete}>delete</button> */}
      </>
    )
  })

  const { getByText } = render(<Wrapper campaignId={'dcf4cb92-f823-4261-9ac1-b73f06c62600'} />)

  const { getByText: gBT } = render(<ListWrapper />)
  await waitFor(() => expect(getByText('campaignIsLoading')).toBeInTheDocument(), { timeout: 5000 })

  await waitFor(() => expect(gBT('isLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(getByText('campaignIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  await waitFor(() => expect(gBT('isSuccess')).toBeInTheDocument(), { timeout: 5000 })
  let state = store.getState()

  // access tags used for cache management
  let cacheTagIds = state[apiSlice.reducerPath].provided.CAMPAIGN

  // access all profiles in global state
  let campaigns = selectAllCampaigns(state)
  console.log(cacheTagIds)
  console.log(campaigns)

  let button = getByText('update')
  fireEvent.click(button)

  await waitFor(() => expect(getByText('updateLoading')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(getByText('updateSuccess')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(gBT('isFetching')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(gBT('isSuccess')).toBeInTheDocument(), { timeout: 5000 })

  state = store.getState()

  // access tags used for cache management
  cacheTagIds = state[apiSlice.reducerPath].provided.CAMPAIGN

  // access all profiles in global state
  campaigns = selectAllCampaigns(state)
  console.log(cacheTagIds)
  console.log(campaigns)

  button = getByText('delete')
  fireEvent.click(button)

  await waitFor(() => expect(getByText('deleteLoading')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(getByText('deleteSuccess')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(getByText('isFetching')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument(), { timeout: 3000 })

  state = store.getState()

  // access tags used for cache management
  cacheTagIds = state[apiSlice.reducerPath].provided.CAMPAIGN

  // access all profiles in global state
  campaigns = selectAllCampaigns(state)
  console.log(cacheTagIds)
  console.log(campaigns)
})
