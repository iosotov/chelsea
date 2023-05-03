import { Provider } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { act, cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import profile, { selectProfileById } from '../profileSlice'
import { JSDOM } from 'jsdom'
import { apiSlice } from '../api/apiSlice'
import auth, { setCredentials } from '../authSlice'
import enrollment from '../enrollmentSlice'
import payment from '../paymentSlice'

import SolApi from '../api/SolApi'
import { enrollmentApiSlice } from '../api/enrollmentApiSlice'
import { selectPaymentByProfileId } from '../paymentSlice'
import { selectEnrollmentByProfileId } from '../enrollmentSlice'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { delay } from './helper'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { profileApiSlice } from '../api/profileApiSlice'

// import { waitForApiCall } from './helper'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    enrollment,
    payment,
    auth,
    profile
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

let _profileId = '1326323286'

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

test('enrollment api', async () => {
  const _createTestData = {
    paymentMethod: 0,
    basePlan: 'settingservice_paymentprocessor_nacha',
    serviceFeeType: 1,
    enrollmentFee: 0.5,
    programLength: 15,
    firstPaymentDate: '2022-03-01',
    recurringPaymentDate: '2022-08-03',
    gateway: 'settingservice_paymentprocessor_nacha',
    initialFeeAmount: 0,
    additionalFees: [
      {
        feeName: 'maintenance',
        feeType: 0,
        amount: 10.75,
        feeStart: 2,
        FeeEnd: 5
      },
      {
        feeName: 'service fee',
        feeType: 1,
        amount: 0.02,
        feeStart: 4,
        FeeEnd: 6
      }
    ]
  }

  const _updateEnrollmentData = {
    profileId: _profileId,
    paymentMethod: 0,
    basePlan: 'settingservice_paymentprocessor_nacha',
    serviceFeeType: 1,
    enrollmentFee: 0.5,
    programLength: 10,
    firstPaymentDate: '2023-02-06',
    recurringPaymentDate: '2023-03-01',
    gateway: 'settingservice_paymentprocessor_nacha',
    initialFeeAmount: 0,
    additionalFees: [
      {
        feeName: 'maintenance',
        feeType: 0,
        amount: 10.75,
        feeStart: 2,
        FeeEnd: 2
      },
      {
        feeName: 'service fee',
        feeType: 1,
        amount: 0.02,
        feeStart: 1,
        FeeEnd: 2
      }
    ]
  }

  const useGetEnrollmentPreviewMutationMock = jest.spyOn(enrollmentApiSlice, 'useGetEnrollmentPreviewMutation')
  const useGetEnrollmentQueryMock = jest.spyOn(enrollmentApiSlice, 'useGetEnrollmentQuery')
  const useGetProfilePaymentsQueryMock = jest.spyOn(enrollmentApiSlice, 'useGetProfilePaymentsQuery')
  const usePostCreateEnrollmentMutationMock = jest.spyOn(enrollmentApiSlice, 'usePostCreateEnrollmentMutation')
  const usePutUpdateEnrollmentMutationMock = jest.spyOn(enrollmentApiSlice, 'usePutUpdateEnrollmentMutation')
  const usePutUpdatePaymentMutationMock = jest.spyOn(enrollmentApiSlice, 'usePutUpdatePaymentMutation')

  let componentData
  const Wrapper = storeWrapper(({ profileId }) => {
    console.log(profileId)

    const {
      isLoading: enrollmentIsLoading,
      isFetching: enrollmentIsFetching,
      isSuccess: enrollmentIsSuccess
    } = useGetEnrollmentQueryMock(profileId)
    const {
      isLoading: paymentsIsLoading,
      isFetching: paymentsIsFetching,
      isSuccess: paymentsIsSuccess
    } = useGetProfilePaymentsQueryMock(profileId)

    const [updateEnrollment, { isLoading: updateEnrollmentLoading, isSuccess: updateEnrollmentSuccess }] =
      usePutUpdateEnrollmentMutationMock()
    const [updatePayment, { isLoading: updatePaymentLoading, isSuccess: updatePaymentSuccess }] =
      usePutUpdatePaymentMutationMock()
    const [createEnrollment, { isLoading: createEnrollmentLoading, isSuccess: createEnrollmentSuccess }] =
      usePostCreateEnrollmentMutationMock()
    const [preview, { isLoading: previewEnrollmentLoading, isSuccess: previewEnrollmentSuccess }] =
      useGetEnrollmentPreviewMutationMock()

    async function handleUpdateEnrollment() {
      const data = await updateEnrollment(_updateEnrollmentData).unwrap()
      console.log(data)
    }

    async function handleUpdatePayment() {
      const { data } = await updatePayment().unwrap()
      console.log(data)
    }

    async function handleCreateEnrollment() {
      const { data } = await createEnrollment(_createTestData).unwrap()
      console.log(data)
    }

    async function handlePreviewEnrollment() {
      const newData = { ..._createTestData, profileId }
      componentData = await preview(newData).unwrap()
      console.log(componentData)
    }

    return (
      <>
        {/* ////////////////////////////////////////////////// */}
        <div>{enrollmentIsLoading && 'enrollmentIsLoading'}</div>

        <div>{enrollmentIsFetching && 'enrollmentIsFetching'}</div>

        <div>
          {enrollmentIsFetching && 'enrollmentIsFetching'}
          {enrollmentIsSuccess && 'enrollmentIsSuccess'}
        </div>

        {/* ////////////////////////////////////////////////// */}
        <div>{paymentsIsLoading && 'paymentsIsLoading'}</div>

        <div>{paymentsIsFetching && 'paymentsIsFetching'}</div>

        <div>
          {paymentsIsFetching && 'paymentsIsFetching'}
          {paymentsIsSuccess && 'paymentsIsSuccess'}
        </div>

        {/* ////////////////////////////////////////////////// */}

        <div>{updateEnrollmentLoading && 'updateEnrollmentLoading'}</div>

        <div>{updateEnrollmentSuccess && 'updateEnrollmentSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <div>{updatePaymentLoading && 'updatePaymentLoading'}</div>

        <div>{updatePaymentSuccess && 'updatePaymentSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <div>{createEnrollmentLoading && 'createEnrollmentLoading'}</div>

        <div>{createEnrollmentSuccess && 'createEnrollmentSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <div>{previewEnrollmentLoading && 'previewEnrollmentLoading'}</div>

        <div>{previewEnrollmentSuccess && 'previewEnrollmentSuccess'}</div>

        {/* ////////////////////////////////////////////////// */}

        <button onClick={handleUpdatePayment}>updatePayment</button>

        <button onClick={handleUpdateEnrollment}>updateEnrollment</button>

        <button onClick={handleCreateEnrollment}>createEnrollment</button>

        <button onClick={handlePreviewEnrollment}>previewEnrollment</button>
      </>
    )
  })

  const { getByText } = render(<Wrapper profileId={_profileId} />)

  await waitFor(() => expect(getByText('enrollmentIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(getByText('paymentsIsLoading')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(getByText('enrollmentIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  await waitFor(() => expect(getByText('paymentsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  let state = store.getState()

  // access tags used for cache management
  let cacheETagIds = state[apiSlice.reducerPath].provided.ENROLLMENT
  let cachePTagIds = state[apiSlice.reducerPath].provided['ENROLLMENT-PAYMENT']

  // access all profiles in global state
  let payments = selectPaymentByProfileId(state, _profileId)
  let enrollment = selectEnrollmentByProfileId(state, _profileId)
  console.log(cachePTagIds)
  console.log(cacheETagIds)

  let button = getByText('previewEnrollment')
  fireEvent.click(button)

  await waitFor(() => expect(getByText('previewEnrollmentLoading')).toBeInTheDocument(), { timeout: 3000 })
  await waitFor(() => expect(getByText('previewEnrollmentSuccess')).toBeInTheDocument(), { timeout: 3000 })

  console.log(componentData)

  // await waitFor(() => expect(getByText('enrollmentIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  // await waitFor(() => expect(getByText('paymentsIsFetching')).toBeInTheDocument(), { timeout: 5000 })
  // await waitFor(() => expect(getByText('enrollmentIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
  // await waitFor(() => expect(getByText('paymentsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

  state = store.getState()

  // access tags used for cache management
  cacheETagIds = state[apiSlice.reducerPath].provided.ENROLLMENT
  cachePTagIds = state[apiSlice.reducerPath].provided['ENROLLMENT-PAYMENT']

  // access all profiles in global state
  payments = selectPaymentByProfileId(state, _profileId)
  enrollment = selectEnrollmentByProfileId(state, _profileId)
  console.log(cachePTagIds)
  console.log(cacheETagIds)
  console.log(payments)
  console.log(enrollment)
}, 10000)

// test('payment info', async () => {
//   let _paymentId = '2f38e1f1-7c73-4d51-c4b5-08db4ab3a752'

//   const _createTestData = {
//     profileId: _profileId,
//     processedDate: '2023-04-07',
//     amount: 10.5,
//     memo: 'test pot payment',
//     processor: 'settingservice_paymentprocessor_nacha',
//     paymentType: 0
//   }

//   const _updatePaymentData = {
//     profileId: _profileId,
//     paymentId: _paymentId,
//     processedDate: '2023-06-30',
//     clearedDate: '2023-07-01',
//     amount: 1500,
//     memo: 'test post',
//     processor: 'test',
//     paymentType: 1,
//     Description: 'test',
//     status: 1
//   }

//   const useGetEnrollmentPreviewQueryMock = jest.spyOn(enrollmentApiSlice, 'useGetEnrollmentPreviewQuery')
//   const useGetProfilePaymentsQueryMock = jest.spyOn(enrollmentApiSlice, 'useGetProfilePaymentsQuery')
//   const usePostCreatePaymentMutationMock = jest.spyOn(enrollmentApiSlice, 'usePostCreatePaymentMutation')
//   const usePutUpdatePaymentMutationMock = jest.spyOn(enrollmentApiSlice, 'usePutUpdatePaymentMutation')

//   const Wrapper = storeWrapper(({ profileId }) => {
//     const {
//       isLoading: enrollmentIsLoading,
//       isFetching: enrollmentIsFetching,
//       isSuccess: enrollmentIsSuccess
//     } = useGetEnrollmentPreviewQueryMock(profileId)
//     const {
//       isLoading: paymentsIsLoading,
//       isFetching: paymentsIsFetching,
//       isSuccess: paymentsIsSuccess
//     } = useGetProfilePaymentsQueryMock(profileId)

//     const [updatePayment, { isLoading: updatePaymentLoading, isSuccess: updatePaymentSuccess }] =
//       usePutUpdatePaymentMutationMock()
//     const [createPayment, { isLoading: createPaymentLoading, isSuccess: createPaymentSuccess }] =
//       usePostCreatePaymentMutationMock()

//     async function handleUpdatePayment() {
//       const { data } = await updatePayment(_updatePaymentData).unwrap()
//       console.log(data)
//     }

//     async function handleCreatePayment() {
//       const { data } = await createPayment(_createTestData).unwrap()
//       console.log(data)
//     }

//     return (
//       <>
//         {/* ////////////////////////////////////////////////// */}
//         <div>{enrollmentIsLoading && 'enrollmentIsLoading'}</div>

//         <div>{enrollmentIsFetching && 'enrollmentIsFetching'}</div>

//         <div>
//           {enrollmentIsFetching && 'enrollmentIsFetching'}
//           {enrollmentIsSuccess && 'enrollmentIsSuccess'}
//         </div>

//         {/* ////////////////////////////////////////////////// */}
//         <div>{paymentsIsLoading && 'paymentsIsLoading'}</div>

//         <div>{paymentsIsFetching && 'paymentsIsFetching'}</div>

//         <div>
//           {paymentsIsFetching && 'paymentsIsFetching'}
//           {paymentsIsSuccess && 'paymentsIsSuccess'}
//         </div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{updatePaymentLoading && 'updatePaymentLoading'}</div>

//         <div>{updatePaymentSuccess && 'updatePaymentSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{createPaymentLoading && 'createPaymentLoading'}</div>

//         <div>{createPaymentSuccess && 'createPaymentSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <button onClick={handleUpdatePayment}>updatePayment</button>

//         <button onClick={handleCreatePayment}>createPayment</button>
//       </>
//     )
//   })

//   const { getByText } = render(<Wrapper profileId={_profileId} paymentId={_paymentId} />)

//   await waitFor(() => expect(getByText('enrollmentIsLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('paymentsIsLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('enrollmentIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('paymentsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   let state = store.getState()

//   // access tags used for cache management
//   let cacheETagIds = state[apiSlice.reducerPath].provided.ENROLLMENT
//   let cachePTagIds = state[apiSlice.reducerPath].provided['ENROLLMENT-PAYMENT']

//   let payments = selectPaymentByProfileId(state, _profileId)
//   let enrollment = selectEnrollmentByProfileId(state, _profileId)
//   console.log(cachePTagIds)
//   console.log(cacheETagIds)

//   // console.log(payments)
//   console.log(enrollment)

//   let button = getByText('createPayment')
//   fireEvent.click(button)

//   await waitFor(() => expect(getByText('createPaymentLoading')).toBeInTheDocument(), { timeout: 3000 })
//   await waitFor(() => expect(getByText('createPaymentSuccess')).toBeInTheDocument(), { timeout: 3000 })
//   await waitFor(() => expect(getByText('enrollmentIsFetching')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('paymentsIsFetching')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('enrollmentIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('paymentsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   state = store.getState()

//   // access tags used for cache management
//   cacheETagIds = state[apiSlice.reducerPath].provided.ENROLLMENT
//   cachePTagIds = state[apiSlice.reducerPath].provided['ENROLLMENT-PAYMENT']

//   // access all profiles in global state
//   payments = selectPaymentByProfileId(state, _profileId)
//   enrollment = selectEnrollmentByProfileId(state, _profileId)
//   console.log(cachePTagIds)
//   console.log(cacheETagIds)
//   console.log(payments)
//   console.log(enrollment)

// }, 10000)

// test('payment info', async () => {
//   const useGetEnrollmentQueryMock = jest.spyOn(enrollmentApiSlice, 'useGetEnrollmentQuery')
//   const useGetProfilePaymentsQueryMock = jest.spyOn(enrollmentApiSlice, 'useGetProfilePaymentsQuery')
//   const usePostCancelEnrollmentMutationMock = jest.spyOn(enrollmentApiSlice, 'usePostCancelEnrollmentMutation')
//   const usePostPauseEnrollmentMutationMock = jest.spyOn(enrollmentApiSlice, 'usePostPauseEnrollmentMutation')
//   const usePostResumeEnrollmentMutationMock = jest.spyOn(enrollmentApiSlice, 'usePostResumeEnrollmentMutation')

//   const Wrapper = storeWrapper(({ profileId }) => {
//     const {
//       isLoading: enrollmentIsLoading,
//       isFetching: enrollmentIsFetching,
//       isSuccess: enrollmentIsSuccess
//     } = useGetEnrollmentQueryMock(profileId)
//     const {
//       isLoading: paymentsIsLoading,
//       isFetching: paymentsIsFetching,
//       isSuccess: paymentsIsSuccess
//     } = useGetProfilePaymentsQueryMock(profileId)

//     const [cancelPayment, { isLoading: cancelPaymentLoading, isSuccess: cancelPaymentSuccess }] =
//       usePostCancelEnrollmentMutationMock()
//     const [pausePayment, { isLoading: pausePaymentLoading, isSuccess: pausePaymentSuccess }] =
//       usePostPauseEnrollmentMutationMock()
//     const [resumePayment, { isLoading: resumePaymentLoading, isSuccess: resumePaymentSuccess }] =
//       usePostResumeEnrollmentMutationMock()

//     async function handleCancel() {
//       const data = await cancelPayment(profileId).unwrap()
//       console.log(data)
//     }

//     async function handleResume() {
//       const data = await resumePayment(profileId).unwrap()
//       console.log(data)
//     }

//     async function handlePause() {
//       const data = await pausePayment(profileId).unwrap()
//       console.log(data)
//     }

//     return (
//       <>
//         {/* ////////////////////////////////////////////////// */}
//         <div>{enrollmentIsLoading && 'enrollmentIsLoading'}</div>

//         <div>{enrollmentIsFetching && 'enrollmentIsFetching'}</div>

//         <div>
//           {enrollmentIsFetching && 'enrollmentIsFetching'}
//           {enrollmentIsSuccess && 'enrollmentIsSuccess'}
//         </div>

//         {/* ////////////////////////////////////////////////// */}
//         <div>{paymentsIsLoading && 'paymentsIsLoading'}</div>

//         <div>{paymentsIsFetching && 'paymentsIsFetching'}</div>

//         <div>
//           {paymentsIsFetching && 'paymentsIsFetching'}
//           {paymentsIsSuccess && 'paymentsIsSuccess'}
//         </div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{cancelPaymentLoading && 'cancelPaymentLoading'}</div>

//         <div>{cancelPaymentSuccess && 'cancelPaymentSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{pausePaymentLoading && 'pausePaymentLoading'}</div>

//         <div>{pausePaymentSuccess && 'pausePaymentSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{resumePaymentLoading && 'resumePaymentLoading'}</div>

//         <div>{resumePaymentSuccess && 'resumePaymentSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <button onClick={handleCancel}>cancel</button>

//         <button onClick={handlePause}>pause</button>

//         <button onClick={handleResume}>resume</button>
//       </>
//     )
//   })

//   const { getByText } = render(<Wrapper profileId={_profileId} />)

//   await waitFor(() => expect(getByText('enrollmentIsLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('paymentsIsLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('enrollmentIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('paymentsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   let state = store.getState()

//   // access tags used for cache management
//   let cacheETagIds = state[apiSlice.reducerPath].provided.ENROLLMENT
//   let cachePTagIds = state[apiSlice.reducerPath].provided['ENROLLMENT-PAYMENT']

//   let payments = selectPaymentByProfileId(state, _profileId)
//   let enrollment = selectEnrollmentByProfileId(state, _profileId)
//   console.log(cachePTagIds)
//   console.log(cacheETagIds)

//   // console.log(payments)
//   console.log(enrollment)

//   let button = getByText('pause')
//   fireEvent.click(button)

//   await waitFor(() => expect(getByText('pausePaymentLoading')).toBeInTheDocument(), { timeout: 3000 })
//   await waitFor(() => expect(getByText('pausePaymentSuccess')).toBeInTheDocument(), { timeout: 3000 })
//   await waitFor(() => expect(getByText('enrollmentIsFetching')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('paymentsIsFetching')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('enrollmentIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('paymentsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   state = store.getState()

//   // access tags used for cache management
//   cacheETagIds = state[apiSlice.reducerPath].provided.ENROLLMENT
//   cachePTagIds = state[apiSlice.reducerPath].provided['ENROLLMENT-PAYMENT']

//   // access all profiles in global state
//   payments = selectPaymentByProfileId(state, _profileId)
//   enrollment = selectEnrollmentByProfileId(state, _profileId)
//   console.log(cachePTagIds)
//   console.log(cacheETagIds)
//   console.log(payments)
//   console.log(enrollment)
// }, 10000)

// test('payment info', async () => {
//   const useGetEnrollmentQueryMock = jest.spyOn(enrollmentApiSlice, 'useGetEnrollmentQuery')
//   const useGetProfilePaymentsQueryMock = jest.spyOn(enrollmentApiSlice, 'useGetProfilePaymentsQuery')
//   const usePostCancelEnrollmentMutationMock = jest.spyOn(enrollmentApiSlice, 'usePostCancelEnrollmentMutation')
//   const usePostPauseEnrollmentMutationMock = jest.spyOn(enrollmentApiSlice, 'usePostPauseEnrollmentMutation')
//   const usePostResumeEnrollmentMutationMock = jest.spyOn(enrollmentApiSlice, 'usePostResumeEnrollmentMutation')

//   const Wrapper = storeWrapper(({ profileId }) => {
//     const {
//       isLoading: enrollmentIsLoading,
//       isFetching: enrollmentIsFetching,
//       isSuccess: enrollmentIsSuccess
//     } = useGetEnrollmentQueryMock(profileId)
//     const {
//       isLoading: paymentsIsLoading,
//       isFetching: paymentsIsFetching,
//       isSuccess: paymentsIsSuccess
//     } = useGetProfilePaymentsQueryMock(profileId)

//     const [cancelPayment, { isLoading: cancelPaymentLoading, isSuccess: cancelPaymentSuccess }] =
//       usePostCancelEnrollmentMutationMock()
//     const [pausePayment, { isLoading: pausePaymentLoading, isSuccess: pausePaymentSuccess }] =
//       usePostPauseEnrollmentMutationMock()
//     const [resumePayment, { isLoading: resumePaymentLoading, isSuccess: resumePaymentSuccess }] =
//       usePostResumeEnrollmentMutationMock()

//     async function handleCancel() {
//       const testData = {
//         profileId,
//         cancelDisposition: 'hello'
//       }
//       const data = await cancelPayment(testData).unwrap()
//       console.log(data)
//     }

//     async function handleResume() {
//       const data = await resumePayment(profileId).unwrap()
//       console.log(data)
//     }

//     async function handlePause() {
//       const data = await pausePayment(profileId).unwrap()
//       console.log(data)
//     }

//     return (
//       <>
//         {/* ////////////////////////////////////////////////// */}
//         <div>{enrollmentIsLoading && 'enrollmentIsLoading'}</div>

//         <div>{enrollmentIsFetching && 'enrollmentIsFetching'}</div>

//         <div>
//           {enrollmentIsFetching && 'enrollmentIsFetching'}
//           {enrollmentIsSuccess && 'enrollmentIsSuccess'}
//         </div>

//         {/* ////////////////////////////////////////////////// */}
//         <div>{paymentsIsLoading && 'paymentsIsLoading'}</div>

//         <div>{paymentsIsFetching && 'paymentsIsFetching'}</div>

//         <div>
//           {paymentsIsFetching && 'paymentsIsFetching'}
//           {paymentsIsSuccess && 'paymentsIsSuccess'}
//         </div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{cancelPaymentLoading && 'cancelPaymentLoading'}</div>

//         <div>{cancelPaymentSuccess && 'cancelPaymentSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{pausePaymentLoading && 'pausePaymentLoading'}</div>

//         <div>{pausePaymentSuccess && 'pausePaymentSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{resumePaymentLoading && 'resumePaymentLoading'}</div>

//         <div>{resumePaymentSuccess && 'resumePaymentSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <button onClick={handleCancel}>cancel</button>

//         <button onClick={handlePause}>pause</button>

//         <button onClick={handleResume}>resume</button>
//       </>
//     )
//   })

//   const { getByText } = render(<Wrapper profileId={_profileId} />)

//   await waitFor(() => expect(getByText('enrollmentIsLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('paymentsIsLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('enrollmentIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('paymentsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   let state = store.getState()

//   // access tags used for cache management
//   let cacheETagIds = state[apiSlice.reducerPath].provided.ENROLLMENT
//   let cachePTagIds = state[apiSlice.reducerPath].provided['ENROLLMENT-PAYMENT']

//   let payments = selectPaymentByProfileId(state, _profileId)
//   let enrollment = selectEnrollmentByProfileId(state, _profileId)
//   console.log(cachePTagIds)
//   console.log(cacheETagIds)

//   // console.log(payments)
//   console.log(enrollment)

//   let button = getByText('pause')
//   fireEvent.click(button)

//   await waitFor(() => expect(getByText('pausePaymentLoading')).toBeInTheDocument(), { timeout: 3000 })
//   await waitFor(() => expect(getByText('pausePaymentSuccess')).toBeInTheDocument(), { timeout: 3000 })
//   await waitFor(() => expect(getByText('enrollmentIsFetching')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('paymentsIsFetching')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('enrollmentIsSuccess')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('paymentsIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   state = store.getState()

//   // access tags used for cache management
//   cacheETagIds = state[apiSlice.reducerPath].provided.ENROLLMENT
//   cachePTagIds = state[apiSlice.reducerPath].provided['ENROLLMENT-PAYMENT']

//   // access all profiles in global state
//   payments = selectPaymentByProfileId(state, _profileId)
//   enrollment = selectEnrollmentByProfileId(state, _profileId)
//   console.log(cachePTagIds)
//   console.log(cacheETagIds)
//   console.log(payments)
//   console.log(enrollment)
// }, 10000)

// test('submit / enroll / approve', async () => {
//   const useGetProfileInfoQueryMock = jest.spyOn(profileApiSlice, 'useGetProfileInfoQuery')

//   // const useGetProfileStatusQueryMock = jest.spyOn(profileApiSlice, 'useGetProfileStatusQuery')
//   const usePostProfileSubmitMutationMock = jest.spyOn(profileApiSlice, 'usePostProfileSubmitMutation')
//   const usePostProfileRejectMutationMock = jest.spyOn(profileApiSlice, 'usePostProfileRejectMutation')
//   const usePostProfileEnrollMutationMock = jest.spyOn(profileApiSlice, 'usePostProfileEnrollMutation')
//   const usePostProfileApproveMutationMock = jest.spyOn(profileApiSlice, 'usePostProfileApproveMutation')

//   const Wrapper = storeWrapper(({ profileId }) => {
//     const {
//       isLoading: profileIsLoading,
//       isFetching: profileIsFetching,
//       isSuccess: profileIsSuccess
//     } = useGetProfileInfoQueryMock(profileId)

//     // const {
//     //   isLoading: statusIsLoading,
//     //   isFetching: statusIsFetching,
//     //   isSuccess: statusIsSuccess
//     // } = useGetProfileStatusQueryMock()

//     const [submit, { isLoading: submitLoading, isSuccess: submitSuccess }] = usePostProfileSubmitMutationMock()
//     const [reject, { isLoading: rejectLoading, isSuccess: rejectSuccess }] = usePostProfileRejectMutationMock()
//     const [approve, { isLoading: approveLoading, isSuccess: approveSuccess }] = usePostProfileApproveMutationMock()
//     const [enroll, { isLoading: enrollLoading, isSuccess: enrollSuccess }] = usePostProfileEnrollMutationMock()

//     async function handleSubmit() {
//       const data = await submit(profileId).unwrap()
//       console.log(data)
//     }

//     async function handleReject() {
//       const data = await reject(profileId).unwrap()
//       console.log(data)
//     }

//     async function handleEnroll() {
//       const data = await enroll(profileId).unwrap()
//       console.log(data)
//     }

//     async function handleApprove() {
//       const data = await approve(profileId).unwrap()
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
//         {/* <div>{statusIsLoading && 'statusIsLoading'}</div>

//         <div>{statusIsFetching && 'statusIsFetching'}</div>

//         <div>
//           {statusIsFetching && 'statusIsFetching'}
//           {statusIsSuccess && 'statusIsSuccess'}
//         </div> */}

//         {/* ////////////////////////////////////////////////// */}

//         <div>{submitLoading && 'submitLoading'}</div>

//         <div>{submitSuccess && 'submitSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{rejectLoading && 'rejectLoading'}</div>

//         <div>{rejectSuccess && 'rejectSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{approveLoading && 'approveLoading'}</div>

//         <div>{approveSuccess && 'approveSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <div>{enrollLoading && 'enrollLoading'}</div>

//         <div>{enrollSuccess && 'enrollSuccess'}</div>

//         {/* ////////////////////////////////////////////////// */}

//         <button onClick={handleApprove}>approve</button>

//         <button onClick={handleEnroll}>enroll</button>

//         <button onClick={handleReject}>reject</button>

//         <button onClick={handleSubmit}>submit</button>
//       </>
//     )
//   })

//   const { getByText } = render(<Wrapper profileId={_profileId} />)

//   await waitFor(() => expect(getByText('profileIsLoading')).toBeInTheDocument(), { timeout: 5000 })

//   // await waitFor(() => expect(getByText('statusIsLoading')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   // await waitFor(() => expect(getByText('statusIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   let state = store.getState()

//   // access tags used for cache management
//   let cacheETagIds = state[apiSlice.reducerPath].provided.PROFILE

//   // let cachePTagIds = state[apiSlice.reducerPath].provided['PROFILE-STATUS']

//   let profile = selectProfileById(state, _profileId)

//   // console.log(cachePTagIds)
//   console.log(cacheETagIds)

//   // console.log(payments)
//   console.log(profile)

//   let button = getByText('enroll')
//   fireEvent.click(button)

//   await waitFor(() => expect(getByText('enrollLoading')).toBeInTheDocument(), { timeout: 3000 })
//   await waitFor(() => expect(getByText('enrollSuccess')).toBeInTheDocument(), { timeout: 3000 })
//   await waitFor(() => expect(getByText('profileIsFetching')).toBeInTheDocument(), { timeout: 5000 })
//   await waitFor(() => expect(getByText('profileIsSuccess')).toBeInTheDocument(), { timeout: 5000 })

//   state = store.getState()

//   // access tags used for cache management
//   cacheETagIds = state[apiSlice.reducerPath].provided.PROFILE

// cachePTagIds = state[apiSlice.reducerPath].provided['PROFILE-STATUS']

//   profile = selectProfileById(state, _profileId)

//   // console.log(cachePTagIds)
//   console.log(cacheETagIds)

//   // console.log(payments)
//   console.log(profile)
// }, 10000)
