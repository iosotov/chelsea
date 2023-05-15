// import { Provider } from 'react-redux'

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
// import { configureStore } from '@reduxjs/toolkit'

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { JSDOM } from 'jsdom'
// import { apiSlice } from '../api/apiSlice'
// import auth, { setCredentials } from '../authSlice'
// import role, { selectAllRoles, selectRoleById } from '../roleSlice'
// import SolApi from '../api/SolApi'
// import { roleApiSlice } from '../api/roleApiSlice'

// // import { waitForApiCall } from './helper'

// const store = configureStore({
//   reducer: {
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     auth,
//     role
//   },
//   middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
// })

// const storeWrapper = Component => {
//   return props => (
//     <Provider store={store}>
//       <Component {...props} />
//     </Provider>
//   )
// }

// beforeAll(async () => {
//   // Set up a fake DOM environment with jsdom
//   const { window } = new JSDOM('<!doctype html><html><body></body></html>')
//   global.window = window
//   global.document = window.document

//   try {
//     const res = await SolApi.TestAuth() // Call the TestAuth API

//     const authData = {
//       employeeId: 'test',
//       token: res.data.token,
//       permissions: []
//     }
//     SolApi.token = res.data.token
//     store.dispatch(setCredentials(authData)) // Dispatch the setCredential action with the token
//   } catch (error) {
//     console.error('Error fetching test token:', error)
//   }
// })

// afterAll(async () => {
//   cleanup()
//   store.dispatch(apiSlice.util.resetApiState())

//   delete global.window
//   delete global.document
// })

// test('role', async () => {
//   let _roleId = '021f9917-b3ac-4cc1-909b-18e8e40cc0cc'

//   const _createData = {
//     name: 'redux role',
//     description: 'testing redux roles'
//   }

//   const _updateData = {
//     roleId: _roleId,
//     name: 'UPDATED redux role',
//     description: 'UPDATED testing redux roles'
//   }

//   const _permData = {
//     roleId: _roleId,
//     permissions: [
//       '51cebf46-5a27-47ff-a6ff-0051b4a70d5d',
//       '30d2c94f-2799-423d-afb3-12c2e5e4e326'

//       // '0027b451-aa72-4e90-9f46-18c6a98a8a81'
//     ]
//   }

//   const useGetRoleQuery = jest.spyOn(roleApiSlice, 'useGetRoleQuery')
//   const useGetRolesQuery = jest.spyOn(roleApiSlice, 'useGetRolesQuery')
//   const usePutRoleUpdateMutation = jest.spyOn(roleApiSlice, 'usePutRoleUpdateMutation')
//   const usePostRoleCreateMutation = jest.spyOn(roleApiSlice, 'usePostRoleCreateMutation')
//   const usePostRoleSearchQuery = jest.spyOn(roleApiSlice, 'usePostRoleSearchQuery')
//   const useDeleteRoleMutation = jest.spyOn(roleApiSlice, 'useDeleteRoleMutation')
//   const usePostRoleAssignPermissionsMutation = jest.spyOn(roleApiSlice, 'usePostRoleAssignPermissionsMutation')

//   const RoleWrapper = storeWrapper(({ roleId }) => {
//     const { isLoading: roleIsLoading, isSuccess: roleIsSuccess, isFetching: roleIsFetching } = useGetRoleQuery(roleId)

//     const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] = usePutRoleUpdateMutation()

//     const [assign, { isLoading: assignLoading, isSuccess: assignSuccess }] = usePostRoleAssignPermissionsMutation()

//     async function handleUpdate() {
//       const data = await update(_updateData).unwrap()
//       console.log(data)
//     }

//     async function handleAssign() {
//       const data = await assign(_permData).unwrap()
//       console.log(data)
//     }

//     return (
//       <>
//         {/* ////////////////////////////////////////////////// */}

//         <div>{roleIsLoading && 'roleIsLoading'}</div>

//         <div>{roleIsFetching && 'roleIsFetching'}</div>

