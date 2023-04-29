import { setDocuments } from '../documentSlice'
import { apiSlice } from './apiSlice'

// const DefaultBankAccount: BankAccountType = {
//   bankAccountId: '',
//   bankRoutingNumber: '',
//   bankName: '',
//   bankAccountNumber: '',
//   phoneNumber: null,
//   bankAccountType: 0,
//   bankAccountTypeName: 'Checking Account',
//   address: null,
//   address2: null,
//   city: null,
//   zipcode: null,
//   state: null,
//   accountName: null,
//   createdAt: null,
//   profileId: null,
//   firstName: null,
//   lastName: null
// }

export type DocumentLiabilityParamsType = {
  profileId: string
  liabilityId: string
}

export type DocumentGenerateType = {
  templateId: string
  title: string
  esignService: string
  profileId: string
  liabilityId?: string
}

export type DocumentPreviewType = {
  content: string
  title: string
  contentType: string
  fileExtension: string
  documentId: string
}

export type DocumentUploadType = {
  profileId: string
  liabilityId?: string
  data: FormData
}

export type DocumentEsignType = {
  profileId: string
  liabilityId?: string
  targetPhoneNumber: string
  targetEmail: string
  sendingMethod: number
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
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching bank accounts')

        return res.data
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
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
      transformResponse: (res: Record<string, any>) => {
        if (!res.success) throw new Error('There was an error fetching bank accounts')

        return res.data
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
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
      transformResponse: (res: Record<string, any>, meta, arg) => {
        if (!res.success) throw new Error('There was an error fetching document preview')

        const newRes = { ...res.data, documentId: arg }

        return newRes
      },
      async onQueryStarted(searchParams, { dispatch, queryFulfilled }) {
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
      transformResponse: (res: Record<string, any>) => {
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
    postGenerateLiabilityDocument: builder.mutation<string, DocumentGenerateType>({
      query: params => {
        const { liabilityId, profileId, ...body } = params

        return {
          url: `/document/${profileId}/profile/${liabilityId}/liability/generate`,
          method: 'POST',
          body
        }
      },
      transformResponse: (res: Record<string, any>) => {
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
      transformResponse: (res: Record<string, any>) => {
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
    postUploadLiabilityDocument: builder.mutation<string, DocumentUploadType>({
      query: params => {
        const { liabilityId, profileId, data } = params

        return {
          url: `/document/${profileId}/profile/${liabilityId}/liability/upload`,
          method: 'POST',
          body: data
        }
      },
      transformResponse: (res: Record<string, any>) => {
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
    postEsignDocument: builder.mutation<string, DocumentEsignType>({
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
      transformResponse: (res: Record<string, any>) => {
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
    postEsignLiabilityDocument: builder.mutation<string, DocumentEsignType>({
      query: params => {
        const { liabilityId, profileId, ...body } = params

        return {
          url: `/document/${profileId}/profile/${liabilityId}/liability/esign/send`,
          method: 'PUT',
          body
        }
      },
      transformResponse: (res: Record<string, any>) => {
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

export const {
  useGetDocumentByLiabilityQuery,
  useGetDocumentPreviewQuery,
  useGetDocumentsQuery,
  usePostEsignDocumentMutation,
  usePostEsignLiabilityDocumentMutation,
  usePostGenerateDocumentMutation,
  usePostGenerateLiabilityDocumentMutation,
  usePostUploadDocumentMutation,
  usePostUploadLiabilityDocumentMutation
} = documentApiSlice
