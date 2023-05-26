import { authApiSlice } from './authApiSlice'
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
import { groupApiSlice } from './groupApiSlice'
import { liabilityApiSlice } from './liabilityApiSlice'
import { noteApiSlice } from './noteApiSlice'
import { profileApiSlice } from './profileApiSlice'
import { profileBudgetApiSlice } from './profileBudgetApiSlice'
import { roleApiSlice } from './roleApiSlice'
import { settingApiSlice } from './settingApiSlice'
import { taskApiSlice } from './taskApiSlice'
import { userApiSlice } from './userApiSlice'

// SOL REDUX API POINTS

// ********************************************* AUTH

export const {
  // POST user/auth
  usePostAuthLoginMutation,

  // POST user/refresh-token
  usePostAuthRefreshTokenQuery,

  // POST user/revoke-token
  usePostAuthRevokeTokenMutation
} = authApiSlice

// ********************************************* BANK ACCOUNT

export const {
  // GET bankaccount/profileId/profile
  useGetBankAccountsQuery,

  // POST bankaccount/profileId/profile
  usePostBankAccountCreateMutation,

  // PUT bankaccount/bankaccountId
  usePutBankAccountUpdateMutation,

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
  usePostCampaignCreateMutation,

  // PUT campaign/campaignId
  usePutCampaignUpdateMutation,

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
  usePostCompanyCreateMutation,

  // PUT company/companyId
  usePutCompanyUpdateMutation,

  // PUT company/companyId/enable
  usePutCompanyEnableMutation,

  // PUT company/companyId/disable
  usePutCompanyDisableMutation
} = companyApiSlice

// ********************************************** COMPANY SETTING

export const {
  // GET company/companyId/setting/creditreport
  useGetCompanySettingCreditReportQuery,

  // POST company/companyId/setting/creditreport
  usePostCompanySettingCreditReportCreateMutation,

  // GET company/companyId/setting/esign
  useGetCompanySettingEsignQuery,

  // POST company/companyId/setting/esign
  usePostCompanySettingEsignCreateMutation,

  // GET company/companyId/setting/storage
  useGetCompanySettingStorageQuery,

  // POST company/companyId/setting/storage
  usePostCompanySettingStorageCreateMutation
} = companySettingApiSlice

// ********************************************** CREDIT CARD

export const {
  // GET creditcard/profileId/profile
  useGetCreditCardsQuery,

  // POST creditcard/profileId/profile
  usePostCreditCardCreateMutation,

  // PUT creditcard/creditcardId
  usePutCreditCardUpdateMutation,

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
  usePostDocumentGenerateMutation,

  // POST document/profileId/profile/liabilityId/liability/generate
  usePostLiabilityDocumentGenerateMutation,

  // POST document/profileId/profile/upload
  usePostDocumentUploadMutation,

  // POST document/profileId/profile/liabilityId/liability/upload
  usePostLiabilityDocumentUploadMutation,

  // POST document/profileId/profile/esign/send
  usePostDocumentEsignMutation,

  // POST document/profileId/profile/liabilityId/liability/esign/send
  usePostLiabilityDocumentEsignMutation
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

  // GET lazy enrollment/profileId/profile
  useLazyGetEnrollmentQuery,

  // POST enrollment/profileId/profile
  usePostEnrollmentCreateMutation,

  // PUT enrollment/profileId/profile
  usePutEnrollmentUpdateMutation,

  // GET enrollment/profileId/profile/payments
  useGetProfilePaymentsQuery,

  // POST enrollment/profileId/profile/payment
  usePostPaymentCreateMutation,

  // PUT enrollment/profileId/profile/payment
  usePutPaymentUpdateMutation,

  // POST enrollment/search
  usePostEnrollmentSearchQuery,

  // POST enrollment/profileId/profile/cancel
  usePostEnrollmentCancelMutation,

  // POST enrollment/profileId/profile/pause
  usePostEnrollmentPauseMutation,

  // POST enrollment/profileId/profile/resume
  usePostEnrollmentResumeMutation,

  // POST enrollment/profileId/preview
  useGetEnrollmentPreviewMutation,

  // PUT enrollment/profileId/profile/payment-method
  usePutEnrollmentPaymentMethodMutation
} = enrollmentApiSlice

