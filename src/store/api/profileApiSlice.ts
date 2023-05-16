import { updateProfiles, updateStatus } from '../profileSlice'
import SolApi from './SolApi'
import { apiSlice } from './apiSlice'
import { LunaResponseType, SearchFilterType } from './sharedTypes'

export type ProfileInfoType = {
  profileId: string
  firstName: string
  lastName: string
  middleName: string
  gender: number
  genderName: string
  birthdate: string
  ssn: string

  status: number
  statusName: string

  stage: number
  stageName: string
  stageStatus: string
  stageStatusName: string
  createdBy: string
  createdByName: string
  createdAt: string
  createdCompany: string
  createdCompanyName: string
  campaignId: string
  campaignName: string
  submittedDate: string
  enrolledDate: string
  cancelledDate: string
  firstPaymentDate: string
  firstPaymentClearedDate: string
  firstPaymentAmount: string
  firstPaymentClearedAmount: string
  lastPaymentAmount: string
  lastPaymentStatus: string
  lastPaymentStatusName: string

  profileContacts: ProfileContactType[]
  profileAddresses: ProfileAddressType[]
  profileAssignees: ProfileAssigneeType[]
  profileCustomFields: ProfileCustomFieldType[]
  profileLabels: ProfileLabelsType[]

  lastStageStatusModifiedDate: string
  timeInStatus: number
}

export type ProfileLabelsType = {
  labelId: string
  name: string
  order: number
  profileId: string
  required: boolean
  type: number
  typeName: string
  value: string
}

export type ProfileStatusUpdateType = {
  profileId: string
  status: string
  stageStatus: string
}

export type ProfileContactCreateType = {
  contactId: string
  value: string
}

export type ProfileLabelCreateType = {
  profileId: string
  labelIds: string[]
}

export type ProfileAddressCreateType = {
  addressId: string
  address1: string
  address2: string
  city: string
  state: string
  zipCode: string
}

export type ProfileAssigneeCreateType = {
  profileId?: string
  assigneeId: string
  employeeId: string
}

export type ProfileGrantAuthCreateType = {
  profileId: string
  password: string
}

export type ProfileCustomFieldCreateType = {
  profileId?: string
  customFieldId: string
  value: string
}

export type AddressType = {
  addressId: string
  name: string
  order: number
  active: boolean
  createdByName: string
}

export type ProfileCreateType = {
  firstName: string
  lastName: string
  middleName?: string
  gender: number
  birthdate?: string
  ssn?: string
  parentProfileId?: string
  campaignId: string
  profileContacts?: ProfileContactCreateType[]
  profileAddresses?: ProfileAddressCreateType[]
  profileAssignees?: ProfileAssigneeCreateType[]
  profileCustomFields?: ProfileCustomFieldCreateType[]
  stage?: string
  stageStatus?: string
  enrolledDate?: string
  submittedDate?: string
  approvedDate?: string
  pausedDate?: string
  cancelledDate?: string
}

type ProfileUpdateType = {
  profileId: string
  firstName: string
  lastName: string
  middleName?: string
  gender: number
  birthdate?: string
  ssn?: string
  parentProfileId?: string
  campaignId: string
  profileContacts?: ProfileContactCreateType[]
  profileAddresses?: ProfileAddressCreateType[]
  profileCustomFields?: ProfileCustomFieldCreateType[]
}

export type ProfileStatusSummaryType = {
  profileId: string
  summary: ProfileStatusType[]
}

export type ProfileStatusType = {
  profileId: string
  stageStatus: string
  stage: string
  status: string
  from: string
  to: string
  daysInStatus: number
}

export type ProfileAssigneeType = {
  profileId: string
  assigneeId: string
  assigneeName: string
  assigneeCompanyLabel: string
  employeeId: string
  employeeName: string
  employeeAlias: string
  companyId: string
  companyName: string
  order: number
}

export type ProfileAddressType = {
  profileId: string
  addressId: string
  addressName: string
  order: number
  address1: string
  address2: string
  city: string
  state: string
  zipCode: string
}

export type ProfileLabelType = {
  profileId: string
  labelId: string
  value: string
}

export type ProfileContactType = {
  profileId: string
  contactId: string
  contactName: string
  order: number
  contactType: number
  contactTypeName: string
  value: string
}

