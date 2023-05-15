// import { Provider } from 'react-redux'

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
// import { configureStore } from '@reduxjs/toolkit'

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { JSDOM } from 'jsdom'
// import { apiSlice } from '../api/apiSlice'
// import auth, { setCredentials } from '../authSlice'
// import group, { selectAllGroups, selectGroupById } from '../groupSlice'
// import { groupApiSlice } from '../api/groupApiSlice'
// import SolApi from '../api/SolApi'

// // import { waitForApiCall } from './helper'

// const store = configureStore({
//   reducer: {
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     group,
//     auth
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

// test('group', async () => {
//   let _groupId = 'd05cc1bb-fdcd-4e27-b595-8e85ac3b5286'

//   const _createData = {
//     name: 'redux group',
//     description: 'testing redux groups'
//   }

//   const _updateData = {
//     groupId: _groupId,
//     name: 'UPDATED redux group',
//     description: ' UPDATED testing redux groups',
//     employeeIds: [
//       '265f432e-9368-44fe-8233-4f6696ef1b33',
//       'b7918566-9a08-4650-baaf-6c2b06c7de78',
//       'f416e0fb-b53d-43a3-954c-6c3b85b7b5e2',
//       '8de28b3d-f932-4901-a794-accfb4240e6a',
//       'f5ded69d-670d-49c3-8d68-c7109828929e'
//     ]
//   }

//   const useGetGroupQueryMock = jest.spyOn(groupApiSlice, 'useGetGroupQuery')
//   const useGetGroupsQueryMock = jest.spyOn(groupApiSlice, 'useGetGroupsQuery')
//   const usePostGroupCreateMutationMock = jest.spyOn(groupApiSlice, 'usePostGroupCreateMutation')
//   const usePutGroupUpdateMutationMock = jest.spyOn(groupApiSlice, 'usePutGroupUpdateMutation')
//   const useDeleteGroupMutationMock = jest.spyOn(groupApiSlice, 'useDeleteGroupMutation')

//   const GroupWrapper = storeWrapper(({ groupId }) => {
//     const {
//       isLoading: groupIsLoading,
//       isSuccess: groupIsSuccess,
//       isFetching: groupIsFetching
//     } = useGetGroupQueryMock(groupId)

//     const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] = usePutGroupUpdateMutationMock()

//     async function handleUpdate() {
//       const data = await update(_updateData).unwrap()
//       console.log(data)
//     }

//     return (
//       <>
//         {/* ////////////////////////////////////////////////// */}

//         <div>{groupIsLoading && 'groupIsLoading'}</div>

//         <div>{groupIsFetching && 'groupIsFetching'}</div>

//         <div>
//           {groupIsFetching && 'groupIsFetching'}
//           {groupIsSuccess && 'groupIsSuccess'}
//         </div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{updateLoading && 'updateLoading'}</div>

//         <div>{updateSuccess && 'updateSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <button onClick={handleUpdate}>update</button>
//       </>
//     )
//   })

//   const ListWrapper = storeWrapper(({ groupId }) => {
//     const { isLoading: listIsLoading, isSuccess: listIsSuccess, isFetching: listIsFetching } = useGetGroupsQueryMock()

//     const [create, { isLoading: createLoading, isSuccess: createSuccess }] = usePostGroupCreateMutationMock()

//     const [disable, { isLoading: disableLoading, isSuccess: disableSuccess }] = useDeleteGroupMutationMock()

//     async function handleCreate() {
//       const data = await create(_createData).unwrap()
//       console.log(data)
//     }

//     async function handleDisable() {
//       const data = await disable(groupId).unwrap()
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
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars

//   // const { getByText: group } = render(<GroupWrapper groupId={_groupId} />)
//   const { getByText: list } = render(<ListWrapper groupId={_groupId} />)

//   // await waitFor(() => expect(group('groupIsLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(list('listIsLoading')).toBeInTheDocument(), { timeout: 5000 })

//   // await waitFor(() => expect(group('groupIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(list('listIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   let state = store.getState()

//   // access tags used for cache management
//   let groupTags = state[apiSlice.reducerPath].provided.GROUP

//   let groups = selectAllGroups(state)
//   let grp = selectGroupById(state, _groupId)

//   console.log(groupTags)
//   console.log(groups, groups.length)
//   console.log(grp)

//   let button = list('disable')
//   fireEvent.click(button)

//   await waitFor(() => expect(list('disableLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(list('disableSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   // await waitFor(() => expect(group('groupIsFetching')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(list('listIsFetching')).toBeInTheDocument(), { timeout: 5000 })

//   // await waitFor(() => expect(group('groupIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(list('listIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   state = store.getState()

//   // access tags used for cache management
//   groupTags = state[apiSlice.reducerPath].provided.GROUP

//   groups = selectAllGroups(state)
//   grp = selectGroupById(state, _groupId)

//   console.log(groupTags)
//   console.log(groups, groups.length)
//   console.log(grp)
// }, 10000)
