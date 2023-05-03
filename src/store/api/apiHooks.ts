import { bankAccountApiSlice } from './bankAccountApiSlice'
import { campaignApiSlice } from './campaignApiSlice'
import { companyApiSlice } from './companyApiSlice'
import { companySettingApiSlice } from './companySettingApiSlice'
import { documentApiSlice } from './documentApiSlice'
import { enrollmentApiSlice } from './enrollmentApiSlice'
import { liabilityApiSlice } from './liabilityApiSlice'
import { profileApiSlice } from './profileApiSlice'
import { profileBudgetApiSlice } from './profileBudgetApiSlice'
import { taskApiSlice } from './taskApiSlice'

// SOL REDUX API POINTS

// BANK ACCOUNT
export const {
  // GET bankaccount/profileId/profile
  useGetBankAccountsQuery,

  // POST bankaccount/profileId/profile
  useCreateBankAccountMutation,

  // PUT bankaccount/bankaccountId
  useUpdateBankAccountMutation,

  // DELETE bankaccount/bankaccountId
  useDeleteBankAccountMutation
} = bankAccountApiSlice

// CAMPAIGN
export const {
  // GET campaign/id/info
  useGetCampaignQuery,

  // POST campaign/search
  useGetCampaignsQuery,

  // POST campaign
  useCreateCampaignMutation,

  // PUT campaign/campaignId
  useUpdateCampaignMutation,

  // DELETE campaign/campaignId
  useDeleteCampaignMutation
} = campaignApiSlice

// COMPANY
export const {
  // POST company/search
  useGetCompaniesQuery,

  // GET company/companyId/info
  useGetCompanyQuery,

  // POST company
  useCreateCompanyMutation,

  // PUT company/companyId
  useUpdateCompanyMutation,

  // PUT company/companyId/enable
  useEnableCompanyMutation,

  // PUT company/companyId/disable
  useDisableCompanyMutation
} = companyApiSlice

// COMPANY SETTINGS
export const {
  // GET company/companyId/setting/creditreport
  useGetCompanySettingCreditReportQuery,

  // POST company/companyId/setting/creditreport
  useCreateCompanySettingCreditReportMutation,

  // GET company/companyId/setting/esign
  useGetCompanySettingEsignQuery,

  // POST company/companyId/setting/esign
  useCreateCompanySettingEsignMutation,

  // GET company/companyId/setting/storage
  useGetCompanySettingStorageQuery,

  // POST company/companyId/setting/storage
  useCreateCompanySettingStorageMutation
} = companySettingApiSlice

// DOCUMENTS
export const {
  // GET document/profileId/profile
  useGetDocumentsQuery,

  // GET document/profileId/profile/liabilityId/liability
  useGetDocumentByLiabilityQuery,

  // GET document/documentId/preview
  useGetDocumentPreviewQuery,

  // POST document/profileId/profile/generate
  usePostGenerateDocumentMutation,

  // POST document/profileId/profile/liabilityId/liability/generate
  usePostGenerateLiabilityDocumentMutation,

  // POST document/profileId/profile/upload
  usePostUploadDocumentMutation,

  // POST document/profileId/profile/liabilityId/liability/upload
  usePostUploadLiabilityDocumentMutation,

  // POST document/profileId/profile/esign/send
  usePostEsignDocumentMutation,

  // POST document/profileId/profile/liabilityId/liability/esign/send
  usePostEsignLiabilityDocumentMutation
} = documentApiSlice

