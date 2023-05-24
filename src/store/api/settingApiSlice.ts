import {
  setAddresses,
  setAssignees,
  setContacts,
  setCustomFields,
  setLabels,
  setSettings,
  updateAddresses,
  updateAssignees,
  updateContacts,
  updateCustomFields,
  updateLabels,
  updateSettings
} from '../settingSlice'
import { apiSlice } from './apiSlice'
import { CustomFieldType, ProfileInfoType } from './profileApiSlice'
import { LunaResponseType, SearchFilterType } from './sharedTypes'
import { SingleSelectOption } from 'src/types/forms/selectOptionTypes'

export type AddressSettingType = {
  addressId: string
  name: string
  order: number
  active: boolean
}

export type AssigneeDatasourceType = {
  key: string
  value: string
  parentKey: string
}

export type AddressCreateType = {
  name: string
  order?: number
}

export type AddressUpdateType = {
  addressId: string
  name: string
  order?: number
}

export type AssigneeSettingType = {
  assigneeId: string
  assigneeName: string
  companyName: string
  active: boolean
  description: string
  createdByName: string
  order: number
}

export type AssigneeCreateType = {
  name: string
  filters?: {
    dataSourceType: string
    filters: SearchFilterType
  }
  description?: string
  companyName: string
}

export type AssigneeUpdateType = {
  assigneeId: string
  name: string
  filters?: {
    dataSourceType: string
    filters: SearchFilterType
  }
  description?: string
  companyName: string
}

export type AssigneeInfoType = {
  assigneeId: string
  name: string
  companyName: string
  datasourceFilter: string
  order: number
  description: string
  active: boolean
  filters: SearchFilterType
  dataSource: null
}

export type ContactSettingType = {
  contactId: string
  name: string
  type: number
  typeName: string
  active: boolean
  required: boolean
  order: number
}

export type ContactCreateType = {
  name: string
  type?: number
}

export type ContactUpdateType = {
  contactId: string
  name: string
  type: number
}

