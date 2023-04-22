import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { CampaignType } from './api/campaignApiSlice'

const campaignAdapter = createEntityAdapter({
  selectId: (campaign: CampaignType) => campaign.campaignId
})

const initialState = campaignAdapter.getInitialState()

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setCampaigns: (state, action) => {
      campaignAdapter.upsertMany(state, action.payload)
    },
    addCampaign: (state, action) => {
      campaignAdapter.addOne(state, action.payload)
    },
    updateCampaign: (state, action) => {
      campaignAdapter.upsertOne(state, action.payload)
    },
    deleteCampaign: (state, action) => {
      campaignAdapter.removeOne(state, action.payload)
    }
  }
})

export const { setCampaigns, addCampaign, updateCampaign, deleteCampaign } = campaignSlice.actions

export default campaignSlice.reducer

export const {
  selectAll: selectAllCampaigns,
  selectById: selectCampaignById,
  selectIds: selectCampaignIds
} = campaignAdapter.getSelectors((state: RootState) => state.campaign)