export const {
  // GET enrollment/profileId/profile
  useGetEnrollmentQuery,

  // POST enrollment/profileId/profile
  usePostCreateEnrollmentMutation,

  // PUT enrollment/profileId/profile
  usePutUpdateEnrollmentMutation,

  // GET enrollment/profileId/profile/payments
  useGetProfilePaymentsQuery,

  // GET enrollment/profileId/profile/payments/paymentId/info
  useGetProfilePaymentInfoQuery,

  // POST enrollment/profileId/profile/payment
  usePostCreatePaymentMutation,

  // PUT enrollment/profileId/profile/payment
  usePutUpdatePaymentMutation,

  // POST enrollment/search
  usePostSearchEnrollmentQuery,

  // POST enrollment/profileId/profile/cancel
  usePostCancelEnrollmentMutation,

  // POST enrollment/profileId/profile/pause
  usePostPauseEnrollmentMutation,

  // POST enrollment/profileId/profile/resume
  usePostResumeEnrollmentMutation,

  // POST enrollment/profileId/preview
  useGetEnrollmentPreviewMutation
} = enrollmentApiSlice

// LIABILITY
export const {
  // GET liability/liabilityId/basic
  useGetLiabilityQuery,

  // GET liability/profileId/profile
  useGetProfileLiabilitiesQuery,

  // POST liability/profileId/profile
  usePostCreateLiabilityMutation,

  // POST liability/search
  usePostSearchLiabilitiesQuery,

  // PUT liability/liabilityId
  usePutUpdateLiabilityMutation,

  // PUT liability/enroll
  usePutEnrollLiabilitiesMutation,

  // PUT liability/withdraw
  usePutWithdrawLiabilitiesMutation
} = liabilityApiSlice

// PROFILE
export const {
  // GET profile/profileId/info
  useGetProfileInfoQuery,

  // POST profile/search
  useGetProfilesQuery,

  // GET profile/profileId/basic
  useGetProfileBasicQuery,

  // GET profile/profileId/status-summary
  useGetProfileStatusQuery,

  // GET profile/quicksearch/keyword
  useProfileQuickSearchQuery,

  // GET profile/profileId/labels
  useGetProfileLabelsQuery,

  // POST profile/profileId/labels
  usePostProfileLabelsMutation,

  // POST profile/profileId/customField
  useCreateProfileCustomFieldMutation,

  // POST profile
  useCreateProfileMutation,

  // POST profile/profileId/assign
  useAssignProfileMutation,

  // POST profile/export
  usePostExportProfilesMutation,

  // POST profile/profileId/approve
  usePostProfileApproveMutation,

  // POST profile/profileId/enroll
  usePostProfileEnrollMutation,

  // POST profile/profileId/reject
  usePostProfileRejectMutation,

  // POST profile/profileId/submit
  usePostProfileSubmitMutation,

  // POST profile/profileId/disable-auth
  useProfileDisableAuthMutation,

  // POST profile/profileId/grant-auth
  useProfileGrantAuthMutation,

  // PUT profile/profileId/stage
  usePutUpdateProfileStatusMutation,

  // PUT profile/profileId
  usePutUpdateProfileMutation,

  // PUT profile/profileId/delete
  usePutDeleteProfileMutation
} = profileApiSlice

// PROFILE BUDGET
export const {
  // GET profile/profileId/budget
  useGetProfileBudgetsQuery,

  // GET setting/budgets
  useGetBudgetsQuery,

  // GET setting/budgets/budgetId/info
  useGetBudgetInfoQuery,

  // PUT profile/profileId/budget
  usePostProfileBudgetsMutation,

  // POST setting/budgets
  usePostBudgetsMutation,

  // POST setting/budgets/budgetId/disable
  usePutDisableBudgetMutation,

  // POST setting/budgets/budgetId/enable
  usePutEnableBudgetMutation,

  // POST setting/budgets/budgetId
  usePutUpdateBudgetMutation
} = profileBudgetApiSlice

// TASKS
export const {
  // GET task/taskId/info
  useGetTaskQuery,

  // GET task/profileId/profile
  useGetProfileTasksQuery,

  // PUT task/profileId/profile
  usePutUpdateTaskMutation,

  // PUT task/bulk-update
  usePutBulkUpdateTasksMutation,

  // POST task/profileId/profile
  usePostCreateTaskMutation,

  // POST task/search
  usePostSearchTaskQuery
} = taskApiSlice
