// import { Provider } from 'react-redux'
// import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
// import { configureStore } from '@reduxjs/toolkit'
// import { JSDOM } from 'jsdom'
// import { apiSlice } from '../api/apiSlice'
// import note, { selectNotesByProfileId } from '../noteSlice'
// import auth, { setCredentials } from '../authSlice'
// import SolApi from '../api/SolApi'
// import { noteApiSlice } from '../api/noteApiSlice'
// import { rtkQueryErrorLogger } from '../store'

// const store = configureStore({
//   reducer: {
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     note,
//     auth
//   },
//   middleware: getDefaultMiddleware => getDefaultMiddleware().concat([apiSlice.middleware, rtkQueryErrorLogger])
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
//     console.error('Error fetching test token:', error[0].data)
//   }
// })

// afterAll(async () => {
//   cleanup()
//   store.dispatch(apiSlice.util.resetApiState())

//   delete global.window
//   delete global.document
// })

// test('notes api', async () => {
//   let _profileId = '4276995478'
//   let _noteId = 'abb7e6e5-f7a6-4f17-9310-4b42e1fcb8c5'

//   const _createData = {
//     profileId: _profileId,
//     content: 'Test redux data',
//     type: 1
//   }

//   const _updateData = {
//     profileId: _profileId,
//     noteId: _noteId,
//     content: 'Test redux update'
//   }

//   const useGetNoteQueryMock = jest.spyOn(noteApiSlice, 'useGetNoteQuery')
//   const useGetProfileNotesQueryMock = jest.spyOn(noteApiSlice, 'useGetProfileNotesQuery')
//   const usePostNoteCreateMutationMock = jest.spyOn(noteApiSlice, 'usePostNoteCreateMutation')
//   const usePutNoteUpdateMutationMock = jest.spyOn(noteApiSlice, 'usePutNoteUpdateMutation')
//   const useDeleteNoteMutationMock = jest.spyOn(noteApiSlice, 'useDeleteNoteMutation')

//   const NoteWrapper = storeWrapper(({ noteId }) => {
//     const {
//       isLoading: noteIsLoading,
//       isSuccess: noteIsSuccess,
//       isFetching: noteIsFetching,
//       isError: noteIsError,
//       error: noteError
//     } = useGetNoteQueryMock(noteId)

//     const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] = usePutNoteUpdateMutationMock()

//     async function handleUpdate() {
//       const data = await update(_updateData)
//       console.log(data)
//     }

//     console.log(noteError)

//     return (
//       <>
//         {/* ////////////////////////////////////////////////// */}

//         <div>{noteIsLoading && 'noteIsLoading'}</div>

//         <div>{noteIsFetching && 'noteIsFetching'}</div>

//         <div>{noteIsError && 'noteIsError'}</div>

//         <div>
//           {noteIsFetching && 'noteIsFetching'}
//           {noteIsSuccess && 'noteIsSuccess'}
//         </div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{updateLoading && 'updateLoading'}</div>

//         <div>{updateSuccess && 'updateSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <button onClick={handleUpdate}>update</button>
//       </>
//     )
//   })
//   const ProfileWrapper = storeWrapper(({ profileId }) => {
//     const {
//       isLoading: profileIsLoading,
//       isSuccess: profileIsSuccess,
//       isFetching: profileIsFetching
//     } = useGetProfileNotesQueryMock(profileId)

//     const [create, { isLoading: createLoading, isSuccess: createSuccess }] = usePostNoteCreateMutationMock()
//     const [disable, { isLoading: disableLoading, isSuccess: disableSuccess }] = useDeleteNoteMutationMock()

//     async function handleCreate() {
//       const data = await create(_createData)
//       console.log(data)
//     }

//     async function handleDelete() {
//       const data = await disable(_noteId)
//       console.log(data)
//     }

//     return (
//       <>
//         {/* ////////////////////////////////////////////////// */}

//         <div>{profileIsLoading && 'profileIsLoading'}</div>

//         <div>{profileIsFetching && 'profileIsFetching'}</div>

//         <div>
//           {profileIsFetching && 'profileIsFetching'}
//           {profileIsSuccess && 'profileIsSuccess'}
//         </div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{createLoading && 'createLoading'}</div>

//         <div>{createSuccess && 'createSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{disableLoading && 'disableLoading'}</div>

//         <div>{disableSuccess && 'disableSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <button onClick={handleCreate}>create</button>

//         <button onClick={handleDelete}>disable</button>
//       </>
//     )
//   })
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars

//   const { getByText: note } = render(<NoteWrapper noteId={_noteId} />)
//   const { getByText: profile } = render(<ProfileWrapper profileId={_profileId} />)

//   await waitFor(() => expect(note('noteIsLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(profile('profileIsLoading')).toBeInTheDocument(), { timeout: 5000 })

//   await waitFor(() => expect(note('noteIsError')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(profile('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   let state = store.getState()

//   // access tags used for cache management
//   let noteTags = state[apiSlice.reducerPath].provided.NOTE

//   let profileNotes = selectNotesByProfileId(state, _profileId)

//   console.log(noteTags)
//   console.log(profileNotes, profileNotes.length)

//   // let button = profile('disable')
//   // fireEvent.click(button)

//   // await waitFor(() => expect(profile('disableLoading')).toBeInTheDocument(), { timeout: 5000 })
//   // await waitFor(() => expect(profile('disableSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   // // await waitFor(() => expect(note('noteIsFetching')).toBeInTheDocument(), { timeout: 5000 })
//   // await waitFor(() => expect(profile('profileIsFetching')).toBeInTheDocument(), { timeout: 5000 })

//   // // await waitFor(() => expect(note('noteIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
//   // await waitFor(() => expect(profile('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   // state = store.getState()

//   // // access tags used for cache management
//   // noteTags = state[apiSlice.reducerPath].provided.NOTE

//   // profileNotes = selectNotesByProfileId(state, _profileId)

//   // console.log(noteTags)
//   // console.log(profileNotes, profileNotes.length)
// }, 10000)
