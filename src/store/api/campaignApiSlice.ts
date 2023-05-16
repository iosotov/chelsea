import { setCampaigns, updateCampaigns } from '../campaignSlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType, SearchFilterType } from './sharedTypes'

export type CampaignCreateType = {
  campaignName: string
  description?: string
  phone: string
  email?: string
  displayName?: string
  companyId: string
}

export type CampaignUpdateType = {
  campaignId: string
  campaignName: string
  description?: string
  phone: string
  email?: string
  displayName?: string
  companyId: string
}

export type CampaignType = {
  campaignId: string
  campaignName: string
  description: string
  phone: string
  email: string
  displayName: string
  companyId: string
  companyName: string
}

export const campaignApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // ******************************************* GET campaign/campaignId/info
    getCampaign: builder.query<CampaignType | null, string>({
      query: campaignId => ({
        url: `/campaign/${campaignId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching campaign information',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) null

        return res.data
      },
      async onQueryStarted(campaignId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          if (data) dispatch(updateCampaigns([data]))
        } catch (err: any) {
          console.error('API error in getCampaign:', err.error.data.message)
        }
      },
      providesTags: result => {
        return result ? [{ type: 'CAMPAIGN', id: result.campaignId }] : []
      }
    }),

    // ***************************************************** POST campaign/search
    getCampaigns: builder.query<CampaignType[] | null, SearchFilterType>({
      query: body => ({
        url: `/campaign/search`,
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching campaigns',
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

          if (data) dispatch(setCampaigns(data))
        } catch (err: any) {
          console.error('API error in getCampaigns:', err.error.data.message)
        }
      },
      providesTags: result => {
        return result
          ? [
              { type: 'CAMPAIGN', id: 'LIST' },
              ...((result && result.map(campaign => ({ type: 'CAMPAIGN' as const, id: campaign.campaignId }))) || [])
            ]
          : []
      }
    }),

    // ********************************************************* POST campaign
    postCampaignCreate: builder.mutation<boolean, CampaignCreateType>({
      query: body => {
        return {
          url: `/campaign`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating campaign',
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
          console.error('API error in postCampaignCreate:', err.error.data.message)
        }
      },
      invalidatesTags: result => (result ? [{ type: 'CAMPAIGN', id: 'LIST' }] : [])
    }),

    // ********************************************************* PUT campaign/campaignId
    putCampaignUpdate: builder.mutation<boolean, CampaignUpdateType>({
      query: params => {
        const { campaignId, ...body } = params

        return {
          url: `/campaign/${campaignId}`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating campaign',
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
          console.error('API error in putCampaignUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'CAMPAIGN', id: arg.campaignId }] : [])
    }),

    // ********************************************************* DELETE campaign/campaignId
    deleteCampaign: builder.mutation<boolean, string>({
      query: campaignId => {
        return {
          url: `/campaign/${campaignId}`,
          method: 'DELETE'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error deleting campaign',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(campaignId, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err: any) {
          console.error('API error in deleteCampaign:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'CAMPAIGN', id: arg }] : [])
    })
  })
})
