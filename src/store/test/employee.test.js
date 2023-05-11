import { Provider } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSDOM } from 'jsdom'
import { apiSlice } from '../api/apiSlice'
import auth, { setCredentials } from '../authSlice'
import employee, { selectAllEmployees, selectEmployeeById } from '../employeeSlice'
import SolApi from '../api/SolApi'
import { faker } from '@faker-js/faker'
import { employeeApiSlice } from '../api/employeeApiSlice'

// import { waitForApiCall } from './helper'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    employee,
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

test('employee', async () => {
  let _employeeId = '343583e8-6bc1-4a3a-a493-22380c4f0609'

  const _createData = {
    firstName: faker.name.firstName(),
    lastName: 'redux',
    primaryEmail: faker.internet.email(),
    primaryPhone: faker.phone.number('###-###-####'),
    companyId: '5a7167c1-7e8f-4178-8556-7b6fb5ff3d2a'
  }

  _createData.alias = `${_createData.firstName} ${_createData.lastName}`

  console.log(_createData)

  const _updateData = {
    employeeId: _employeeId,
    firstName: faker.name.firstName(),
    lastName: 'redux',
    middle: faker.name.middleName(),
    primaryEmail: faker.internet.email(),
    primaryPhone: faker.phone.number('###-###-####'),
    companyId: '5a7167c1-7e8f-4178-8556-7b6fb5ff3d2a'
  }

  const _grantData = {
    employeeId: _employeeId,
    password: 'pass123',
    roles: [
      '6ba8682f-7bc4-49fb-8533-983ece335d69',
      'a478331c-d998-4116-a70b-e9c1abe56a43',
      '255b152e-f6cb-40d1-b52d-f3710bf88020'
    ]
  }

  _updateData.alias = `${_updateData.firstName} ${_updateData.lastName}`

  const useGetEmployeeInfoQueryMock = jest.spyOn(employeeApiSlice, 'useGetEmployeeInfoQuery')
  const useGetEmployeeBasicQueryMock = jest.spyOn(employeeApiSlice, 'useGetEmployeeBasicQuery')
  const useGetEmployeeSnapshotQueryMock = jest.spyOn(employeeApiSlice, 'useGetEmployeeSnapshotQuery')
  const usePostEmployeeSearchQueryMock = jest.spyOn(employeeApiSlice, 'usePostEmployeeSearchQuery')
  const usePostEmployeeCreateMutationMock = jest.spyOn(employeeApiSlice, 'usePostEmployeeCreateMutation')
  const usePutEmployeeUpdateMutationMock = jest.spyOn(employeeApiSlice, 'usePutEmployeeUpdateMutation')
  const usePutEmployeeEnableMutationMock = jest.spyOn(employeeApiSlice, 'usePutEmployeeEnableMutation')
  const usePutEmployeeDisableMutationMock = jest.spyOn(employeeApiSlice, 'usePutEmployeeDisableMutation')
  const usePostEmployeeGrantAuthMutationMock = jest.spyOn(employeeApiSlice, 'usePostEmployeeGrantAuthMutation')

  const EmployeeWrapper = storeWrapper(({ employeeId }) => {
    const {
      isLoading: employeeIsLoading,
      isSuccess: employeeIsSuccess,
      isFetching: employeeIsFetching
    } = useGetEmployeeInfoQueryMock(employeeId)
    const {
      data: basicData,
      isLoading: basicIsLoading,
      isSuccess: basicIsSuccess,
      isFetching: basicIsFetching
    } = useGetEmployeeBasicQueryMock(employeeId)

    const {
      data: snapshotData,
      isLoading: snapshotIsLoading,
      isSuccess: snapshotIsSuccess,
      isFetching: snapshotIsFetching
    } = useGetEmployeeSnapshotQueryMock(employeeId)

    const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] = usePutEmployeeUpdateMutationMock()

    async function handleUpdate() {
      const data = await update(_updateData).unwrap()
      console.log(data)
    }

    console.log(basicData, snapshotData)

    return (
      <>
        {/* ////////////////////////////////////////////////// */}

        <div>{employeeIsLoading && 'employeeIsLoading'}</div>

        <div>{employeeIsFetching && 'employeeIsFetching'}</div>

        <div>
          {employeeIsFetching && 'employeeIsFetching'}
          {employeeIsSuccess && 'employeeIsSuccess'}
        </div>

        {/* ////////////////////////////////////////////////// */}

        <div>{basicIsLoading && 'basicIsLoading'}</div>

        <div>{basicIsFetching && 'basicIsFetching'}</div>

        <div>
          {basicIsFetching && 'basicIsFetching'}
          {basicIsSuccess && 'basicIsSuccess'}
        </div>

        {/* ////////////////////////////////////////////////// */}

        <div>{snapshotIsLoading && 'snapshotIsLoading'}</div>

        <div>{snapshotIsFetching && 'snapshotIsFetching'}</div>

        <div>
          {snapshotIsFetching && 'snapshotIsFetching'}
          {snapshotIsSuccess && 'snapshotIsSuccess'}
        </div>

        {/* ////////////////////////////////////////////////// */}

        <div>{updateLoading && 'updateLoading'}</div>

        <div>{updateSuccess && 'updateSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <button onClick={handleUpdate}>update</button>
      </>
    )
  })

  const ListWrapper = storeWrapper(({ employeeId }) => {
    const {
      isLoading: listIsLoading,
      isSuccess: listIsSuccess,
      isFetching: listIsFetching
    } = usePostEmployeeSearchQueryMock({})

    const [create, { isLoading: createLoading, isSuccess: createSuccess }] = usePostEmployeeCreateMutationMock()

    const [enable, { isLoading: enableLoading, isSuccess: enableSuccess }] = usePutEmployeeEnableMutationMock()

    const [disable, { isLoading: disableLoading, isSuccess: disableSuccess }] = usePutEmployeeDisableMutationMock()

    const [grant, { isLoading: grantLoading, isSuccess: grantSuccess }] = usePostEmployeeGrantAuthMutationMock()

    async function handleCreate() {
      const data = await create(_createData).unwrap()
      console.log(data)
    }

    async function handleEnable() {
      const data = await enable(employeeId).unwrap()
      console.log(data)
    }

    async function handleDisable() {
      const data = await disable(employeeId).unwrap()
      console.log(data)
    }

    async function handleGrant() {
      const data = await grant(_grantData).unwrap()
      console.log(data)
    }

    return (
      <>
        {/* ////////////////////////////////////////////////// */}

        <div>{listIsLoading && 'listIsLoading'}</div>

        <div>{listIsFetching && 'listIsFetching'}</div>

        <div>
          {listIsFetching && 'listIsFetching'}
          {listIsSuccess && 'listIsSuccess'}
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

        <div>{grantLoading && 'grantLoading'}</div>

        <div>{grantSuccess && 'grantSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <button onClick={handleCreate}>create</button>

        <button onClick={handleEnable}>enable</button>

        <button onClick={handleDisable}>disable</button>

        <button onClick={handleGrant}>grant</button>
      </>
    )
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const { getByText: employee } = render(<EmployeeWrapper employeeId={_employeeId} />)
  const { getByText: list } = render(<ListWrapper employeeId={_employeeId} />)

  await waitFor(() => expect(employee('employeeIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(list('listIsLoading')).toBeInTheDocument(), { timeout: 5000 })

  await waitFor(() => expect(employee('employeeIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(list('listIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  let state = store.getState()

  // access tags used for cache management
  let employeeTags = state[apiSlice.reducerPath].provided.EMPLOYEE

  let employees = selectAllEmployees(state)

  let employE = selectEmployeeById(state, _employeeId)

  console.log(employeeTags)
  console.log(employees)
  console.log(employE)

  // let button = list('grant')
  // fireEvent.click(button)

  // await waitFor(() => expect(list('grantLoading')).toBeInTheDocument(), { timeout: 5000 })
  // await waitFor(() => expect(list('grantSuccess')).toBeInTheDocument(), { timeout: 5000 })

  // // await waitFor(() => expect(employee('employeeIsFetching')).toBeInTheDocument(), { timeout: 5000 })

  // await waitFor(() => expect(list('listIsFetching')).toBeInTheDocument(), { timeout: 5000 })

  // // await waitFor(() => expect(employee('employeeIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  // await waitFor(() => expect(list('listIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  // state = store.getState()

  // // access tags used for cache management
  // employeeTags = state[apiSlice.reducerPath].provided.EMPLOYEE

  // employees = selectAllEmployees(state)

  // employE = selectEmployeeById(state, _employeeId)

  // console.log(employeeTags)
  // console.log(employees)
  // console.log(_createData)
}, 10000)
