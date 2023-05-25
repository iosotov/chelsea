import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { TemplateType } from './api/templateApiSlice'

const templateAdapter = createEntityAdapter({
  selectId: (template: TemplateType) => template.id
})

const initialState = templateAdapter.getInitialState()

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    setTemplates: (state, action) => {
      templateAdapter.setAll(state, action.payload)
    },
    updateTemplates: (state, action) => {
      templateAdapter.upsertMany(state, action.payload)
    },
    addTemplate: (state, action) => {
      templateAdapter.addOne(state, action.payload)
    },
    updateTemplate: (state, action) => {
      templateAdapter.upsertOne(state, action.payload)
    },
    deleteTemplate: (state, action) => {
      templateAdapter.removeOne(state, action.payload)
    }
  }
})

export const { setTemplates, addTemplate, updateTemplate, updateTemplates, deleteTemplate } = templateSlice.actions

export default templateSlice.reducer

export const {
  selectAll: selectAllTemplates,
  selectById: selectTemplateById,
  selectIds: selectTemplateIds
} = templateAdapter.getSelectors((state: RootState) => state.template)

export const selectTemplatesByType = createSelector(
  selectAllTemplates,
  (_: RootState, type: number) => type,
  (templates, type) => {
    console.log(templates)

    return templates.filter(template => template.type === type)
  }
)
