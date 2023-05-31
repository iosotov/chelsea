import { updateEnrollments } from '../enrollmentSlice'
import { setPayments } from '../paymentSlice'
import { apiSlice } from './apiSlice'
import { EnrollmentDefaultModel } from './defaultValues'
import { ErrorResponseType, LunaResponseType, SearchFilterType } from './sharedTypes'

export enum EnrollmentPaymentMethod {
  'ach',
  'credit',
  'none'
}

export enum EnrollmentDetailStatus {
  'open',
  'pending',
  'cleared',
  'returned',
  'paused',
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
  enrollmentId: string
  enrollmentName: string
  companyId: string
  companyName: string
}

export type EnrollmentListItemModel = {
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
  paymentMethod: number
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
  gateway: string
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
  processedDate?: string | Date
  clearedDate?: string | Date
  amount?: number
  memo?: string
  processor: string
  paymentName?: string
  description?: string
  paymentType?: PaymentType
  paymentMethod?: number
}

export type PaymentUpdateType = {
  paymentId: string
  profileId: string
  processedDate?: string | Date
  clearedDate?: string | Date
  amount?: number
  memo?: string
  processor: string
  paymentName?: string
  description?: string
  paymentType?: PaymentType
  status?: number
  paymentMethod?: number
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
  firstPaymentDate: Date
  recurringPaymentDate?: Date
  initialFeeAmount?: number | null
  additionalFees?: AdditionalFeesType[]
}

export type EnrollmentPreviewTableEntry = {
  processDate: string
  serviceFee: number
  maintenanceFee?: number
}

export type EnrollmentPreviewMutatedType = {
  totalEnrolledDebt: string
  totalAdditionalFee: number
  totalFee: number
  totalPayments: number
  totalServiceFee: number
  serviceFee: number
  transactions: EnrollmentPreviewTableEntry[]
}

// Enrollment Cancel api/Enrollment/{profileId}/profile/cancel
export type EnrollmentCancelModel = {
  profileId: string
  cancelDisposition: string
}

export type UpdatePaymentMethodType = {
  profileId: string
  paymentMethod: EnrollmentPaymentMethod
}

