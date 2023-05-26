import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'
import { NoteType } from './api/noteApiSlice'

const noteAdapter = createEntityAdapter({
  selectId: (note: NoteType) => note.noteId
})

const initialState = noteAdapter.getInitialState()

const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setNotes: (state, action) => {
      noteAdapter.setAll(state, action.payload)
    },
    updateNotes: (state, action) => {
      noteAdapter.upsertMany(state, action.payload)
    },
    addNote: (state, action) => {
      noteAdapter.addOne(state, action.payload)
    },
    updateNote: (state, action) => {
      noteAdapter.upsertOne(state, action.payload)
    },
    deleteNote: (state, action) => {
      noteAdapter.removeOne(state, action.payload)
    }
  }
})

export const { setNotes, addNote, updateNote, updateNotes, deleteNote } = noteSlice.actions

export default noteSlice.reducer

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds
} = noteAdapter.getSelectors((state: RootState) => state.note)

export const selectNotesByProfileId = createSelector(
  selectAllNotes,
  (_: RootState, profileId: string) => profileId,
  (notes, profileId) => {
    return notes.filter(note => note.profileId === profileId)
  }
)

export const selectPinnedNotesByProfileId = createSelector(
  selectAllNotes,
  (_: RootState, profileId: string) => profileId,
  (notes, profileId) => {
    return notes.filter(note => note.profileId === profileId && note.important === true)
  }
)