// ********************************************************************** GROUP

export const {
  // GET group/groupId/basic
  useGetGroupQuery,

  // GET group/all
  useGetGroupsQuery,

  // POST group
  usePostGroupCreateMutation,

  // PUT group/groupId
  usePutGroupUpdateMutation,

  // DELETE group/groupId
  useDeleteGroupMutation
} = groupApiSlice

// ********************************************** LIABILITY

export const {
  // GET liability/liabilityId/basic
  useGetLiabilityQuery,

  // GET liability/profileId/profile
  useGetProfileLiabilitiesQuery,

  // POST liability/profileId/profile
  usePostLiabilityCreateMutation,

  // POST liability/search
  usePostLiabilitiesSearchQuery,

  // PUT liability/liabilityId
  usePutLiabilityUpdateMutation,

  // PUT liability/enroll
  usePutLiabilitiesEnrollMutation,

  // PUT liability/withdraw
  usePutLiabilitiesWithdrawMutation
} = liabilityApiSlice

// ********************************************** NOTES

export const {
  // GET note/noteId/info
  useGetNoteQuery,

  // GET note/profileId/profile
  useGetProfileNotesQuery,

  // POST note/profileId/profile
  usePostNoteCreateMutation,

  // PUT note/noteId
  usePutNoteUpdateMutation,

  // DELETE note/creditcardId
  useDeleteNoteMutation
} = noteApiSlice

// ********************************************** PROFILE

export const {
  // GET profile/profileId/info
  useGetProfileInfoQuery,

  // POST profile/search
  usePostProfilesSearchQuery,

  // GET profile/profileId/basic
  useGetProfileBasicQuery,

  // GET profile/profileId/status-summary
  useGetProfileStatusQuery,

  // GET profile/quicksearch/keyword
  useGetProfileQuickSearchQuery,

  // GET profile/profileId/labels
  useGetProfileLabelsQuery,

  // POST profile/profileId/labels
  usePostProfileLabelCreateMutation,

  // POST profile/profileId/customField
  usePostProfileCustomFieldCreateMutation,

  // POST profile
  usePostProfileCreateMutation,

  // POST profile/profileId/assign
  usePostProfileAssignMutation,

  // POST profile/export
  usePostProfilesExportMutation,

  // POST profile/profileId/approve
  usePostProfileApproveMutation,

  // POST profile/profileId/enroll
  usePostProfileEnrollMutation,

  // POST profile/profileId/reject
  usePostProfileRejectMutation,

  // POST profile/profileId/submit
  usePostProfileSubmitMutation,

  // POST profile/profileId/disable-auth
  usePostProfileDisableAuthMutation,

  // POST profile/profileId/grant-auth
  usePostProfileGrantAuthMutation,

  // PUT profile/profileId/stage
  usePutProfileStatusUpdateMutation,

  // PUT profile/profileId
  usePutProfileUpdateMutation,

  // PUT profile/profileId/delete
  usePutProfileDeleteMutation
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
  usePutProfileBudgetsUpdateMutation,

  // POST setting/budgets
  usePostBudgetCreateMutation,

  // POST setting/budgets/budgetId/disable
  usePutBudgetDisableMutation,

  // POST setting/budgets/budgetId/enable
  usePutBudgetEnableMutation,

  // POST setting/budgets/budgetId
  usePutBudgetUpdateMutation
} = profileBudgetApiSlice

// ********************************************** ROLES

