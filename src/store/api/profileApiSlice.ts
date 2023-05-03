import { addProfile, deleteProfile, updateProfiles, updateStatus } from '../profileSlice'
import SolApi from './SolApi'
import { apiSlice } from './apiSlice'

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

  stage: string
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
  profileCustomField: ProfileCustomFieldType[]
  profileLabels: ProfileLabelsType[]

  lastStageStatusModifiedDate: string
  timeInStatus: number
}

export type ProfileLabelsType = {
  profileId: string
  labelId: string
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

export type ProfileCreateType = {
  profileId: string
  firstName: string
  lastName: string
  middleName?: string
  gender: number
  birthdate?: string
  ssn?: string
  parentProfileId?: string
  campaignId?: string
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
  contactType: string
  contactTypeName: string
  value: string
}

export type ProfileCustomFieldType = {
  profileId: string
  contactId: string
  contactName: string
  order: number
  contactType: string
  contactTypeName: string
  value: string
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
    // PROFILE SEARCH
    getProfiles: builder.query<ProfileInfoType[], Record<string, any>>({
      query: searchParams => ({
        url: `/profile/search`,
        method: 'POST',
        body: searchParams
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching profiles')

        return res.data.data
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(updateProfiles(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: result => {
        return result ? [{ type: 'PROFILE', id: 'LIST' }] : []
      }
    }),

    // GET PROFILE INFO
    getProfileInfo: builder.query<ProfileInfoType, string>({
      query: profileId => ({
        url: `/profile/${profileId}/info`,
        method: 'GET'
      }),
      transformResponse: async (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching profile')

        return res.data
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(updateProfiles([data]))
        } catch (err) {
          // ********************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
          // Re-throw the error to make sure isError becomes true
          throw err
        }
      },
      providesTags: result => {
        return result ? [{ type: 'PROFILE', id: result.profileId }] : []
      }
    }),

    // GET PROFILE BASIC
    getProfileBasic: builder.query<ProfileBasicType, string>({
      query: profileId => ({
        url: `/profile/${profileId}/basic`,
        method: 'GET'
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching profile')

        return res.data
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(updateProfiles([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    }),

    // GET PROFILE STATUS
    getProfileStatus: builder.query<ProfileStatusType, string>({
      query: profileId => ({
        url: `/profile/${profileId}/status-summary`,
        method: 'GET'
      }),
      transformResponse: (res: Record<string, any>, meta, arg) => {
        if (!res.success) throw new Error('There was an error fetching profile')

        const newStatus = { ...res.data, profileId: arg }

        console.log(res, newStatus)

        return newStatus
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(updateStatus([data]))
          dispatch(updateProfiles([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: result => {
        return result ? [{ type: 'PROFILE-STATUS', id: result.profileId }] : []
      }
    }),

    // PROFILE QUICKSEARCH
    profileQuickSearch: builder.query<ProfileStatusType[], string>({
      query: keyword => ({
        url: `/profile/quicksearch/${keyword}`,
        method: 'GET'
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching profileS')

        return res.data
      }
    }),

    // POST CREATE PROFILE
    createProfile: builder.mutation<ProfileBasicType, ProfileCreateType>({
      query: body => ({
        url: `/profile`,
        method: 'POST',
        body
      }),
      transformResponse: async (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error creating profile')

        const newUserRes = await SolApi.GetProfile(res.data)
        if (!newUserRes.success) throw new Error('There was an error fetching profiles')

        return newUserRes.data as ProfileBasicType
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(addProfile(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res => {
        return res ? [{ type: 'PROFILE', id: 'LIST' }] : []
      }
    }),

    // POST ASSIGN PROFILE
    assignProfile: builder.mutation<ProfileAssigneeCreateType, ProfileAssigneeCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/profile/${profileId}/assign`,
          method: 'POST',
          body
        }
      },
      transformResponse: async (res: Record<string, any>, meta, arg) => {
        if (!res.success) throw new Error('There was an error assigning profile')

        return arg
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (result, error, arg) => (result ? [{ type: 'PROFILE', id: arg.profileId }] : [])
    }),

    // POST PROFILE CUSTOM FIELD
    createProfileCustomField: builder.mutation<ProfileCustomFieldCreateType, ProfileCustomFieldCreateType>({
      query: params => {
        const { profileId, ...customFields } = params

        return {
          url: `/profile/${profileId}/customField`,
          method: 'POST',
          body: customFields
        }
      },
      transformResponse: async (res: Record<string, any>, meta, arg) => {
        if (!res.success) throw new Error('There was an error adding custom field to profile')

        return arg
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (result, error, arg) => (result ? [{ type: 'PROFILE', id: arg.profileId }] : [])
    }),

    // POST PROFILE SUBMIT
    postProfileSubmit: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/profile/${profileId}/submit`,
          method: 'POST'
        }
      },
      transformResponse: async (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating profile status')

        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (result, err, arg) =>
        result
          ? [
              { type: 'PROFILE-STATUS', id: arg },
              { type: 'PROFILE', id: arg }
            ]
          : []
    }),

    // POST PROFILE APPROVE
    postProfileApprove: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/profile/${profileId}/approve`,
          method: 'POST'
        }
      },
      transformResponse: async (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating profile status')

        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (result, err, arg) => [{ type: 'PROFILE-STATUS', id: arg }]
    }),

    // POST PROFILE REJECT
    postProfileReject: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/profile/${profileId}/reject`,
          method: 'POST'
        }
      },
      transformResponse: async (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating profile status')

        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (result, err, arg) =>
        result
          ? [
              { type: 'PROFILE-STATUS', id: arg },
              { type: 'PROFILE', id: arg }
            ]
          : []
    }),

    // POST PROFILE ENROLL
    postProfileEnroll: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/profile/${profileId}/enroll`,
          method: 'POST'
        }
      },
      transformResponse: async (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating profile status')

        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (result, err, arg) => [{ type: 'PROFILE-STATUS', id: arg }]
    }),

    // POST PROFILE GRANT AUTH
    profileGrantAuth: builder.mutation<boolean, ProfileGrantAuthCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/profile/${profileId}/grant-auth`,
          method: 'POST',
          body
        }
      },
      transformResponse: async (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating profile authentication')

        return res.success
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        const { profileId } = params
        try {
          await queryFulfilled
          dispatch(updateProfiles([{ profileId, hasAuthentication: true }]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    }),

    // POST DISABLE GRANT AUTH
    profileDisableAuth: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/profile/${profileId}/disable-auth`,
          method: 'POST'
        }
      },
      transformResponse: async (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating profile authentication')

        return res.success
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(updateProfiles([{ profileId, hasAuthentication: true }]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    }),

    // PUT UPDATE PROFILE STAGE/STATUS
    putUpdateProfileStatus: builder.mutation<boolean, ProfileStatusUpdateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/profile/${profileId}/stage`,
          method: 'PUT',
          body
        }
      },
      transformResponse: async (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating profile status')

        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
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

    // PUT UPDATE PROFILE
    putUpdateProfile: builder.mutation<boolean, ProfileCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/profile/${profileId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: async (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating profile')

        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'PROFILE', id: arg.profileId }] : []
      }
    }),

    // PUT DELETE PROFILE
    putDeleteProfile: builder.mutation<boolean, string>({
      query: profileId => {
        return {
          url: `/profile/${profileId}/delete`,
          method: 'PUT'
        }
      },
      transformResponse: async (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error deleting profile')

        return res.success
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(deleteProfile(profileId))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    }),

    // POST EXPORT PROFILE
    postExportProfiles: builder.mutation<Promise<Blob>, Record<string, any>>({
      query: body => {
        return {
          url: `/profile/export`,
          method: 'POST',
          body,
          responseHandler: res => res.blob()
        }
      },
      transformResponse: (res: Promise<Blob>) => {
        return res
      }
    }),

    // GET PROFILE LABELS
    getProfileLabels: builder.query<ProfileLabelType[], string>({
      query: profileId => {
        return {
          url: `/profile/${profileId}/labels`,
          method: 'GET'
        }
      },
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching profile labels')

        return res.data
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const newLabels = {
            profileId,
            profileLabels: data
          }

          console.log(newLabels)

          dispatch(updateProfiles([newLabels]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (res, meta, arg) => (res ? [{ type: 'PROFILE-LABEL', id: arg }] : [])
    }),

    // POST CREATE PROFILE LABELS
    postProfileLabels: builder.mutation<boolean, ProfileLabelCreateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/profile/${profileId}/labels`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching profile labels')

        return res.success
      },
      async onQueryStarted(profileId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'PROFILE-LABEL', id: arg.profileId }] : [])
    })
  })
})
