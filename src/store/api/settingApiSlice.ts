import { setAddresses, setAssignees, updateAddresses, updateAssignees } from '../settingSlice'
import { apiSlice } from './apiSlice'

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
  addressId?: string
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

export type SearchFilterColumnsType = {
  index: number
  displayName: string
  columnName: string
  search: {
    value: string
    operator: string
  }
}

export type SearchFilterOrderType = {
  columnName: string
  direction: string
}

export type SearchFilterType = {
  start?: number
  length?: number
  columns?: SearchFilterColumnsType[]
  order?: SearchFilterOrderType[]
  columnsExport: string
}

export type AssigneeCreateType = {
  assigneeId?: string
  name: string
  filters: {
    dataSourceType: string
    filters: SearchFilterType
  }
  description: string
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

export const settingApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // ***************** ADDRESS **************************************************************

    getAddress: builder.query<AddressSettingType, string>({
      query: addressId => ({
        url: `/setting/addresses/${addressId}/info`,
        method: 'GET'
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching setting')

        return res.data
      },
      async onQueryStarted(settingId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          console.log(data)

          dispatch(updateAddresses([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING
          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'SETTING-ADDRESS', id: arg }] : []
      }
    }),

    getAddresses: builder.query<AddressSettingType[], undefined>({
      query: () => ({
        url: `/setting/addresses`,
        method: 'GET'
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching address setting')

        return res.data
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          console.log(data)

          dispatch(setAddresses(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING
          console.log(err)
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

    postAddress: builder.mutation<string, AddressCreateType>({
      query: body => ({
        url: `/setting/addresses`,
        method: 'POST',
        body
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error creating address setting')

        return res.data
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
      invalidatesTags: result => {
        return result ? [{ type: 'SETTING-ADDRESS', id: 'LIST' }] : []
      }
    }),

    postAddressSearch: builder.query<AddressSettingType[], Record<string, any>>({
      query: body => ({
        url: `/setting/addresses/search`,
        method: 'POST',
        body
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching address setting')

        return res.data.data
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setAddresses(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING
          console.log(err)
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

    putAddress: builder.mutation<boolean, Record<string, any>>({
      query: body => {
        const { addressId } = body

        return {
          url: `/setting/addresses/${addressId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating address setting')

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
        return result ? [{ type: 'SETTING-ADDRESS', id: arg.addressId }] : []
      }
    }),

    putAddressEnable: builder.mutation<string, string>({
      query: addressId => ({
        url: `/setting/addresses/${addressId}/enable`,
        method: 'PUT'
      }),
      transformResponse: (res: Record<string, any>, meta, arg) => {
        if (!res.success) throw new Error('There was an error enabling address setting')

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
      invalidatesTags: result => {
        return result
          ? [
              { type: 'SETTING-ADDRESS', id: result },
              { type: 'SETTING-ADDRESS', id: 'LIST' }
            ]
          : []
      }
    }),

    putAddressDisable: builder.mutation<string, string>({
      query: addressId => ({
        url: `/setting/addresses/${addressId}/disable`,
        method: 'PUT'
      }),
      transformResponse: (res: Record<string, any>, meta, arg) => {
        if (!res.success) throw new Error('There was an error disabling address setting')

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
      invalidatesTags: result => {
        return result
          ? [
              { type: 'SETTING-ADDRESS', id: result },
              { type: 'SETTING-ADDRESS', id: 'LIST' }
            ]
          : []
      }
    }),

    // ***************** ASSIGNEE **************************************************************

    getAssignee: builder.query<AssigneeInfoType, string>({
      query: assigneeId => ({
        url: `/setting/assignees/${assigneeId}/info`,
        method: 'GET'
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching assignee setting')

        return res.data
      },
      async onQueryStarted(settingId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

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

          console.log(res)

          dispatch(updateAssignees([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING
          console.log(err)
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

    getAssignees: builder.query<AssigneeSettingType[], undefined>({
      query: () => ({
        url: `/setting/assignees`,
        method: 'GET'
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching assignee settings')

        return res.data
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          console.log(data)

          dispatch(setAssignees(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING
          console.log(err)
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

    postAssignee: builder.mutation<string, AssigneeCreateType>({
      query: body => ({
        url: `/setting/assignees`,
        method: 'POST',
        body
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error creating assignee setting')

        return res.data
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
      invalidatesTags: result => {
        return result ? [{ type: 'SETTING-ASSIGNEE', id: 'LIST' }] : []
      }
    }),

    putAssignee: builder.mutation<boolean, AssigneeCreateType>({
      query: body => {
        const { assigneeId } = body

        return {
          url: `/setting/assignees/${assigneeId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error updating assignee setting')

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
        return result ? [{ type: 'SETTING-ASSIGNEE', id: arg.assigneeId }] : []
      }
    }),

    putAssigneeEnable: builder.mutation<string, string>({
      query: assigneeId => ({
        url: `/setting/assignees/${assigneeId}/enable`,
        method: 'PUT'
      }),
      transformResponse: (res: Record<string, any>, meta, arg) => {
        if (!res.success) throw new Error('There was an error enabling assignee setting')

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
      invalidatesTags: result => {
        return result
          ? [
              { type: 'SETTING-ASSIGNEE', id: result },
              { type: 'SETTING-ASSIGNEE', id: 'LIST' }
            ]
          : []
      }
    }),

    putAssigneeDisable: builder.mutation<string, string>({
      query: assigneeId => ({
        url: `/setting/assignees/${assigneeId}/enable`,
        method: 'PUT'
      }),
      transformResponse: (res: Record<string, any>, meta, arg) => {
        if (!res.success) throw new Error('There was an error enabling assignee setting')

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
      invalidatesTags: result => {
        return result
          ? [
              { type: 'SETTING-ASSIGNEE', id: result },
              { type: 'SETTING-ASSIGNEE', id: 'LIST' }
            ]
          : []
      }
    }),

    getAssigneeDatasource: builder.query<AssigneeDatasourceType, string>({
      query: assigneeId => ({
        url: `/setting/assignees/${assigneeId}/datasource`,
        method: 'GET'
      }),
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error disabling assignee setting')

        console.log(res.data)

        return res.data
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING
          console.log(err)
        }
      }
    })
  })
})
