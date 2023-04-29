import { Provider } from 'react-redux'
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import profile, { selectProfileById } from '../profileSlice'
import { JSDOM } from 'jsdom'
import { useGetProfileInfoQuery } from '../api/profileApiSlice'
import { apiSlice } from '../api/apiSlice'
import document, { selectDocumentById, selectDocumentsByProfileId } from '../documentSlice'
import auth, { setCredentials } from '../authSlice'
import SolApi from '../api/SolApi'
import { delay } from './helper'
import { documentApiSlice } from '../api/documentApiSlice'
import testFile from './testFile'

// import { waitForApiCall } from './helper'

let _profileId
let _document

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    profile,
    document,
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

// beforeAll(async () => {
//   // Set up a fake DOM environment with jsdom
//   const { window } = new JSDOM('<!doctype html><html><body></body></html>')
//   global.window = window
//   global.document = window.document

//   try {
//     // const res = await SolApi.TestAuth() // Call the TestAuth API

//     const authData = {
//       employeeId: 'test',
//       token:
//         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwN2UxMjUwMS1lODI3LTRkYTctYTQyNy0xN2YzYzNmYmExYzciLCJVc2VySWQiOiI2NDQxNGIyMC0xN2EwLTRlNDEtODYwNi05M2U2ZTliN2MwMmIiLCJQaG9uZU51bWJlciI6IjExMTExMTExMjAiLCJOYW1lIjoiTG9uZyAgTHVuYSIsIkVtYWlsIjoibG9uZ0BsdW5hcHBzLmNvIiwiQWxpYXMiOiIxMTExMTExMTIwIiwibmJmIjoxNjgyNjQ2MDUwLCJleHAiOjE2ODI2ODIwNTAsImlhdCI6MTY4MjY0NjA1MH0.IlHOJyEbnWpvV1XmLPBcPnqLV2e_5MBk9Bz91Q9sfTQ',
//       permissions: []
//     }
//     ;(SolApi.token =
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwN2UxMjUwMS1lODI3LTRkYTctYTQyNy0xN2YzYzNmYmExYzciLCJVc2VySWQiOiI2NDQxNGIyMC0xN2EwLTRlNDEtODYwNi05M2U2ZTliN2MwMmIiLCJQaG9uZU51bWJlciI6IjExMTExMTExMjAiLCJOYW1lIjoiTG9uZyAgTHVuYSIsIkVtYWlsIjoibG9uZ0BsdW5hcHBzLmNvIiwiQWxpYXMiOiIxMTExMTExMTIwIiwibmJmIjoxNjgyNjQ2MDUwLCJleHAiOjE2ODI2ODIwNTAsImlhdCI6MTY4MjY0NjA1MH0.IlHOJyEbnWpvV1XmLPBcPnqLV2e_5MBk9Bz91Q9sfTQ'),
//       store.dispatch(setCredentials(authData)) // Dispatch the setCredential action with the token

//     const { data } = await SolApi.TestCreateProfile()
//     _profileId = data
//   } catch (error) {
//     console.error('Error fetching test token:', error[0].data)
//   }
// })

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

    const { data } = await SolApi.TestCreateProfile()
    _profileId = data
  } catch (error) {
    console.error('Error fetching test token:', error[0].data)
  }
})

afterAll(async () => {
  cleanup()

  await SolApi.TestDeleteProfile(_profileId)

  store.dispatch(apiSlice.util.resetApiState())

  delete global.window
  delete global.document
})

