import { bankAccountApiSlice } from './bankAccountApiSlice'
import { campaignApiSlice } from './campaignApiSlice'
import { companyApiSlice } from './companyApiSlice'
import { companySettingApiSlice } from './companySettingApiSlice'
import { creditCardApiSlice } from './creditCardApiSlice'
import { creditReportApiSlice } from './creditReportApiSlice'
import { documentApiSlice } from './documentApiSlice'
import { emailApiSlice } from './emailApiSlice'
import { employeeApiSlice } from './employeeApiSlice'
import { enrollmentApiSlice } from './enrollmentApiSlice'
import { liabilityApiSlice } from './liabilityApiSlice'
import { profileApiSlice } from './profileApiSlice'
import { profileBudgetApiSlice } from './profileBudgetApiSlice'
import { settingApiSlice } from './settingApiSlice'
import { taskApiSlice } from './taskApiSlice'

// SOL REDUX API POINTS

// ********************************************* BANK ACCOUNT

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

// ********************************************** CAMPAIGN

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

// ********************************************** COMPANY

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

// ********************************************** COMPANY SETTING

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

// ********************************************** CREDIT CARD

export const {
  // GET creditcard/profileId/profile
  useGetCreditCardsQuery,

  // POST creditcard/profileId/profile
  useCreateCreditCardMutation,

  // PUT creditcard/creditcardId
  useUpdateCreditCardMutation,

  // DELETE creditcard/creditcardId
  useDeleteCreditCardMutation
} = creditCardApiSlice

// ********************************************** CREDIT REPORT

export const {
  // GET creditreport/profileId/profile
  useGetCreditReportsQuery,

  // POST creditreport/profileId/profile/request
  usePostProfileCreditReportMutation,

  // POST creditreport/request
  usePostCreditReportMutation
} = creditReportApiSlice

// ********************************************** DOCUMENT

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

// ********************************************** EMAIL

export const {
  // GET email/emailId/info
  useGetEmailQuery,

  // GET email/profileId/profile
  useGetProfileEmailsQuery,

  // GET email/profileId/profile/liabilityId/liability
  useGetProfileLiabilityEmailsQuery,

  // POST email/profileId/profile/send
  usePostProfileEmailMutation,

  // POST email/profileId/profile/liabilityId/liability/send
  usePostProfileLiabilityEmailMutation,

  // POST email/profileId/profile/send-attachment
  usePostEmailAttachmentMutation
} = emailApiSlice

// ********************************************************************** EMPLOYEE

export const {
  // GET employee/employeeId/info
  useGetEmployeeInfoQuery,

  // GET employee/employeeId/basic
  useGetEmployeeBasicQuery,

  // GET employee/employeeId/snapshot
  useGetEmployeeSnapshotQuery,

  // POST employee/search
  usePostEmployeeSearchQuery,

  // POST employee/employeeId/grant-auth
  usePostEmployeeGrantAuthMutation,

  // POST employee
  usePostEmployeeCreateMutation,

  // PUT employee/employeeId
  usePutEmployeeUpdateMutation,

  // PUT employee/employeeId/enable
  usePutEmployeeEnableMutation,

  // PUT employee/employeeId/disable
  usePutEmployeeDisableMutation
} = employeeApiSlice

// ********************************************************************** ENROLLMENT

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

// ********************************************** LIABILITY

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

// ********************************************** PROFILE

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

// ********************************************** PROFILE BUDGET

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

// ********************************************** TASKS

export const {
  // GET task/taskId/info
  useGetTaskQuery,

  // GET task/profileId/profile
  useGetProfileTasksQuery,

  // PUT task/taskId
  usePutUpdateTaskMutation,

  // PUT task/bulk-update
  usePutBulkUpdateTasksMutation,

  // POST task/profileId/profile
  usePostCreateTaskMutation,

  // POST task/search
  usePostSearchTaskQuery,

  // DELETE task/taskId/
  useDeleteTaskMutation
} = taskApiSlice

// ********************************************** SETTINGS

export const {
  // GET setting/addresses/addressId/info
  useGetAddressQuery,

  // GET setting/addresses
  useGetAddressesQuery,

  // POST setting/addresses
  usePostAddressMutation,

  // POST setting/addresses/search
  usePostAddressSearchQuery,

  // PUT setting/addresses/addressId
  usePutAddressMutation,

  // PUT setting/addresses/addressId/enable
  usePutAddressEnableMutation,

  // PUT setting/addresses/addressId/disable
  usePutAddressDisableMutation,

  // GET setting/assignees/assigneeId/info
  useGetAssigneeQuery,

  // GET setting/assignees
  useGetAssigneesQuery,

  // POST setting/assignees
  usePostAssigneeMutation,

  // PUT setting/assignees/assigneeId
  usePutAssigneeMutation,

  // PUT setting/assignees/assigneeId/enable
  usePutAssigneeEnableMutation,

  // PUT setting/assignees/assigneeId/disable
  usePutAssigneeDisableMutation,

  // GET setting/assignees/assigneeId/datasource
  useGetAssigneeDatasourceQuery,

  // GET setting/contacts/contactId/info
  useGetContactQuery,

  // POST setting/contacts/search
  usePostContactSearchQuery,

  // POST setting/contacts
  usePostContactMutation,

  // PUT setting/contacts/contactId
  usePutContactMutation,

  // PUT setting/contacts/contactId/enable
  usePutContactEnableMutation,

  // PUT setting/contacts/contactId/disable
  usePutContactDisableMutation,

  // GET setting/customFields/customFieldId/info
  useGetCustomFieldQuery,

  // POST setting/customFields/search
  usePostCustomFieldSearchQuery,

  // POST setting/customFields
  usePostCustomFieldMutation,

  // PUT setting/customFields/customFieldId
  usePutCustomFieldMutation,

  // PUT setting/customFields/customFieldId/enable
  usePutCustomFieldEnableMutation,

  // PUT setting/customFields/customFieldId/disable
  usePutCustomFieldDisableMutation,

  // GET setting/labels/labelId/info
  useGetLabelQuery,

  // POST setting/labels/search
  usePostLabelSearchQuery,

  // POST setting/labels
  usePostLabelMutation,

  // PUT setting/labels/labelId
  usePutLabelMutation,

  // PUT setting/labels/labelId/enable
  usePutLabelEnableMutation,

  // PUT setting/labels/labelId/disable
  usePutLabelDisableMutation,

  // GET setting/id/info
  useGetSettingQuery,

  // POST setting/search
  usePostSettingSearchQuery,

  // POST setting
  usePostSettingMutation,

  // PUT setting/id
  usePutSettingMutation,

  // PUT setting/id/delete
  usePutSettingDeleteMutation
} = settingApiSlice
