import { setDocuments } from '../documentSlice'
import { apiSlice } from './apiSlice'
import { LunaResponseType } from './sharedTypes'

export type DocumentLiabilityParamsType = {
  profileId: string
  liabilityId: string
}

export type DocumentGenerateType = {
  templateId: string
  title: string
  esignService?: string
  profileId: string
}

export type LiabilityDocumentGenerateType = {
  templateId: string
  title: string
  esignService?: string
  profileId: string
  liabilityId: string
}

export type DocumentPreviewType = {
  content: string
  title: string
  contentType: string
  fileExtension: string
  documentId: string
}

/*

FORM DATA FIELDS

title: string (required)
description: string (optional)
file: file (required)
category: string (required)

*/
export type DocumentUploadType = {
  profileId: string

  // Refer to comment above
  data: FormData
}

export type LiabilityDocumentUploadType = {
  profileId: string
  liabilityId: string

  // Refer to comment above
  data: FormData
}

export type DocumentEsignType = {
  profileId: string
  targetPhoneNumber: string
  targetEmail: string
  sendingMethod?: number
  documentId: string
}

export type LiabilityDocumentEsignType = {
  profileId: string
  liabilityId: string
  targetPhoneNumber: string
  targetEmail: string
  sendingMethod?: number
  documentId: string
}

export type DocumentType = {
  documentId: string
  name: string
  title: string
  url: string
  type: number
  typeName: string
  status: number
  statusName: string
  category: string
  description: string
  esignService: string
  liabilityId: string
  fileSize: number
  profileId: string
  createdAt: string
  createdByName: string
  signedIp: string
}
export const documentApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDocuments: builder.query<DocumentType[], string>({
      query: profileId => ({
        url: `/document/${profileId}/profile`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching documents')

        return res.data
      },
      async onQueryStarted(profileId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)

          dispatch(setDocuments(data))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: (result, error, arg) => {
        return result ? [{ type: 'DOCUMENT', id: arg }] : []
      }
    }),
    getDocumentByLiability: builder.query<DocumentType, DocumentLiabilityParamsType>({
      query: params => ({
        url: `/document/${params.profileId}/profile/${params.liabilityId}/liability`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error fetching documents')

        return res.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)

          dispatch(setDocuments([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      }
    }),
    getDocumentPreview: builder.query<DocumentPreviewType, string>({
      query: documentId => ({
        url: `/document/${documentId}/preview`,
        method: 'GET'
      }),
      transformResponse: (res: LunaResponseType, meta, arg) => {
        if (!res.success) throw new Error('There was an error fetching document preview')

        const newRes = { ...res.data, documentId: arg }

        return newRes
      },
      async onQueryStarted(documentId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log(data)

          dispatch(setDocuments([data]))
        } catch (err) {
          // ************************
          // NEED TO CREATE ERROR HANDLING

          console.log(err)
        }
      },
      providesTags: res => (res ? [{ type: 'DOCUMENT-PREVIEW', id: res.documentId }] : [])
    }),
    postGenerateDocument: builder.mutation<string, DocumentGenerateType>({
      query: params => {
        const { profileId, ...body } = params

        return {
          url: `/document/${profileId}/profile/generate`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error generating document')
        console.log(res.data)

        return res.data
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
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'DOCUMENT', id: arg.profileId }] : [])
    }),
    postGenerateLiabilityDocument: builder.mutation<string, LiabilityDocumentGenerateType>({
      query: params => {
        const { liabilityId, profileId, ...body } = params

        return {
          url: `/document/${profileId}/profile/${liabilityId}/liability/generate`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error generating document')
        console.log(res.data)

        return res.data
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
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'DOCUMENT', id: arg.profileId }] : [])
    }),
    postUploadDocument: builder.mutation<string, DocumentUploadType>({
      query: params => {
        const { profileId, data } = params

        return {
          url: `/document/${profileId}/profile/upload`,
          method: 'POST',
          body: data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error uploading documents')

        return res.data
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
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'DOCUMENT', id: arg.profileId }] : [])
    }),
    postUploadLiabilityDocument: builder.mutation<string, LiabilityDocumentUploadType>({
      query: params => {
        const { liabilityId, profileId, data } = params

        return {
          url: `/document/${profileId}/profile/${liabilityId}/liability/upload`,
          method: 'POST',
          body: data
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error uploading documents')

        return res.data
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
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'DOCUMENT', id: arg.profileId }] : [])
    }),
    postEsignDocument: builder.mutation<boolean, DocumentEsignType>({
      query: params => {
        console.log(params)
        const { profileId, ...body } = params

        console.log(body)

        return {
          url: `/document/${profileId}/profile/esign/send`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error esigning documents')

        return res.success
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
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'DOCUMENT', id: arg.profileId }] : [])
    }),
    postEsignLiabilityDocument: builder.mutation<string, LiabilityDocumentEsignType>({
      query: params => {
        const { liabilityId, profileId, ...body } = params

        return {
          url: `/document/${profileId}/profile/${liabilityId}/liability/esign/send`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: LunaResponseType) => {
        if (!res.success) throw new Error('There was an error uploading documents')

        return res.data
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
      invalidatesTags: (res, error, arg) => (res ? [{ type: 'DOCUMENT', id: arg.profileId }] : [])
    })
  })
})
