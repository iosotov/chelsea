import { updateEnrollments } from '../enrollmentSlice'
import { setPayments, updatePayments } from '../paymentSlice'
import { apiSlice } from './apiSlice'
import { EnrollmentDefaultModel } from './defaultValues'
import { LunaResponseType, SearchFilterType } from './sharedTypes'

export enum EnrollmentPaymentMethod {
  'ach',
  'credit',
  'debit'
}

export enum EnrollmentDetailStatus {
  'open',
  'pending',
  'cleared',
  'returned',
  'apused',
  'cancelled',
  'reversed',
  'rejected',
  'error',
  'voided',
  'unknown'
}

export enum FeeType {
  'fixed amount',
  'percentage'
}

export enum RecurringType {
  'monthly',
  'weekly',
  'biweekly'
}

export enum PaymentType {
  'MonthlyPayment',
  'InitialDownPayment',
  'AdditionalPayment'
}

export enum ProfileStatus {
  'inactive',
  'submitted',
  'active',
  'paused',
  'reenrolled',
  'cancelled',
  'resume',
  'approved',
  'returned',
  'created'
}

export type ProfileAssigneeListItemModel = {
  assigneeId: string
  assigneeName: string
  employeeId: string
  employeeName: string
  companyId: string
  companyName: string
}

export type EnrollmentListItemModel = {
  // eslint-disable-next-line lines-around-comment
  // base EnrollmentListModel
  firstName: string
  lastName: string
  status: ProfileStatus
  statusName: string
  submittedDate: string
  enrolledDate: string
  profileAssignees: ProfileAssigneeListItemModel[]
  createdCompany: string
  createdCompanyName: string
  enrollmentDetailId: string
  processedDate: string
  clearedDate: string
  paymentStatus: EnrollmentDetailStatus
  paymentStatusName: string
  statusDate: string
  memo: string
  description: string
  paymentType: PaymentType
  paymentTypeName: string
}

//API GET INFO MODEL /api/ENrollment/{profileId}/profile
export type EnrollmentInfoModel = {
  enrollmentId: string
  enrolledBalance: string
  paymentMethod: EnrollmentPaymentMethod
  profileId: string
  basePlan: string
  enrollmentFee: number
  programLength: number
  firstPaymentDate: string
  firstPaymentAmount: number
  firstPaymentClearedDate: string
  firstPaymentClearedAmount: number
  nextPaymentDate: string
  nextPaymentAmount: number
  initialFeeAmount: number
  lastPaymentStatus: EnrollmentDetailStatus
  lastPaymentStatusName: string
  lastPaymentDate: string
  lastPaymentAmount: number
  cancelledDate: string
  cancelledBy: string
  cancelDisposition: string
  pausedDate: string
  pausedBy: string
  feeType: FeeType
  clearedPayments: number
  totalPayments: number
  recurringPaymentDate: number
}

// Enrollment Detail Info Get /api/Enrollment/{profileId}/profile/payments & /api/Enrollment/{profileId}/profile/payments/{paymentId}/info
export type PaymentDetailInfoModel = {
  profileId: string
  enrollmentDetailId: string
  processedDate: string
  amount: number
  clearedDate: string
  status: EnrollmentDetailStatus
  statusName: string
  statusDate: string
  paymentName: string
  memo: string
  paymentType: PaymentType
  paymentTypeName: string
  transactionId: string
  description: string
  processor: string
}

// Enrollment Search /api/Enrollment/search
export type EnrollmentSearchResultModel = {
  enrollmentId: string
  enrolledBalance: number
  paymentMethod: EnrollmentPaymentMethod
  profileId: string
  basePlan: string
  enrollmentFee: number
  programLength: number
  firstPaymentDate: string
  firstPaymentAmount: number
  firstPaymentClearedDate: string
  firstPaymentClearedAmount: number
  nextPaymentDate: string
  nextPaymentAmount: number
  initialFeeAmount: number
  lastPaymentStatus: EnrollmentDetailStatus

  // no lastpaymentstatusname?
  lastPaymentDate: string
  lastPaymentAmount: number
  cancelledDate: string
  cancelledBy: string
  cancelDisposition: string
  pausedDate: string
  pausedBy: string
  feeType: FeeType
  clearedPayments: number
  totalPayments: number
  firstName: string
  lastName: string
  status: ProfileStatus
  statusName: string
  submittedDate: string
  enrolledDate: string
  profileAssignees: ProfileAssigneeListItemModel[]
  createdCompany: string
  createdCompanyName: string
  enrollmentDetailId: string
  processedDate: string
  clearedDate: string
  paymentStatus: EnrollmentDetailStatus
  paymentStatusName: string
  statusDate: string
  memo: string
  description: string
  paymentType: PaymentType
  paymentTypeName: string
  transactionId: string
  paymentAmount: number
  processor: string
  dayToProcess: string
}

export type PaymentInfoParams = {
  profileId: string
  paymentId: string
}

export type EnrollmentScheduleInfoType = {
  processedDate: string
  amount: number
  memo: string | null
  type: number
  typeString: string
}

export type EnrollmentPreviewType = {
  enrollmentScheduleInfoModels: EnrollmentScheduleInfoType[]
  totalEnrolledDebt: number
  serviceFee: number
  totalServiceFee: number
  totalAdditionalFee: number
  totalFee: number
}

export type PaymentCreateType = {
  profileId: string
  processedDate?: string
  clearedDate?: string
  amount?: number
  memo?: string
  processor: string
  paymentName?: string
  description?: string
  paymentType?: PaymentType
}