export const {
  // GET role/roleId/info
  useGetRoleQuery,

  // GET role/all
  useGetRolesQuery,

  // PUT role/roleId
  usePutRoleUpdateMutation,

  // POST role
  usePostRoleCreateMutation,

  // POST role/search
  usePostRoleSearchQuery,

  // POST role/roleId/assign-permissions
  usePostRoleAssignPermissionsMutation,

  // DELETE role/roleId
  useDeleteRoleMutation
} = roleApiSlice

// ********************************************** SETTINGS

export const {
  // GET setting/addresses/addressId/info
  useGetAddressQuery,

  // GET setting/addresses
  useGetAddressesQuery,

  // POST setting/addresses
  usePostAddressCreateMutation,

  // POST setting/addresses/search
  usePostAddressSearchQuery,

  // PUT setting/addresses/addressId
  usePutAddressUpdateMutation,

  // PUT setting/addresses/addressId/enable
  usePutAddressEnableMutation,

  // PUT setting/addresses/addressId/disable
  usePutAddressDisableMutation,

  // GET setting/assignees/assigneeId/info
  useGetAssigneeQuery,

  // GET setting/assignees
  useGetAssigneesQuery,

  // POST setting/assignees
  usePostAssigneeCreateMutation,

  // PUT setting/assignees/assigneeId
  usePutAssigneeUpdateMutation,

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
  usePostContactCreateMutation,

  // PUT setting/contacts/contactId
  usePutContactUpdateMutation,

  // PUT setting/contacts/contactId/enable
  usePutContactEnableMutation,

  // PUT setting/contacts/contactId/disable
  usePutContactDisableMutation,

  // GET setting/customFields/customFieldId/info
  useGetCustomFieldQuery,

  // POST setting/customFields/search
  usePostCustomFieldSearchQuery,

  // POST setting/customFields
  usePostCustomFieldCreateMutation,

  // PUT setting/customFields/customFieldId
  usePutCustomFieldUpdateMutation,

  // PUT setting/customFields/customFieldId/enable
  usePutCustomFieldEnableMutation,

  // PUT setting/customFields/customFieldId/disable
  usePutCustomFieldDisableMutation,

  // GET setting/labels/labelId/info
  useGetLabelQuery,

  // POST setting/labels/search
  usePostLabelSearchQuery,

  // POST setting/labels
  usePostLabelCreateMutation,

  // PUT setting/labels/labelId
  usePutLabelUpdateMutation,

  // PUT setting/labels/labelId/enable
  usePutLabelEnableMutation,

  // PUT setting/labels/labelId/disable
  usePutLabelDisableMutation,

  // GET setting/id/info
  useGetSettingQuery,

  // POST setting/search
  usePostSettingSearchQuery,

  // POST setting
  usePostSettingCreateMutation,

  // PUT setting/id
  usePutSettingUpdateMutation,

  // PUT setting/id/delete
  usePutSettingDeleteMutation
} = settingApiSlice

// ********************************************** TASKS

export const {
  // GET task/taskId/info
  useGetTaskQuery,

  // GET task/profileId/profile
  useGetProfileTasksQuery,

  // PUT task/taskId
  usePutTaskUpdateMutation,

  // PUT task/bulk-update
  usePutTasksBulkUpdateMutation,

  // POST task/profileId/profile
  usePostTaskCreateMutation,

  // POST task/search
  usePostTaskSearchQuery,

  // DELETE task/taskId/
  useDeleteTaskMutation
} = taskApiSlice

// ********************************************** USERS

export const {
  // GET user/userId
  useGetUserQuery,

  // PUT user/userId
  usePutUserUpdateMutation,

  // POST user
  usePostUserCreateMutation,

  // PUT user/userId/disable
  usePutUserDisableMutation,

  // PUT user/userId/enable
  usePutUserEnableMutation,

  // PUT user/userId/roles
  usePutUserRoleUpdateMutation,

  // PUT user/userId/password
  usePutUserPasswordUpdateMutation
} = userApiSlice
