import { apiSlice } from './apiSlice'
import { LunaResponseType } from './sharedTypes'
import { deleteNote, updateNotes } from '../noteSlice'

export type NoteCreateType = {
  content: string
  parentNoteId?: string
  important?: boolean
  mentionedEmails?: string
  noteReferenceId?: string
  referenceType?: NoteReferenceTypeEnum
  type?: string
  usedTemplate?: string
  targets?: NoteTargetCreateType[]
  profileId: string
}

export type NoteUpdateType = {
  noteId: string
  content: string
  parentNoteId?: string
  important?: boolean
  mentionedEmails?: string
  noteReferenceId?: string
  referenceType?: NoteReferenceTypeEnum
  type?: string
  targets?: NoteTargetCreateType[]
}

export type NoteType = {
  noteId: string
  content: string
  important: boolean
  type: string
  createdByName: string
  createdAt: string
  mentionedEmails: string
  profileId: string
}

export type NoteTargetCreateType = {
  type: NoteMentionedTargetType
  value: string
}

export enum NoteReferenceTypeEnum {
  'Liability',
  'Task',
  'Document',
  'Payment'
}

export enum NoteMentionedTargetType {
  'Employee',
  'Task',
  'Payment',
  'Liability',
  'Document'
}

export const noteApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNote: builder.query<NoteType, string>({
      query: noteId => ({
        url: `/note/${noteId}/info`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching profile notes')
        console.log(res.data)

        return res.data
      },
      async onQueryStarted(noteId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateNotes([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'NOTE', id: arg }] : []
      }
    }),
    getProfileNotes: builder.query<NoteType[], string>({
      query: profileId => ({
        url: `/note/${profileId}/profile`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error fetching profile notes')
        const result: NoteType[] = res.data.map((n: NoteType) => ({ ...n, profileId: arg }))

        return result
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateNotes(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result
          ? [
              { type: 'NOTE', id: arg },
              ...((result && result.map(note => ({ type: 'NOTE' as const, id: note.noteId }))) || [])
            ]
          : []
      }
    }),
    postNoteCreate: builder.mutation<string, NoteCreateType>({
      query: body => {
        return {
          url: `/note/${body.profileId}/profile`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error creating note')
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
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'NOTE', id: arg.profileId }] : [])
    }),
    putNoteUpdate: builder.mutation<string, NoteUpdateType>({
      query: params => {
        const { noteId, ...body } = params
        console.log(body)

        return {
          url: `/note/${noteId}`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error updating note')

        console.log(arg.noteId)

        return arg.noteId
      },
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'NOTE', id: res }] : [])
    }),
    deleteNote: builder.mutation<string, string>({
      query: noteId => {
        return {
          url: `/note/${noteId}`,
          method: 'DELETE'
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error deleting note')

        return arg
      },
      async onQueryStarted(noteId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(deleteNote(noteId))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      invalidatesTags: res => (res ? [{ type: 'NOTE', id: res }] : [])
    })
  })
})