export type PaymentUpdateType = {
  paymentId: string
  profileId: string
  processedDate?: string
  clearedDate?: string
  amount?: number
  memo?: string
  processor: string
  paymentName?: string
  description?: string
  paymentType?: PaymentType
}

export type AdditionalFeesType = {
  feeName: string
  feeType: FeeType
  amount: number
  feeStart: number
  feeEnd: number
}

export type EnrollmentCreateType = {
  profileId: string
  paymentMethod: EnrollmentPaymentMethod
  basePlan: string
  serviceFeeType: FeeType | null
  recurringType?: RecurringType
  enrollmentFee: number
  programLength: number
  gateway: string
  firstPaymentDate: string
  recurringPaymentDate?: string
  initialFeeAmount?: number
  additionalFees?: AdditionalFeesType[]
}

// Enrollment Cancel api/Enrollment/{profileId}/profile/cancel
export type EnrollmentCancelModel = {
  profileId: string
  cancelDisposition: string
}

export const enrollmentApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getEnrollment: builder.query<EnrollmentInfoModel, string>({
      query: profileId => ({
        url: `/enrollment/${profileId}/profile`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error fetching enrollment details')

        return res.data ? res.data : { ...EnrollmentDefaultModel, profileId: arg }
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)

          dispatch(updateEnrollments([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'ENROLLMENT', id: arg }] : []
      }
    }),
    postEnrollmentCreate: builder.mutation<string, EnrollmentCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/enrollment/${profileId}/profile`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating enrollment')

        console.log(res.data)

        return res.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)

          dispatch(updateEnrollments([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res =>
        res
          ? [
              { type: 'ENROLLMENT', id: res },
              { type: 'ENROLLMENT-PAYMENT', id: res }
            ]
          : []
    }),
    putEnrollmentUpdate: builder.mutation<string, EnrollmentCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/enrollment/${profileId}/profile`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error updating enrollment')

        return arg.profileId
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res =>
        res
          ? [
              { type: 'ENROLLMENT', id: res },
              { type: 'ENROLLMENT-PAYMENT', id: res }
            ]
          : []
    }),
    getProfilePayments: builder.query<PaymentDetailInfoModel[], string>({
      query: profileId => {
        return {
          url: `/enrollment/${profileId}/profile/payments`,
          method: 'GET'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error updating enrollment')
        const newPayments = res.data.map((payment: PaymentDetailInfoModel) => ({ ...payment, profileId: arg }))

        return newPayments
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)

          dispatch(setPayments(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (res, error, arg) => (res ? [{ type: 'ENROLLMENT-PAYMENT', id: arg }] : [])
    }),

    getEnrollmentPreview: builder.mutation<EnrollmentPreviewType, EnrollmentCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/enrollment/${profileId}/preview`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching enrollment info')

        return res.data
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          throw err
        }
      }
    }),

    // NOT IMPLEMENTED IN LUNA
    getProfilePaymentInfo: builder.query<PaymentDetailInfoModel, PaymentInfoParams>({
      query: params => {
        const { profileId, paymentId } = params

        return {
          url: `/enrollment/${profileId}/profile/payments/${paymentId}/info`,
          method: 'GET'
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error updating enrollment')

        return res.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)

          dispatch(updatePayments([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (res, error, arg) => (res ? [{ type: 'ENROLLMENT-PAYMENT', id: arg.paymentId }] : [])
    }),
    postPaymentCreate: builder.mutation<boolean, PaymentCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/enrollment/${profileId}/profile/payment`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating payment')

        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'ENROLLMENT', id: arg.profileId },
              { type: 'ENROLLMENT-PAYMENT', id: arg.profileId }
            ]
          : []
    }),
    putPaymentUpdate: builder.mutation<boolean, PaymentUpdateType>({
      query: params => {
        const { profileId, paymentId, ...body } = params

        return {
          url: `/enrollment/${profileId}/profile/${paymentId}/payment`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating payment')

        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'ENROLLMENT', id: arg.profileId },
              { type: 'ENROLLMENT-PAYMENT', id: arg.profileId }
            ]
          : []
    }),

    // NOT IMPLEMENTED IN LUNA
    postEnrollmentSearch: builder.query<EnrollmentSearchResultModel[], SearchFilterType>({
      query: body => {
        return {
          url: `/enrollment/search`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error searching enrollment')

        return res.data
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    }),
    postEnrollmentPause: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/enrollment/${profileId}/profile/pause`,
          method: 'POST'
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error pausing enrollment')

        return res.success
      },
      async onQueryStarted(profileId, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'ENROLLMENT', id: arg },
              { type: 'ENROLLMENT-PAYMENT', id: arg }
            ]
          : []
    }),
    postEnrollmentResume: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/enrollment/${[profileId]}/profile/resume`,
          method: 'POST'
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error resuming enrollment')

        return res.success
      },
      async onQueryStarted(profileId, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'ENROLLMENT', id: arg },
              { type: 'ENROLLMENT-PAYMENT', id: arg }
            ]
          : []
    }),
    postEnrollmentCancel: builder.mutation<boolean, EnrollmentCancelModel>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/enrollment/${[profileId]}/profile/cancel`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error cancelling enrollment')

        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'ENROLLMENT', id: arg.profileId },
              { type: 'ENROLLMENT-PAYMENT', id: arg.profileId }
            ]
          : []
    })
  })
})