export type CustomFieldSettingType = {
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

export type CustomFieldCreateType = {
  fieldName: string
  fieldType: number
  label: string
  defaultValue?: string
  isVisible: boolean
  datasources?: string
  profileCustomFields?: ProfileCustomFieldType
}

export type CustomFieldUpdateType = {
  customFieldId: string
  fieldName: string
  fieldType: number
  label: string
  defaultValue: string
  isVisible: boolean
  datasources?: string
  profileCustomFields?: ProfileCustomFieldType
}

export type ProfileCustomFieldType = {
  profileId: string
  profile: ProfileInfoType
  customFieldId: string
  customField: CustomFieldType
  value: string
}

export type LabelSettingType = {
  labelId: string
  name: string
  type: number
  typeName: string
  active: boolean
  createdByName: string
  order: number
  required: boolean
}

export type LabelCreateType = {
  name: string
  type: string
}

export type LabelUpdateType = {
  labelId: string
  name: string
  type: string
}

export type SettingType = {
  id: string
  name: string
  value: string
  parentValue: string
  order: number
  displayColor: string | null
  type: number
  typeName: string
  sharingTargets: string | null
  additionConfiguration: string | null
  active: boolean
}

export type SettingUpdateType = {
  id: string
  name: string
  value: string
  parentValue?: string
  order?: number
  displayColor?: string | null
  sharingTargets?: string | null
  additionConfiguration?: string | null
}

export type SettingCreateType = {
  name: string
  value: string
  parentValue?: string
  displayColor?: string | null
  type?: number
  sharingTargets?: string | null
  additionConfiguration?: string | null
}

export type SystemSettingListItem = {
  id: string
  name: string
  value: string
  parentValue: string
  sharingTargets: string
  additionConfiguration: string
  order: number
  active: boolean
  createdByName: string
  type: SystemSettingType
}

export enum SystemSettingType {
  DebtEnrollmentValidation,
  ProfileStatus,
  ProfileStage,
  NoteType,
  SystemDebtType,
  CancelReason,
  ProfileStatusValidation,
  IPWhiteListing,
  DocumentType
}

export const settingApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // ************************************ ADDRESS **************************************************************

    // ****************************************************************** GET /setting/addresses/addressId/info
    getAddress: builder.query<AddressSettingType | null, string>({
      query: addressId => ({
        url: `/setting/addresses/${addressId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching address setting',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(settingId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateAddresses([data]))
        } catch (err: any) {
          console.error('API error in getAddress:', err.error.data.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'SETTING-ADDRESS', id: arg }] : []
      }
    }),

    // ****************************************************************** GET /setting/addresses
    getAddresses: builder.query<AddressSettingType[] | null, void>({
      query: () => ({
        url: `/setting/addresses`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching address settings',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setAddresses(data))
        } catch (err: any) {
          console.error('API error in getAddresses:', err.error.data.message)
        }
      },
      providesTags: result => {
        return result
          ? [
              { type: 'SETTING-ADDRESS', id: 'LIST' },
              ...result.map(a => ({ type: 'SETTING-ADDRESS' as const, id: a.addressId }))
            ]
          : []
      }
    }),

    // ****************************************************************** POST /setting/addresses
    postAddressCreate: builder.mutation<boolean, AddressCreateType>({
      query: body => ({
        url: `/setting/addresses`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating address',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.data
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postAddressCreate:', err.error.data.message)
        }
      },
      invalidatesTags: result => {
        return result ? [{ type: 'SETTING-ADDRESS', id: 'LIST' }] : []
      }
    }),

    // ****************************************************************** POST /setting/addresses/search
    postAddressSearch: builder.query<AddressSettingType[] | null, SearchFilterType>({
      query: body => ({
        url: `/setting/addresses/search`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching address settings',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data.data
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setAddresses(data))
        } catch (err: any) {
          console.error('API error in postAddressSearch:', err.error.data.message)
        }
      },
      providesTags: result => {
        return result
          ? [
              { type: 'SETTING-ADDRESS', id: 'LIST' },
              ...result.map(a => ({ type: 'SETTING-ADDRESS' as const, id: a.addressId }))
            ]
          : []
      }
    }),

    // ****************************************************************** PUT /setting/addresses/addressId
    putAddressUpdate: builder.mutation<boolean, AddressUpdateType>({
      query: body => {
        const { addressId } = body

        return {
          url: `/setting/addresses/${addressId}`,
          method: 'PUT',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating address',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putAddressUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'SETTING-ADDRESS', id: arg.addressId }] : []
      }
    }),

    // ****************************************************************** PUT /setting/addresses/addressId/enable
    putAddressEnable: builder.mutation<boolean, string>({
      query: addressId => ({
        url: `/setting/addresses/${addressId}/enable`,
        method: 'PUT'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error enabling address',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putAddressEnable:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING-ADDRESS', id: arg },
              { type: 'SETTING-ADDRESS', id: 'LIST' }
            ]
          : []
      }
    }),

    // ****************************************************************** PUT /setting/addresses/addressId/disable
    putAddressDisable: builder.mutation<boolean, string>({
      query: addressId => ({
        url: `/setting/addresses/${addressId}/disable`,
        method: 'PUT'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error disabling address',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putAddressDisable:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING-ADDRESS', id: arg },
              { type: 'SETTING-ADDRESS', id: 'LIST' }
            ]
          : []
      }
    }),

    // ***************** ASSIGNEE **************************************************************

    // ****************************************************************** GET /setting/assignees/assigneeId/info
    getAssignee: builder.query<AssigneeInfoType | null, string>({
      query: assigneeId => ({
        url: `/setting/assignees/${assigneeId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching assignee information',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(settingId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          if (!data) return

          const { assigneeId, companyName, name, datasourceFilter, order, description, active, filters, dataSource } =
            data

          const res = {
            assigneeId,
            assigneeName: name,
            companyName,
            active,
            description,
            datasourceFilter,
            order,
            filters,
            dataSource
          }
          dispatch(updateAssignees([res]))
        } catch (err: any) {
          console.error('API error in getAssignee:', err.error.data.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING-ASSIGNEE', id: arg },
              { type: 'SETTING-ASSIGNEE', id: 'LIST' }
            ]
          : []
      }
    }),

    // ****************************************************************** GET /setting/assignees
    getAssignees: builder.query<AssigneeSettingType[] | null, void>({
      query: () => ({
        url: `/setting/assignees`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching assignees',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setAssignees(data))
        } catch (err: any) {
          console.error('API error in getAssignees:', err.error.data.message)
        }
      },
      providesTags: result => {
        return result
          ? [
              { type: 'SETTING-ASSIGNEE', id: 'LIST' },
              ...result.map(a => ({ type: 'SETTING-ASSIGNEE' as const, id: a.assigneeId }))
            ]
          : []
      }
    }),

    // ****************************************************************** POST /setting/assignees
    postAssigneeCreate: builder.mutation<boolean, AssigneeCreateType>({
      query: body => ({
        url: `/setting/assignees`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating assignee information',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postAssigneeCreate:', err.error.data.message)
        }
      },
      invalidatesTags: result => {
        return result ? [{ type: 'SETTING-ASSIGNEE', id: 'LIST' }] : []
      }
    }),

    // ****************************************************************** PUT /setting/assignees/assigneeId
    putAssigneeUpdate: builder.mutation<boolean, AssigneeUpdateType>({
      query: body => {
        const { assigneeId } = body

        return {
          url: `/setting/assignees/${assigneeId}`,
          method: 'PUT',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating assignee',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putAssigneeUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'SETTING-ASSIGNEE', id: arg.assigneeId }] : []
      }
    }),

    // ****************************************************************** PUT /setting/assignees/assigneeId/enable
    putAssigneeEnable: builder.mutation<boolean, string>({
      query: assigneeId => ({
        url: `/setting/assignees/${assigneeId}/enable`,
        method: 'PUT'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching role information',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putAssigneeEnable:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING-ASSIGNEE', id: arg },
              { type: 'SETTING-ASSIGNEE', id: 'LIST' }
            ]
          : []
      }
    }),

    // ****************************************************************** PUT /setting/assignees/assigneeId/disable
    putAssigneeDisable: builder.mutation<boolean, string>({
      query: assigneeId => ({
        url: `/setting/assignees/${assigneeId}/disable`,
        method: 'PUT'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching role information',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putAssigneeDisable:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING-ASSIGNEE', id: arg },
              { type: 'SETTING-ASSIGNEE', id: 'LIST' }
            ]
          : []
      }
    }),

    // ****************************************************************** PUT /setting/assignees/datasource
    getAssigneeDatasource: builder.query<SingleSelectOption[] | [], string>({
      query: assigneeId => ({
        url: `/setting/assignees/${assigneeId}/datasource`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching assignee datasource',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return []

        const data: SingleSelectOption[] = res.data.map((entry: AssigneeDatasourceType) => {
          return { value: entry.key, label: entry.value }
        })

        return data
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in getAssigneeDatasource:', err.error.data.message)
        }
      }
    }),

    // ***************** CONTACT **************************************************************

    // ****************************************************************** GET /setting/contact/contactId/info
    getContact: builder.query<ContactSettingType | null, string>({
      query: contactId => ({
        url: `/setting/contacts/${contactId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching contact information',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(contactId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          if (data) dispatch(updateContacts([data]))
        } catch (err: any) {
          console.error('API error in getContact:', err.error.data.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING-CONTACT', id: arg },
              { type: 'SETTING-CONTACT', id: 'LIST' }
            ]
          : []
      }
    }),

    // ****************************************************************** POST /setting/contact/search
    postContactSearch: builder.query<ContactSettingType[] | null, SearchFilterType>({
      query: body => ({
        url: `/setting/contacts/search`,
        method: 'POST',
        body
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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setContacts(data))
        } catch (err: any) {
          console.error('API error in postContactSearch:', err.error.data.message)
        }
      },
      providesTags: result => {
        return result
          ? [
              { type: 'SETTING-CONTACT', id: 'LIST' },
              ...result.map(c => ({ type: 'SETTING-CONTACT' as const, id: c.contactId }))
            ]
          : []
      }
    }),

    // ****************************************************************** POST /setting/contact
    postContactCreate: builder.mutation<boolean, ContactCreateType>({
      query: body => ({
        url: `/setting/contacts`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating contact',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postContactCreate:', err.error.data.message)
        }
      },
      invalidatesTags: result => {
        return result ? [{ type: 'SETTING-CONTACT', id: 'LIST' }] : []
      }
    }),

    // ****************************************************************** PUT /setting/contact/contactId
    putContactUpdate: builder.mutation<boolean, ContactUpdateType>({
      query: body => {
        const { contactId } = body

        return {
          url: `/setting/contacts/${contactId}`,
          method: 'PUT',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating contact',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putContactUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'SETTING-CONTACT', id: arg.contactId }] : []
      }
    }),

    // ****************************************************************** PUT /setting/contact/contactId/enable
    putContactEnable: builder.mutation<boolean, string>({
      query: contactId => ({
        url: `/setting/contacts/${contactId}/enable`,
        method: 'PUT'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error enabling contact',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putContactEnable:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING-CONTACT', id: arg },
              { type: 'SETTING-CONTACT', id: 'LIST' }
            ]
          : []
      }
    }),

    // ****************************************************************** PUT /setting/contact/contactId/disable
    putContactDisable: builder.mutation<boolean, string>({
      query: contactId => ({
        url: `/setting/contacts/${contactId}/disable`,
        method: 'PUT'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error disable contact',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putContactDisable:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING-CONTACT', id: arg },
              { type: 'SETTING-CONTACT', id: 'LIST' }
            ]
          : []
      }
    }),

    // ***************** CUSTOM FIELD **************************************************************

    // ****************************************************************** GET /setting/customFields/customFieldId
    getCustomField: builder.query<CustomFieldSettingType | null, string>({
      query: customFieldId => ({
        url: `/setting/customFields/${customFieldId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching custom field information',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(customFieldId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          if (data) dispatch(updateCustomFields([data]))
        } catch (err: any) {
          console.error('API error in getCustomField:', err.error.data.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING-CUSTOMFIELD', id: arg },
              { type: 'SETTING-CUSTOMFIELD', id: 'LIST' }
            ]
          : []
      }
    }),

    // ****************************************************************** POST /setting/customFields/search
    postCustomFieldSearch: builder.query<CustomFieldSettingType[] | null, SearchFilterType>({
      query: body => ({
        url: `/setting/customFields/search`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching custom fields',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data.data
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setCustomFields(data))
        } catch (err: any) {
          console.error('API error in postCustomFieldSearch:', err.error.data.message)
        }
      },
      providesTags: result => {
        return result
          ? [
              { type: 'SETTING-CUSTOMFIELD', id: 'LIST' },
              ...result.map(c => ({ type: 'SETTING-CUSTOMFIELD' as const, id: c.customFieldId }))
            ]
          : []
      }
    }),

    // ****************************************************************** POST /setting/customFields
    postCustomFieldCreate: builder.mutation<boolean, CustomFieldCreateType>({
      query: body => ({
        url: `/setting/customFields`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating custom field',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postCustomFieldCreate:', err.error.data.message)
        }
      },
      invalidatesTags: result => {
        return result ? [{ type: 'SETTING-CUSTOMFIELD', id: 'LIST' }] : []
      }
    }),

    // ****************************************************************** PUT /setting/customFields/customFieldId
    putCustomFieldUpdate: builder.mutation<boolean, CustomFieldUpdateType>({
      query: body => {
        const { customFieldId } = body

        return {
          url: `/setting/customFields/${customFieldId}`,
          method: 'PUT',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating custom field',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putCustomFieldUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'SETTING-CUSTOMFIELD', id: arg.customFieldId }] : []
      }
    }),

    // ****************************************************************** PUT /setting/customFields/customFieldId/enable
    putCustomFieldEnable: builder.mutation<boolean, string>({
      query: customFieldId => ({
        url: `/setting/customFields/${customFieldId}/enable`,
        method: 'PUT'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error enabling custom field',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putCustomFieldEnable:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING-CUSTOMFIELD', id: arg },
              { type: 'SETTING-CUSTOMFIELD', id: 'LIST' }
            ]
          : []
      }
    }),

    // ****************************************************************** PUT /setting/customFields/customFieldId/disable
    putCustomFieldDisable: builder.mutation<boolean, string>({
      query: customFieldId => ({
        url: `/setting/customFields/${customFieldId}/disable`,
        method: 'PUT'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching role information',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putCustomFieldDisable:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING-CUSTOMFIELD', id: arg },
              { type: 'SETTING-CUSTOMFIELD', id: 'LIST' }
            ]
          : []
      }
    }),

    // ***************** LABEL **************************************************************

    // ****************************************************************** GET /setting/labels/labelId/info
    getLabel: builder.query<LabelSettingType | null, string>({
      query: labelId => ({
        url: `/setting/labels/${labelId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching label information',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(labelId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateLabels([data]))
        } catch (err: any) {
          console.error('API error in getLabel:', err.error.data.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING-LABEL', id: arg },
              { type: 'SETTING-LABEL', id: 'LIST' }
            ]
          : []
      }
    }),

    // ****************************************************************** POST /setting/labels/search
    postLabelSearch: builder.query<LabelSettingType[] | null, SearchFilterType>({
      query: body => ({
        url: `/setting/labels/search`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching labels',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data.data
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setLabels(data))
        } catch (err: any) {
          console.error('API error in postLabelSearch:', err.error.data.message)
        }
      },
      providesTags: result => {
        return result
          ? [
              { type: 'SETTING-LABEL', id: 'LIST' },
              ...result.map(c => ({ type: 'SETTING-LABEL' as const, id: c.labelId }))
            ]
          : []
      }
    }),

    // ****************************************************************** POST /setting/labels
    postLabelCreate: builder.mutation<boolean, LabelCreateType>({
      query: body => ({
        url: `/setting/labels`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating label',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postLabelCreate:', err.error.data.message)
        }
      },
      invalidatesTags: result => {
        return result ? [{ type: 'SETTING-LABEL', id: 'LIST' }] : []
      }
    }),

    // ****************************************************************** PUT /setting/labels/labelId
    putLabelUpdate: builder.mutation<boolean, LabelUpdateType>({
      query: body => {
        const { labelId } = body

        return {
          url: `/setting/labels/${labelId}`,
          method: 'PUT',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating label',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putLabelUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'SETTING-LABEL', id: arg.labelId }] : []
      }
    }),

    // ****************************************************************** PUT /setting/labels/labelId/enable
    putLabelEnable: builder.mutation<boolean, string>({
      query: labelId => ({
        url: `/setting/labels/${labelId}/enable`,
        method: 'PUT'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching enabling label',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in putLabelEnable:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING-LABEL', id: arg },
              { type: 'SETTING-LABEL', id: 'LIST' }
            ]
          : []
      }
    }),

    // ****************************************************************** PUT /setting/labels/labelId/disable
    putLabelDisable: builder.mutation<boolean, string>({
      query: labelId => ({
        url: `/setting/labels/${labelId}/disable`,
        method: 'PUT'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error disabling label',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in getRole:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING-LABEL', id: arg },
              { type: 'SETTING-LABEL', id: 'LIST' }
            ]
          : []
      }
    }),

    // ***************** SETTING **************************************************************

    // ****************************************************************** GET /setting/settingId/info
    getSetting: builder.query<SettingType | null, string>({
      query: id => ({
        url: `/setting/${id}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching setting information',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          if (data) dispatch(updateSettings([data]))
        } catch (err: any) {
          console.error('API error in getSetting:', err.error.data.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING', id: arg },
              { type: 'SETTING', id: 'LIST' }
            ]
          : []
      }
    }),

    // ****************************************************************** POST /setting/search
    postSettingSearch: builder.query<SettingType[] | null, SearchFilterType | {}>({
      query: body => ({
        url: `/setting/search`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching settings',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data.data
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setSettings(data))
        } catch (err: any) {
          console.error('API error in postSettingSearch:', err.error.data.message)
        }
      },
      providesTags: result => {
        return result
          ? [{ type: 'SETTING', id: 'LIST' }, ...result.map(s => ({ type: 'SETTING' as const, id: s.id }))]
          : []
      }
    }),

    // ****************************************************************** POST /setting
    postSettingCreate: builder.mutation<boolean, SettingCreateType>({
      query: body => ({
        url: `/setting`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating setting',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postSettingCreate:', err.error.data.message)
        }
      },
      invalidatesTags: result => {
        return result ? [{ type: 'SETTING', id: 'LIST' }] : []
      }
    }),

    // ****************************************************************** PUT /setting/settingId
    putSettingUpdate: builder.mutation<boolean, SettingUpdateType>({
      query: params => {
        const { id, ...body } = params

        return {
          url: `/setting/${id}`,
          method: 'PUT',
          body
        }
      },

      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating setting',
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
          console.error('API error in putSettingUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result ? [{ type: 'SETTING', id: arg.id }] : []
      }
    }),

    // ****************************************************************** DELETE /setting/settingId
    putSettingDelete: builder.mutation<boolean, string>({
      query: id => ({
        url: `/setting/${id}`,
        method: 'DELETE'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error deleting setting',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(id, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in getRole:', err.error.data.message)
        }
      },
      invalidatesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'SETTING', id: arg },
              { type: 'SETTING', id: 'LIST' }
            ]
          : []
      }
    })
  })
})
