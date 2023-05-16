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
  // ***************************************************** GET note/noteId/info
  endpoints: builder => ({
    getNote: builder.query<NoteType | null, string>({
      query: noteId => ({
        url: `/note/${noteId}/info`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching note information',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) return null

        return res.data
      },
      async onQueryStarted(noteId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateNotes([data]))
        } catch (err: any) {
          console.error('API error in getNote:', err.error.data.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'NOTE', id: arg }] : []
      }
    }),

    // ***************************************************** GET note/profileId/profile
    getProfileNotes: builder.query<NoteType[] | null, string>({
      query: profileId => ({
        url: `/note/${profileId}/profile`,
        method: 'GET'
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error fetching profile notes',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) return null
        const result: NoteType[] = res.data.map((n: NoteType) => ({ ...n, profileId: arg }))

        return result
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data) dispatch(updateNotes(data))
        } catch (err: any) {
          console.error('API error in getProfileNotes:', err.error.data.message)
        }
      },
      providesTags: (result, error, arg) => {
        return result
          ? [{ type: 'NOTE', id: arg }, ...result.map(note => ({ type: 'NOTE' as const, id: note.noteId }))]
          : []
      }
    }),

    // ***************************************************** POST note/profileId/profile
    postNoteCreate: builder.mutation<boolean, NoteCreateType>({
      query: body => {
        return {
          url: `/note/${body.profileId}/profile`,
          method: 'POST',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error creating note',
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
          console.error('API error in postNoteCreate:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'NOTE', id: arg.profileId }] : [])
    }),

    // ***************************************************** PUT note/noteId
    putNoteUpdate: builder.mutation<boolean, NoteUpdateType>({
      query: params => {
        const { noteId, ...body } = params

        return {
          url: `/note/${noteId}`,
          method: 'PUT',
          body
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error updating note',
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
          console.error('API error in putNoteUpdate:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'NOTE', id: arg.noteId }] : [])
    }),

    // ***************************************************** DELETE note/noteId
    deleteNote: builder.mutation<boolean, string>({
      query: noteId => {
        return {
          url: `/note/${noteId}`,
          method: 'DELETE'
        }
      },
      transformErrorResponse(baseQueryReturnValue) {
        return {
          status: baseQueryReturnValue.status,
          message: 'There was an error deleting note',
          data: baseQueryReturnValue.data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        return res.success
      },
      async onQueryStarted(noteId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(deleteNote(noteId))
        } catch (err: any) {
          console.error('API error in getDocuments:', err.error.data.message)
        }
      },
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'NOTE', id: arg }] : [])
    })
  })
})
