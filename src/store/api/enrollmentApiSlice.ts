import { string } from 'yup'

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

type EnrollmentListItemModel = {
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
type EnrollmentInfoModel = {
  enrollmentId: string
  enrolledBalance: string
  paymentMethod: EnrollmentPaymentMethod
  profileId: string
  basePlan: string
  enrollmentFee: Number
  programLength: Number
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
type EnrollmentDetailInfoModel = {
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
type EnrollmentSearchResultModel = {
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

// Enrollment Cancel api/Enrollment/{profileId}/profile/cancel
type EnrollmentCancelModel = {
  cancelDisposition: string
}
