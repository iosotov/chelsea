import { Provider } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import profile, { selectProfileById } from '../profileSlice'
import { JSDOM } from 'jsdom'
import { apiSlice } from '../api/apiSlice'
import auth, { setCredentials } from '../authSlice'
import company, { selectAllCompanies } from '../companySlice'

import SolApi from '../api/SolApi'
import { faker } from '@faker-js/faker'
import { companyApiSlice } from '../api/companyApiSlice'

// import { waitForApiCall } from './helper'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    company,
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

let _companyId

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

    _companyId = '920502eb-684b-43db-bb03-0bef5fe00ce0'
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
    name: 'Test REDUX company 02',
    phone: faker.phone.number('###-###-####'),
    parentCompanyId: '5a7167c1-7e8f-4178-8556-7b6fb5ff3d2a'
  }

  const _updateTestData = {
    name: 'Test REDUX UPDATE company',
    phone: faker.phone.number('###-###-####'),
    companyId: _companyId
  }

  const useGetCompanyQueryMock = jest.spyOn(companyApiSlice, 'useGetCompanyQuery')
  const useGetCompaniesQueryMock = jest.spyOn(companyApiSlice, 'useGetCompaniesQuery')
  const useCreateCompanyMutationMock = jest.spyOn(companyApiSlice, 'useCreateCompanyMutation')
  const useUpdateCompanyMutationMock = jest.spyOn(companyApiSlice, 'useUpdateCompanyMutation')
  const useEnableCompanyMutationMock = jest.spyOn(companyApiSlice, 'useEnableCompanyMutation')
  const useDisableCompanyMutationMock = jest.spyOn(companyApiSlice, 'useDisableCompanyMutation')

  const Wrapper = storeWrapper(({ companyId }) => {
    const {
      isLoading: companyIsLoading,
      isSuccess: companyIsSuccess,
      isFetching: companyIsFetching
    } = useGetCompanyQueryMock(companyId)

    // const { isLoading, isSuccess, isFetching } = useGetCampaignsQueryMock({})

    const [create, { isLoading: createLoading, isSuccess: createSuccess }] = useCreateCompanyMutationMock()
    const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] = useUpdateCompanyMutationMock()
    const [enable, { isLoading: enableLoading, isSuccess: enableSuccess }] = useEnableCompanyMutationMock()
    const [disable, { isLoading: disableLoading, isSuccess: disableSuccess }] = useDisableCompanyMutationMock()

    async function handleCreate() {
      const data = await create(_createTestData).unwrap()
      console.log(data)
      _companyId = data
    }

    async function handleUpdate() {
      const data = await update(_updateTestData).unwrap()
      console.log(data)
    }

    async function handleEnable() {
      const data = await enable(_companyId).unwrap()
      console.log(data)
    }

    async function handleDisable() {
      const data = await disable(_companyId).unwrap()
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
        <div>{companyIsLoading && 'companyIsLoading'}</div>

        <div>{companyIsFetching && 'companyIsFetching'}</div>

        <div>
          {companyIsFetching && 'companyIsFetching'}
          {companyIsSuccess && 'companyIsSuccess'}
        </div>

        <div>{createLoading && 'createLoading'}</div>

        <div>{createSuccess && 'createSuccess'}</div>

        <div>{updateLoading && 'updateLoading'}</div>

        <div>{updateSuccess && 'updateSuccess'}</div>

        <div>{enableLoading && 'enableLoading'}</div>

        <div>{enableSuccess && 'enableSuccess'}</div>

        <div>{disableLoading && 'disableLoading'}</div>

        <div>{disableSuccess && 'disableSuccess'}</div>

        <button onClick={handleCreate}>create</button>

        <button onClick={handleUpdate}>update</button>

        <button onClick={handleEnable}>enable</button>

        <button onClick={handleDisable}>disable</button>
      </>
    )
  })
  const ListWrapper = storeWrapper(() => {
    const { isLoading, isSuccess, isFetching } = useGetCompaniesQueryMock({})

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

  const { getByText } = render(<Wrapper companyId={_companyId} />)

  const { getByText: gBT } = render(<ListWrapper />)
  await waitFor(() => expect(getByText('companyIsLoading')).toBeInTheDocument(), { timeout: 5000 })

  await waitFor(() => expect(gBT('isLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(getByText('companyIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  await waitFor(() => expect(gBT('isSuccess')).toBeInTheDocument(), { timeout: 5000 })
  let state = store.getState()

  // access tags used for cache management
  let cacheTagIds = state[apiSlice.reducerPath].provided.COMPANY

  // access all profiles in global state
  let companies = selectAllCompanies(state)
  console.log(cacheTagIds)
  console.log(companies)

  let button = getByText('disable')
  fireEvent.click(button)

  await waitFor(() => expect(getByText('disableLoading')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(getByText('disableSuccess')).toBeInTheDocument(), { timeout: 3000 })

  // await waitFor(() => expect(getByText('enableLoading')).toBeInTheDocument(), { timeout: 3000 })
  // await waitFor(() => expect(getByText('enableSuccess')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(gBT('isFetching')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(gBT('isSuccess')).toBeInTheDocument(), { timeout: 3000 })

  state = store.getState()

  // access tags used for cache management
  cacheTagIds = state[apiSlice.reducerPath].provided.COMPANY

  // access all profiles in global state
  companies = selectAllCompanies(state)
  console.log(cacheTagIds)
  console.log(companies)

  // button = getByText('delete')
  // fireEvent.click(button)

  // await waitFor(() => expect(getByText('deleteLoading')).toBeInTheDocument(), { timeout: 3000 })
  // await waitFor(() => expect(getByText('deleteSuccess')).toBeInTheDocument(), { timeout: 3000 })
  // await waitFor(() => expect(getByText('isFetching')).toBeInTheDocument(), { timeout: 3000 })
  // await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument(), { timeout: 3000 })

  // state = store.getState()

  // // access tags used for cache management
  // cacheTagIds = state[apiSlice.reducerPath].provided.CAMPAIGN

  // // access all profiles in global state
  // companies = selectAllCompanies(state)
  // console.log(cacheTagIds)
  // console.log(companies)
})
