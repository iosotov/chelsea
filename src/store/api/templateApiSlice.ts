import { setTemplates } from '../templateSlice'
import { apiSlice } from './apiSlice'
import { FeeType } from './enrollmentApiSlice'
import { LunaResponseType, SearchFilterType } from './sharedTypes'

export type TemplateCreateType = {
  name?: string
  title?: string
  content: string
  type?: TemplateCreateType
  sharedTargets?: DataSourceSharingType
}

export type DataSourceSharingType = {
  sharedAll: boolean
  sharedEmployees: string[]
  sharedCompanies: string[]
  sharedRoles: string[]
  sharedGroups: string[]
}

export type TemplateRenderType = {
  templateName: string
  content: string
  title: string
  presetCCs: string
}

export type TemplateRenderRequestType = {
  templateId: string
  profileId?: string
  liabilityId?: string
}

export enum TemplateTypeEnum {
  'Document',
  'Email',
  'SMS',
  'Note',
  'Task',
  'Script',
  'EnrollmentPlan',
  'CompensationTemplate'
}

export type TemplateType = {
  id: string
  name: string
  title: string
  content: string
  type: TemplateTypeEnum
}

export type EnrollmentExtraFeeType = {
  name: string
  feeType: FeeType
  feeDefault: number
  feeLow: number
  feeIncrement: number
  programLengthLow: number
  programLengthHigh: number
}

export type EnrollmentTemplateCreateType = {
  name: string
  feeType: FeeType
  feeName: string
  feeDefault: number
  feeLow: number
  feeIncrement: number
  programLengthDefault: number
  programLengthLow: number
  programLengthHigh: number
  programLengthIncrement: number
  extraFees: EnrollmentExtraFeeType[]
  id?: string
  type?: TemplateTypeEnum
  sharingTargets?: DataSourceSharingType
}

export const templateApiSlice = apiSlice.injectEndpoints({
  // ****************************************************************** POST template
  endpoints: builder => ({
    postTemplateCreate: builder.mutation<string | boolean, TemplateCreateType>({
      query: body => ({
        url: `/template`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating template',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success ? res.data : res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postTemplateCreate:', err.error.data.message)
        }
      },
      invalidatesTags: res => {
        return res ? [{ type: 'TEMPLATE' as const, id: 'LIST' }] : []
      }
    }),

    // ****************************************************************** POST template/templateId/render
    postTemplateRender: builder.query<TemplateRenderType, TemplateRenderRequestType>({
      query: params => {
        const { templateId, ...body } = params

        return {
          url: `/template/${templateId}/render`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error rendering template',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success ? res.data : res.success
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postTemplateRender:', err.error.data.message)
        }
      }
    }),

    // ****************************************************************** POST template/templateId/render
    postTemplateSearch: builder.query<TemplateType[], SearchFilterType>({
      query: body => {
        return {
          url: `/template/search`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching templates',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success ? res.data.data : res.success
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(setTemplates(data))
        } catch (err: any) {
          console.error('API error in postTemplateSearch:', err.error.data.message)
        }
      },
      providesTags: res => {
        return res ? [{ type: 'TEMPLATE', id: 'LIST' }, ...res.map(t => ({ type: 'TEMPLATE' as const, id: t.id }))] : []
      }
    }),

    // ****************************************************************** POST template/templateId/render
    postTemplateEnrollmentCreate: builder.mutation<string | boolean, EnrollmentTemplateCreateType>({
      query: body => {
        return {
          url: `/template/enrollment-plan`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating enrollment template',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success ? res.data.data : res.success
      },
      async onQueryStarted(body, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in postTemplateEnrollmentCreate:', err.error.data.message)
        }
      },
      invalidatesTags: res => {
        return res ? [{ type: 'TEMPLATE', id: 'LIST' }] : []
      }
    })
  })
})