export const enrollmentApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // ***************************************************** GET enrollment/profileId/profile
    getEnrollment: builder.query<EnrollmentInfoModel, string>({
      query: profileId => ({
        url: `/enrollment/${profileId}/profile`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching profile enrollment',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        return res.data ? res.data : { ...EnrollmentDefaultModel, profileId: arg }
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(updateEnrollments([data]))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getEnrollment:', error.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'ENROLLMENT', id: arg }] : []
      }
    }),

    // ***************************************************** POST enrollment/profileId/profile
    postEnrollmentCreate: builder.mutation<boolean, EnrollmentCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/enrollment/${profileId}/profile`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating enrollment',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateEnrollments([data]))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in postEnrollmentCreate:', error.message)
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

    // ***************************************************** GET enrollment/enrollmentId/enrollment
    putEnrollmentUpdate: builder.mutation<boolean, EnrollmentCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/enrollment/${profileId}/profile`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating enrollment info',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in putEnrollmentUpdate:', error.message)
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

    // ***************************************************** GET /enrollment/profileId/profile/payments
    getProfilePayments: builder.query<PaymentDetailInfoModel[], string>({
      query: profileId => {
        return {
          url: `/enrollment/${profileId}/profile/payments`,
          method: 'GET'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching payments info',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (res.success) {
          const newPayments = res.data.map((payment: PaymentDetailInfoModel) => ({ ...payment, profileId: arg }))

          return newPayments
        } else {
          return []
        }
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setPayments(data))
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getProfilePayments:', error.message)
        }
      },
      providesTags: (res, error, arg) =>
        res
          ? [
              { type: 'ENROLLMENT-PAYMENT', id: arg },
              ...res.map(e => ({ type: 'ENROLLMENT-PAYMENT' as const, id: e.enrollmentDetailId }))
            ]
          : []
    }),

    // ******************************************************************** GET /enrollment/profileId/preview
    getEnrollmentPreview: builder.mutation<EnrollmentPreviewMutatedType | null, EnrollmentCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/enrollment/${profileId}/preview`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching enrollment preview',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        const {
          totalEnrolledDebt,
          totalAdditionalFee,
          totalFee,
          totalPayments,
          totalServiceFee,
          serviceFee,
          enrollmentScheduleInfoModels
        } = res.data
        const mappedData: EnrollmentPreviewMutatedType = {
          totalEnrolledDebt,
          totalAdditionalFee,
          totalFee,
          totalPayments,
          totalServiceFee,
          serviceFee,
          transactions: []
        }

        const serviceData: { [key: string]: EnrollmentPreviewTableEntry } = {}

        enrollmentScheduleInfoModels
          .filter((e: EnrollmentScheduleInfoType) => e.type === 0)
          .forEach((e: EnrollmentScheduleInfoType) => {
            return (serviceData[e.processedDate] = {
              processDate: e.processedDate,
              serviceFee: e.amount
            })
          })

        const maintenanceData: { [key: string]: Required<EnrollmentPreviewTableEntry> } = {}

        enrollmentScheduleInfoModels
          .filter((e: EnrollmentScheduleInfoType) => e.type === 2)
          .forEach((e: EnrollmentScheduleInfoType) => {
            return (maintenanceData[e.processedDate] = {
              ...serviceData[e.processedDate],
              maintenanceFee: e.amount
            })
          })

        mappedData.transactions = Object.keys(maintenanceData).map((e: any) => {
          return { ...maintenanceData[e], total: maintenanceData[e].serviceFee + maintenanceData[e].maintenanceFee }
        })

        return mappedData
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in getEnrollmentPreview:', error.message)
        }
      }
    }),

    // ***************************************************** POST enrollment/profileId/profile/payment
    postPaymentCreate: builder.mutation<boolean, PaymentCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/enrollment/${profileId}/profile/payment`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating payment',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in postPaymentCreate:', error.message)
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

    // ***************************************************** PUT enrollment/${profileId}/profile/${paymentId}/payment
    putPaymentUpdate: builder.mutation<boolean, PaymentUpdateType>({
      query: params => {
        const { profileId, paymentId, ...body } = params

        return {
          url: `/enrollment/${profileId}/profile/${paymentId}/payment`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating payment',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in putPaymentUpdate:', error.message)
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

    // ***************************************************** POST /enrollment/search
    // NOT IMPLEMENTED IN LUNA
    postEnrollmentSearch: builder.query<EnrollmentSearchResultModel[] | null, SearchFilterType>({
      query: body => {
        return {
          url: `/enrollment/search`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching enrollments',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data.data
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in postEnrollmentSearch:', error.message)
        }
      }
    }),

    // ***************************************************** POST enrollment/profileId/profile/pause
    postEnrollmentPause: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/enrollment/${profileId}/profile/pause`,
          method: 'POST'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error pausing enrollment',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(profileId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in postEnrollmentPause:', error.message)
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

    // ***************************************************** POST enrollment/profileId/profile/resume
    postEnrollmentResume: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/enrollment/${profileId}/profile/resume`,
          method: 'POST'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error resuming enrollment',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(profileId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in postEnrollmentResume:', error.message)
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

    // ***************************************************** POST enrollment/profileId/profile/cancel
    postEnrollmentCancel: builder.mutation<boolean, EnrollmentCancelModel>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/enrollment/${[profileId]}/profile/cancel`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error canceling enrollment',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in postEnrollmentCancel:', error.message)
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

    // ***************************************************** PUT enrollment/profileId/profile/payment-method
    putEnrollmentPaymentMethod: builder.mutation<boolean, UpdatePaymentMethodType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/enrollment/${profileId}/profile/payment-method`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating payment',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          const { error } = err as { error: ErrorResponseType }
          console.error('API error in putPaymentUpdate:', error.message)
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
