// import { Provider } from 'react-redux'
// import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
// import { configureStore } from '@reduxjs/toolkit'
// import { JSDOM } from 'jsdom'
// import { apiSlice } from '../api/apiSlice'
// import auth, { setCredentials } from '../authSlice'
// import email, { selectEmailByProfileId } from '../emailSlice'
// import SolApi from '../api/SolApi'
// import { emailApiSlice } from '../api/emailApiSlice'

// const store = configureStore({
//   reducer: {
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     email,
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
//     console.error('Error fetching test token:', error[0].data)
//   }
// })

// afterAll(async () => {
//   cleanup()
//   store.dispatch(apiSlice.util.resetApiState())

//   delete global.window
//   delete global.document
// })

// test('profile creditCard api', async () => {
//   let _profileId = '3445625693'
//   let _liabilityId = 'ced82747-c2f8-4909-816f-7e9d3abd51ae'
//   let _emailId = 'fccdc22a-d0cb-4cba-83a4-6fb37d092288'

//   const _createProfileData = {
//     profileId: _profileId,
//     subject: 'test redux email',
//     body: 'SENDING A REDUX EMAIL OUT',
//     sentFrom: 'sami@prime-logix.co',
//     sentTo: 'srashed001@gmail.com'
//   }

//   const _createLiabilityData = {
//     profileId: _profileId,
//     liabilityId: _liabilityId,
//     subject: 'test redux liability email',
//     body: 'SENDING liability email',
//     sentFrom: 'sami@prime-logix.co',
//     sentTo: 'srashed001@gmail.com'
//   }

//   const _profileLiabilityQuery = {
//     profileId: _profileId,
//     liabilityId: _liabilityId
//   }

//   const useGetEmailQueryMock = jest.spyOn(emailApiSlice, 'useGetEmailQuery')
//   const useGetProfileEmailsQueryMock = jest.spyOn(emailApiSlice, 'useGetProfileEmailsQuery')
//   const useGetProfileLiabilityEmailsQueryMock = jest.spyOn(emailApiSlice, 'useGetProfileLiabilityEmailsQuery')
//   const usePostProfileEmailMutationMock = jest.spyOn(emailApiSlice, 'usePostProfileEmailMutation')
//   const usePostProfileLiabilityEmailMutationMock = jest.spyOn(emailApiSlice, 'usePostProfileLiabilityEmailMutation')

//   const EmailWrapper = storeWrapper(({ emailId }) => {
//     const {
//       isLoading: emailIsLoading,
//       isSuccess: emailIsSuccess,
//       isFetching: emailIsFetching
//     } = useGetEmailQueryMock(emailId)

//     return (
//       <>
//         {/* ////////////////////////////////////////////////// */}

//         <div>{emailIsLoading && 'emailIsLoading'}</div>

//         <div>{emailIsFetching && 'emailIsFetching'}</div>

//         <div>
//           {emailIsFetching && 'emailIsFetching'}
//           {emailIsSuccess && 'emailIsSuccess'}
//         </div>

//         {/* ////////////////////////////////////////////////// */}
//       </>
//     )
//   })

//   const LiabilityWrapper = storeWrapper(() => {
//     const {
//       isLoading: liabilityIsLoading,
//       isLoading: liabilityIsError,
//       isSuccess: liabilityIsSuccess,
//       isFetching: liabilityIsFetching
//     } = useGetProfileLiabilityEmailsQueryMock(_profileLiabilityQuery)

//     const [sendLiability, { isLoading: sendLiabilityLoading, isSuccess: sendLiabilitySuccess }] =
//       usePostProfileLiabilityEmailMutationMock()

//     async function handleSendLiability() {
//       const data = await sendLiability(_createLiabilityData)
//       console.log(data)
//     }

//     console.log(liabilityIsError)

//     return (
//       <>
//         {/* ////////////////////////////////////////////////// */}

//         <div>{liabilityIsLoading && 'liabilityIsLoading'}</div>

//         <div>{liabilityIsFetching && 'liabilityIsFetching'}</div>

//         <div>
//           {liabilityIsFetching && 'liabilityIsFetching'}
//           {liabilityIsSuccess && 'liabilityIsSuccess'}
//         </div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{sendLiabilityLoading && 'sendLiabilityLoading'}</div>

//         <div>{sendLiabilitySuccess && 'sendLiabilitySuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <button onClick={handleSendLiability}>sendLiability</button>
//       </>
//     )
//   })

//   const ProfileWrapper = storeWrapper(({ profileId }) => {
//     const {
//       isLoading: profileIsLoading,
//       isSuccess: profileIsSuccess,
//       isFetching: profileIsFetching
//     } = useGetProfileEmailsQueryMock(profileId)

//     const [sendProfile, { isLoading: sendProfileLoading, isSuccess: sendProfileSuccess }] =
//       usePostProfileEmailMutationMock()

//     async function handleSendProfile() {
//       const data = await sendProfile(_createProfileData)
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

//         <div>{sendProfileLoading && 'sendProfileLoading'}</div>

//         <div>{sendProfileSuccess && 'sendProfileSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <button onClick={handleSendProfile}>sendProfile</button>
//       </>
//     )
//   })
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars

//   // const { getByText: liability } = render(<LiabilityWrapper />)
//   const { getByText: profile } = render(<ProfileWrapper profileId={_profileId} />)
//   const { getByText: email } = render(<EmailWrapper emailId={_emailId} />)

//   // await waitFor(() => expect(liability('liabilityIsLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(profile('profileIsLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(email('emailIsLoading')).toBeInTheDocument(), { timeout: 5000 })

//   // await waitFor(() => expect(liability('liabilityIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(profile('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(email('emailIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   let state = store.getState()

//   // access tags used for cache management
//   let emailTags = state[apiSlice.reducerPath].provided.EMAIL

//   let profileEmails = selectEmailByProfileId(state, _profileId)

//   console.log(emailTags)
//   console.log(profileEmails, profileEmails.length)

//   // let button = profile('disable')
//   // fireEvent.click(button)

//   // await waitFor(() => expect(profile('disableLoading')).toBeInTheDocument(), { timeout: 5000 })
//   // await waitFor(() => expect(profile('disableSuccess')).toBeInTheDocument(), { timeout: 5000 })
//   // await waitFor(() => expect(profile('profileIsFetching')).toBeInTheDocument(), { timeout: 5000 })
//   // await waitFor(() => expect(profile('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   // state = store.getState()

//   // creditCardTags = state[apiSlice.reducerPath].provided.CREDITCARD

//   // ccs = selectCreditCardsByProfileId(state, _profileId)

//   // console.log(creditCardTags)
//   // console.log(ccs)
// }, 10000)