export type ContactType = {
  contactId: string
  name: string
  type: number
  typeName: string
  active: boolean
  createdByName: string
  order: number
  required: boolean
}

export type ProfileCustomFieldType = {
  profileId: string
  customFieldId: string
  fieldName: string
  fieldType: number
  fieldTypeName: string
  label: string
  defaultValue: string
  isVisible: boolean
  dataSources: string
  fieldGroup: string
  order: number
  value: string
}

export type CustomFieldType = {
  customFieldId: string
  fieldName: string
  fieldType: number
  fieldTypeName: string
  label: string
  defaultValue: string
  isVisible: boolean
  dataSources: string
  active: boolean
  createdByName: string
  fieldGroup: string
  order: number
}

export type LabelType = {
  labelId: string
  name: string
  type: number
  typeName: string
  active: boolean
  createdByName: string
  order: number
  required: boolean
}

export type ProfileBasicType = {
  profileId: string
  firstName: string
  lastName: string
  middleName: string
  gender: string
  genderName: string
  birthdate: string
  ssn: string
  status: string
  statusName: string
  stage: string
  stageName: string
  stageStatus: string
  stageStatusName: string
}

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // ****************************************************************** POST profile/search
    postProfilesSearch: builder.query<ProfileInfoType[] | null, SearchFilterType>({
      query: searchParams => ({
        url: `/profile/search`,
        method: 'POST',
        body: searchParams
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching contacts',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data.data
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateProfiles(data))
        } catch (err: any) {
          console.error('API error in postProfilesSearch:', err.error.data.message)
        }
      },
      providesTags: result => {
        return result
          ? [{ type: 'PROFILE', id: 'LIST' }, ...result.map(p => ({ type: 'PROFILE' as const, id: p.profileId }))]
          : []
      }
    }),

    // ***************************************************** GET profile/profileId/info
    getProfileInfo: builder.query<ProfileInfoType | null, string>({
      query: profileId => ({
        url: `/profile/${profileId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching profile',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        if (!res.success) return null

        const profileInfo: ProfileInfoType = { ...res.data }

        // GET ASSIGNEES
        const systemAssignees: ProfileAssigneeType[] = await SolApi.GetAssignees()
        const profileAssignees = systemAssignees.map(assignee => {
          const { assigneeId, assigneeName, companyName, order } = assignee

          const profileAssignee = profileInfo.profileAssignees.find(ass => ass.assigneeId === assignee.assigneeId)

          let result = {
            profileId: profileInfo.profileId,
            assigneeId,
            assigneeName,
            assigneeCompanyLabel: companyName,
            employeeId: 'N/A',
            employeeName: 'N/A',
            employeeAlias: 'N/A',
            companyId: 'N/A',
            companyName: 'N/A',
            order
          }

          if (profileAssignee) result = { ...result, ...profileAssignee }

          return result
        })

        profileInfo.profileAssignees = profileAssignees

        // GET ADDRESSES
        const systemAddresses: AddressType[] = await SolApi.GetAddresses()
        const profileAddresses = systemAddresses.map(address => {
          const { addressId, name, order } = address

          const profileAddress = profileInfo.profileAddresses.find(add => add.addressId === address.addressId)

          let result = {
            profileId: profileInfo.profileId,
            addressId,
            addressName: name,
            address1: 'N/A',
            address2: 'N/A',
            city: 'N/A',
            state: 'N/A',
            zipCode: 'N/A',
            order
          }

          if (profileAddress) result = { ...result, ...profileAddress }

          return result
        })

        profileInfo.profileAddresses = profileAddresses

        // GET CONTACTS
        const systemContacts: ContactType[] = await SolApi.GetContacts()
        const profileContacts = systemContacts.map(contact => {
          const { contactId, name, order, type, typeName } = contact

          const profileContact = profileInfo.profileContacts.find(con => con.contactId === contact.contactId)

          let result = {
            profileId: profileInfo.profileId,
            contactId,
            contactName: name,
            contactType: type,
            contactTypeName: typeName,
            value: 'N/A',
            order
          }

          if (profileContact) result = { ...result, ...profileContact }

          return result
        })

        profileInfo.profileContacts = profileContacts

        // GET CUSTOM FIELDS
        const systemCustomFields: CustomFieldType[] = await SolApi.GetCustomFields()
        const profileCustomFields = systemCustomFields.map(customField => {
          const {
            isVisible,
            customFieldId,
            fieldName,
            fieldTypeName,
            fieldType,
            label,
            defaultValue,
            dataSources,
            fieldGroup,
            order
          } = customField

          const profileCustomField = profileInfo.profileCustomFields.find(
            cf => cf.customFieldId === customField.customFieldId
          )

          let result = {
            profileId: profileInfo.profileId,
            customFieldId,
            fieldName,
            fieldType,
            fieldTypeName,
            label,
            defaultValue,
            isVisible,
            dataSources,
            fieldGroup,
            order,
            value: 'N/A'
          }

          if (profileCustomField) result = { ...result, ...profileCustomField }

          return result
        })

        profileInfo.profileCustomFields = profileCustomFields

        // GET LABELS
        const systemLabels: LabelType[] = await SolApi.GetLabels()
        const profileLabels = systemLabels.map(label => {
          const { labelId, name, type, typeName, required, order } = label

          const profileLabel = profileInfo.profileLabels.find(label => label.labelId === label.labelId)

          let result = {
            profileId: profileInfo.profileId,
            labelId,
            name,
            type,
            typeName,
            required,
            order,
            value: 'N/A'
          }

          if (profileLabel) result = { ...result, ...profileLabel }

          return result
        })

        profileInfo.profileLabels = profileLabels

        return profileInfo
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateProfiles([data]))
        } catch (err: any) {
          console.error('API error in getProfileInfo:', err.error.data.message)
        }
      },
      providesTags: result => {
        return result ? [{ type: 'PROFILE', id: result.profileId }] : []
      }
    }),

    // ***************************************************** GET profile/profileId/basic
    getProfileBasic: builder.query<ProfileBasicType | null, string>({
      query: profileId => ({
        url: `/profile/${profileId}/basic`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching profile',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateProfiles([data]))
        } catch (err: any) {
          console.error('API error in getProfileBasic:', err.error.data.message)
        }
      }
    }),

    // ***************************************************** GET profile/profileId/status-summary
    getProfileStatus: builder.query<ProfileStatusSummaryType | null, string>({
      query: profileId => ({
        url: `/profile/${profileId}/status-summary`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching profile status summary',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) null

        const newStatus = { summary: res.data, profileId: arg }

        console.log(res, newStatus)

        return newStatus
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateStatus([data]))
        } catch (err: any) {
          console.error('API error in getProfileStatus:', err.error.data.message)
        }
      },
      providesTags: result => {
        return result ? [{ type: 'PROFILE-STATUS', id: result.profileId }] : []
      }
    }),

    // ***************************************************** GET profile/quicksearch/keyword
    getProfileQuickSearch: builder.query<ProfileStatusType[], string>({
      query: keyword => ({
        url: `/profile/quicksearch/${keyword}`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error using search contacts',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.data
      }
    }),

    // ***************************************************** POST profile
    postProfileCreate: builder.mutation<boolean, ProfileCreateType>({
      query: body => ({
        url: `/profile`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating profile',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postProfileCreate:', err.error.data.message)
        }
      },
      invalidatesTags: res => {
        return res ? [{ type: 'PROFILE', id: 'LIST' }] : []
      }
    }),

    // ***************************************************** POST profile/profileId/assign
    postProfileAssign: builder.mutation<boolean, ProfileAssigneeCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/profile/${profileId}/assign`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error assigning profile',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postProfileAssign:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => (result ? [{ type: 'PROFILE', id: arg.profileId }] : [])
    }),

    // ***************************************************** POST profile/profileId/customField
    postProfileCustomFieldCreate: builder.mutation<boolean, ProfileCustomFieldCreateType>({
      query: params => {
        const { profileId, ...customFields } = params

        return {
          url: `/profile/${profileId}/customField`,
          method: 'POST',
          body: customFields
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error posting custom field',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postProfileCustomFieldCreate:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => (result ? [{ type: 'PROFILE', id: arg.profileId }] : [])
    }),

    // ***************************************************** POST profile/profileId/submit
    postProfileSubmit: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/profile/${profileId}/submit`,
          method: 'POST'
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error submitting profile',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postProfileSubmit:', err.error.data.message)
        }
      },
      invalidatesTags: (result, err, arg) => (result ? [{ type: 'PROFILE', id: arg }] : [])
    }),

    // ***************************************************** POST profile/profileId/approve
    postProfileApprove: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/profile/${profileId}/approve`,
          method: 'POST'
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error approving profile',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postProfileApprove:', err.error.data.message)
        }
      },
      invalidatesTags: (result, err, arg) => (result ? [{ type: 'PROFILE', id: arg }] : [])
    }),

    // ***************************************************** POST profile/profileId/reject
    postProfileReject: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/profile/${profileId}/reject`,
          method: 'POST'
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error rejecting profile',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postProfileReject:', err.error.data.message)
        }
      },
      invalidatesTags: (result, err, arg) => (result ? [{ type: 'PROFILE', id: arg }] : [])
    }),

    // ***************************************************** POST profile/profileId/enroll
    postProfileEnroll: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/profile/${profileId}/enroll`,
          method: 'POST'
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error enrolling profile',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postProfileEnroll:', err.error.data.message)
        }
      },
      invalidatesTags: (result, err, arg) => [
        { type: 'PROFILE', id: arg },
        { type: 'ENROLLMENT', id: arg },
        { type: 'ENROLLMENT-PAYMENT', id: arg }
      ]
    }),

    // ***************************************************** POST profile/profileId/grant-auth
    postProfileGrantAuth: builder.mutation<boolean, ProfileGrantAuthCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/profile/${profileId}/grant-auth`,
          method: 'POST',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error granting profile auth',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postProfileGrantAuth:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'PROFILE', id: arg.profileId }] : [])
    }),

    // ***************************************************** POST profile/profileId/disable-auth
    postProfileDisableAuth: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/profile/${profileId}/disable-auth`,
          method: 'POST'
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error disabling profile',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(profileId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postProfileDisableAuth:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'PROFILE', id: arg }] : [])
    }),

    // ***************************************************** PUT profile/profileId/stage
    putProfileStatusUpdate: builder.mutation<boolean, ProfileStatusUpdateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/profile/${profileId}/stage`,
          method: 'PUT',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating profile status',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putProfileStatusUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'PROFILE-STATUS', id: arg.profileId },
              { type: 'PROFILE', id: arg.profileId }
            ]
          : []
      }
    }),

    // ***************************************************** PUT profile/profileId
    putProfileUpdate: builder.mutation<boolean, ProfileUpdateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/profile/${profileId}`,
          method: 'PUT',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating profile',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putProfileUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'PROFILE', id: arg.profileId }] : []
      }
    }),

    // ***************************************************** PUT profile/profileId/delete
    putProfileDelete: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/profile/${profileId}/delete`,
          method: 'PUT'
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error deleting profile',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: async (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(profileId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putProfileDelete:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'PROFILE', id: arg }] : [])
    }),

    // ***************************************************** POST profile/export
    postProfilesExport: builder.mutation<Promise<Blob>, SearchFilterType>({
      query: body => {
        return {
          url: `/profile/export`,
          method: 'POST',
          body,
          responseHandler: res => res.blob()
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error exporting profiles',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: Promise<Blob>) => {
        return res
      }
    }),

    // ***************************************************** GET profile/profileId/labels
    getProfileLabels: builder.query<ProfileLabelType[] | null, string>({
      query: profileId => {
        return {
          url: `/profile/${profileId}/labels`,
          method: 'GET'
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching profile labels',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) {
            const newLabels = {
              profileId,
              profileLabels: data
            }
            dispatch(updateProfiles([newLabels]))
          }
        } catch (err: any) {
          console.error('API error in getProfileLabels:', err.error.data.message)
        }
      },
      providesTags: (res, meta, arg) =>
        res
          ? [
              { type: 'PROFILE', id: arg },
              { type: 'PROFILE-LABEL', id: arg }
            ]
          : []
    }),

    // ***************************************************** POST profile/profileId/labels
    postProfileLabelCreate: builder.mutation<boolean, ProfileLabelCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/profile/${profileId}/labels`,
          method: 'POST',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating profile label',
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
          console.error('API error in postProfileLabelCreate:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) =>
        res
          ? [
              { type: 'PROFILE', id: arg.profileId },
              { type: 'PROFILE-LABEL', id: arg.profileId }
            ]
          : []
    })
  })
})
