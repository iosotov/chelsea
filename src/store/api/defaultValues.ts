import type { CreditReportInfoType } from './creditReportApiSlice'

export const EnrollmentDefaultModel = {
  enrollmentId: null,
  enrolledBalance: null,
  paymentMethod: null,
  profileId: null,
  basePlan: null,
  enrollmentFee: null,
  programLength: null,
  firstPaymentDate: null,
  firstPaymentAmount: null,
  firstPaymentClearedDate: null,
  firstPaymentClearedAmount: null,
  nextPaymentDate: null,
  nextPaymentAmount: null,
  initialFeeAmount: null,
  lastPaymentStatus: null,
  lastPaymentStatusName: null,
  lastPaymentDate: null,
  lastPaymentAmount: null,
  cancelledDate: null,
  cancelledBy: null,
  cancelDisposition: null,
  pausedDate: null,
  pausedBy: null,
  feeType: null,
  clearedPayments: null,
  totalPayments: null,
  recurringPaymentDate: null
}

export const CreditReportInfoModel: CreditReportInfoType = {
  profileId: '',
  creditScores: [],
  referenceFile: '',
  fileType: ''
}