//         <div>
//           {roleIsFetching && 'roleIsFetching'}
//           {roleIsSuccess && 'roleIsSuccess'}
//         </div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{updateLoading && 'updateLoading'}</div>

//         <div>{updateSuccess && 'updateSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{assignLoading && 'assignLoading'}</div>

//         <div>{assignSuccess && 'assignSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <button onClick={handleUpdate}>update</button>

//         <button onClick={handleAssign}>assign</button>
//       </>
//     )
//   })

//   const ListWrapper = storeWrapper(({ roleId }) => {
//     const { isLoading: listIsLoading, isSuccess: listIsSuccess, isFetching: listIsFetching } = useGetRolesQuery()

//     const [create, { isLoading: createLoading, isSuccess: createSuccess }] = usePostRoleCreateMutation()

//     const [disable, { isLoading: disableLoading, isSuccess: disableSuccess }] = useDeleteRoleMutation()

//     async function handleCreate() {
//       const data = await create(_createData).unwrap()
//       console.log(data)
//     }

//     async function handleDisable() {
//       const data = await disable(roleId).unwrap()
//       console.log(data)
//     }

//     return (
//       <>
//         {/* ////////////////////////////////////////////////// */}

//         <div>{listIsLoading && 'listIsLoading'}</div>

//         <div>{listIsFetching && 'listIsFetching'}</div>

//         <div>
//           {listIsFetching && 'listIsFetching'}
//           {listIsSuccess && 'listIsSuccess'}
//         </div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{createLoading && 'createLoading'}</div>

//         <div>{createSuccess && 'createSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{disableLoading && 'disableLoading'}</div>

//         <div>{disableSuccess && 'disableSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <button onClick={handleCreate}>create</button>

//         <button onClick={handleDisable}>disable</button>
//       </>
//     )
//   })

//   const SearchWrapper = storeWrapper(() => {
//     const {
//       isLoading: searchIsLoading,
//       isSuccess: searchIsSuccess,
//       isFetching: searchIsFetching
//     } = usePostRoleSearchQuery({})

//     return (
//       <>
//         {/* ////////////////////////////////////////////////// */}

//         <div>{searchIsLoading && 'searchIsLoading'}</div>

//         <div>{searchIsFetching && 'searchIsFetching'}</div>

//         <div>
//           {searchIsFetching && 'searchIsFetching'}
//           {searchIsSuccess && 'searchIsSuccess'}
//         </div>
//       </>
//     )
//   })
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars

//   // const { getByText: role } = render(<RoleWrapper roleId={_roleId} />)
//   const { getByText: search } = render(<SearchWrapper />)
//   const { getByText: list } = render(<ListWrapper roleId={_roleId} />)

//   // await waitFor(() => expect(role('roleIsLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(list('listIsLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(search('searchIsLoading')).toBeInTheDocument(), { timeout: 5000 })

//   // await waitFor(() => expect(role('roleIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(list('listIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   // await waitFor(() => expect(role('searchIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   let state = store.getState()

//   // access tags used for cache management
//   let roleTags = state[apiSlice.reducerPath].provided.ROLE

//   let roles = selectAllRoles(state)
//   let rl = selectRoleById(state, _roleId)

//   console.log(roleTags)
//   console.log(roles, roles.length)
//   console.log(rl)

//   let button = list('disable')
//   fireEvent.click(button)

//   await waitFor(() => expect(list('disableLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(list('disableSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   // await waitFor(() => expect(role('roleIsFetching')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(list('listIsFetching')).toBeInTheDocument(), { timeout: 5000 })

//   // await waitFor(() => expect(role('roleIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(list('listIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   // await waitFor(() => expect(list('searchIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   state = store.getState()

//   // access tags used for cache management
//   roleTags = state[apiSlice.reducerPath].provided.ROLE

//   roles = selectAllRoles(state)
//   rl = selectRoleById(state, _roleId)

//   console.log(roleTags)
//   console.log(roles, roles.length)
//   console.log(rl)
// }, 10000)
