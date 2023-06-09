import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { DocumentType } from './api/documentApiSlice'

const documentAdapter = createEntityAdapter({
  selectId: (document: DocumentType) => document.documentId
})

const initialState = documentAdapter.getInitialState()

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setDocuments: (state, action) => {
      documentAdapter.upsertMany(state, action.payload)
    }
  }
})

export const { setDocuments } = documentSlice.actions

export default documentSlice.reducer

export const {
  selectAll: selectAllDocuments,
  selectById: selectDocumentById,
  selectIds: selectDocumentIds
} = documentAdapter.getSelectors((state: RootState) => state.document)

export const selectDocumentsByProfileId = createSelector(
  selectAllDocuments,
  (_: RootState, profileId: string) => profileId,
  (documents, profileId) => {
    return documents.filter(document => document.profileId === profileId)
  }
)

export const selectDocumentsByProfileIdAndType = createSelector(
  [selectAllDocuments, (state: RootState, profileId: string, type: number) => ({ profileId, type })],
  (documents, { profileId, type }) => {
    return documents.filter(document => document.profileId === profileId && document.type === type)
  }
)