describe('DocumentApiSlice', () => {
  test('getDocuments return empty array', async () => {
    const useGetDocumentsQueryMock = jest.spyOn(documentApiSlice, 'useGetDocumentsQuery')
    const Wrapper = storeWrapper(({ profileId }) => {
      const { isLoading, isSuccess } = useGetDocumentsQueryMock(profileId)

      return (
        <>
          {/* Query is currently loading for the first time. No data yet. */}
          {isLoading && 'isLoading'}

          {/* Query has data from a successful load. */}
          {isSuccess && 'isSuccess'}
        </>
      )
    })

    const { getByText } = render(<Wrapper profileId={_profileId} />)
    await waitFor(() => expect(getByText('isLoading')).toBeInTheDocument(), { timeout: 5000 })
    await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument(), { timeout: 5000 })
    const state = store.getState()

    // access tags used for cache management
    const cacheTagIds = Object.keys(state[apiSlice.reducerPath].provided.DOCUMENT)

    // access all profiles in global state
    const profileDocs = selectDocumentsByProfileId(store.getState(), _profileId)
    expect(profileDocs.length).toBe(0)
    expect(cacheTagIds.length).toBe(1)
  }),
    test('getDocuments calls on its own after postUploadDocument', async () => {
      const useGetDocumentsQueryMock = jest.spyOn(documentApiSlice, 'useGetDocumentsQuery')
      const usePostUploadDocumentMutationMock = jest.spyOn(documentApiSlice, 'usePostUploadDocumentMutation')
      const Wrapper = storeWrapper(({ profileId }) => {
        const { isLoading, isSuccess, isFetching } = useGetDocumentsQueryMock(profileId)

        const [trigger, { isSuccess: triggerSuccess, isLoading: triggerLoading }] = usePostUploadDocumentMutationMock()

        async function handleClick() {
          const formData = new FormData()

          // Append the key-value pairs to the FormData object
          formData.append('file', testFile)
          formData.append('title', 'Redux test doc')
          formData.append('description', 'Redux description')
          formData.append('category', 'uploaded')

          const testData = {
            profileId,
            data: formData
          }

          await trigger(testData)
        }

        return (
          <>
            {/* Query is currently loading for the first time. No data yet. */}
            <div>{isLoading && 'isLoading'}</div>

            {/* Query has data from a successful load. */}
            <div>{isSuccess && 'isSuccess'}</div>

            <div>{isFetching && 'isFetching'}</div>

            <div>{triggerSuccess && 'triggerSuccess'}</div>

            <div>{triggerLoading && 'triggerLoading'}</div>

            <button onClick={handleClick}>upload</button>
          </>
        )
      })

      const { getByText } = render(<Wrapper profileId={_profileId} />)

      // isSuccess should be true since getDocuments has already been called for this profileId
      expect(getByText('isSuccess')).toBeInTheDocument()

      // fire button
      const button = getByText('upload')
      fireEvent.click(button)
      await waitFor(() => expect(getByText('triggerLoading')).toBeInTheDocument(), { timeout: 300 })
      await waitFor(() => expect(getByText('triggerSuccess')).toBeInTheDocument(), { timeout: 300 })
      await waitFor(() => expect(getByText('isFetching')).toBeInTheDocument(), { timeout: 300 })
      await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument(), { timeout: 300 })

      await act(async () => {
        await delay(300, () => true)
      })

      const state = store.getState()

      // access all profiles in global state
      const profileDocs = selectDocumentsByProfileId(state, _profileId)
      expect(profileDocs.length).toBe(1)
      _document = profileDocs[0]
    }),
    test('getPreview calls API ', async () => {
      const useGetDocumentPreviewQueryMock = jest.spyOn(documentApiSlice, 'useGetDocumentPreviewQuery')

      let componentData
      const Wrapper = storeWrapper(({ documentId }) => {
        const { data, isLoading, isSuccess, isFetching } = useGetDocumentPreviewQueryMock(documentId)

        componentData = data

        return (
          <>
            {/* Query is currently loading for the first time. No data yet. */}
            <div>{isLoading && 'isLoading'}</div>

            {/* Query has data from a successful load. */}
            <div>{isSuccess && 'isSuccess'}</div>

            <div>{isFetching && 'isFetching'}</div>
          </>
        )
      })

      const { getByText, unmount } = render(<Wrapper documentId={_document.documentId} />)

      await waitFor(() => expect(getByText('isLoading')).toBeInTheDocument(), { timeout: 300 })
      await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument(), { timeout: 300 })

      await act(async () => {
        await delay(300, () => true)
      })
      const state = store.getState()

      // access all profiles in global state
      const profileDoc = selectDocumentById(state, _document.documentId)
      expect(componentData.documentId).toBe(profileDoc.documentId)
      expect(componentData.fileExtension).toBe(profileDoc.fileExtension)
      expect(componentData.title).toBe(profileDoc.title)

      unmount(<Wrapper documentId={_document.documentId} />)
      render(<Wrapper documentId={_document.documentId} />)

      expect(getByText('isSuccess')).toBeInTheDocument()
    }),
    test('generateDocument calls API', async () => {
      const usePostGenerateDocumentMutationMock = jest.spyOn(documentApiSlice, 'usePostGenerateDocumentMutation')
      const useGetDocumentsQueryMock = jest.spyOn(documentApiSlice, 'useGetDocumentsQuery')
      const Wrapper = storeWrapper(({ profileId }) => {
        const [trigger, { isSuccess: triggerSuccess, isLoading: triggerLoading }] =
          usePostGenerateDocumentMutationMock()
        const { isLoading, isSuccess, isFetching } = useGetDocumentsQueryMock(profileId)
        useGetProfileInfoQuery(profileId)

        async function handleClick() {
          const testData = {
            profileId,
            templateId: '1a226365-28d5-4a4c-acf8-419faf1bbb8c',
            title: 'Client agreement'
          }

          _document = await trigger(testData)
        }

        return (
          <>
            {/* Query is currently loading for the first time. No data yet. */}
            <div>{isLoading && 'isLoading'}</div>

            {/* Query has data from a successful load. */}
            <div>{isSuccess && 'isSuccess'}</div>

            <div>{isFetching && 'isFetching'}</div>

            <div>{triggerSuccess && 'triggerSuccess'}</div>

            <div>{triggerLoading && 'triggerLoading'}</div>

            <button onClick={handleClick}>upload</button>
          </>
        )
      })

      const { getByText } = render(<Wrapper profileId={_profileId} />)

      // isSuccess should be true since getDocuments has already been called for this profileId
      expect(getByText('isSuccess')).toBeInTheDocument()

      // fire button
      const button = getByText('upload')
      fireEvent.click(button)
      await waitFor(() => expect(getByText('triggerLoading')).toBeInTheDocument(), { timeout: 2000 })
      await waitFor(() => expect(getByText('triggerSuccess')).toBeInTheDocument(), { timeout: 2000 })
      await waitFor(() => expect(getByText('isFetching')).toBeInTheDocument(), { timeout: 2000 })
      await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument(), { timeout: 2000 })

      await act(async () => {
        await delay(300, () => true)
      })
      const state = store.getState()

      // access all profiles in global state
      const profileDocs = selectDocumentsByProfileId(state, _profileId)
      expect(profileDocs.length).toBe(2)
    })

  // test('esign document doc', async () => {
  //   const usePostEsignDocumentMutationMock = jest.spyOn(documentApiSlice, 'usePostEsignDocumentMutation')
  //   const useGetDocumentsQueryMock = jest.spyOn(documentApiSlice, 'useGetDocumentsQuery')

  //   const currProfile = selectProfileById(store.getState(), _profileId)
  //   const contactEmail = currProfile.profileContacts.filter(contact => contact.contactType == 1)
  //   const contactPhone = currProfile.profileContacts.filter(contact => contact.contactType == 0)
  //   let componentData
  //   const Wrapper = storeWrapper(({ profileId }) => {
  //     const [trigger, { isSuccess: triggerSuccess, isLoading: triggerLoading }] = usePostEsignDocumentMutationMock()
  //     const { isLoading, isSuccess, isFetching } = useGetDocumentsQueryMock(profileId)

  //     async function handleClick() {
  //       const testData = {
  //         profileId,
  //         TargetPhoneNumber: contactPhone[0].value,
  //         TargetEmail: contactEmail[0].value,
  //         sendingMethod: 0,
  //         DocumentId: _document.data
  //       }

  //       const data = await trigger(testData)
  //       componentData = data
  //     }

  //     return (
  //       <>
  //         {/* Query is currently loading for the first time. No data yet. */}
  //         <div>{isLoading && 'isLoading'}</div>

  //         {/* Query has data from a successful load. */}
  //         <div>{isSuccess && 'isSuccess'}</div>

  //         <div>{isFetching && 'isFetching'}</div>

  //         <div>{triggerSuccess && 'triggerSuccess'}</div>

  //         <div>{triggerLoading && 'triggerLoading'}</div>

  //         <button onClick={handleClick}>esign</button>
  //       </>
  //     )
  //   })

  //   const { getByText } = render(<Wrapper profileId={_profileId} />)

  //   // isSuccess should be true since getDocuments has already been called for this profileId
  //   expect(getByText('isSuccess')).toBeInTheDocument()

  //   // fire button
  //   const button = getByText('esign')
  //   fireEvent.click(button)
  //   await waitFor(() => expect(getByText('triggerLoading')).toBeInTheDocument(), { timeout: 2000 })
  //   await waitFor(() => expect(getByText('triggerSuccess')).toBeInTheDocument(), { timeout: 2000 })
  //   await waitFor(() => expect(getByText('isFetching')).toBeInTheDocument(), { timeout: 2000 })
  //   await waitFor(() => expect(getByText('isSuccess')).toBeInTheDocument(), { timeout: 2000 })

  //   await act(async () => {
  //     await delay(300, () => true)
  //   })

  //   const state = store.getState()

  //   // access all profiles in global state
  //   const profileDocs = selectDocumentsByProfileId(state, _profileId)
  //   expect(profileDocs.length).toBe(2)
  // })
})

/*

    need to finish
    - all liability
    - esign

*/
