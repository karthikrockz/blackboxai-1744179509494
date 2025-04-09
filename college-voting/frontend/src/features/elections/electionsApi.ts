import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Election {
  _id: string;
  title: string;
  description?: string;
  positions: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface CreateElectionPayload {
  title: string;
  description?: string;
  positions: string[];
  startDate: string;
  endDate: string;
}

interface UpdateElectionPayload extends Partial<CreateElectionPayload> {
  isActive?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const electionsApi = createApi({
  reducerPath: 'electionsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Election'],
  endpoints: (builder) => ({
    getElections: builder.query<ApiResponse<Election[]>, void>({
      query: () => '/elections',
      providesTags: ['Election']
    }),
    getElectionById: builder.query<ApiResponse<Election>, string>({
      query: (id) => `/elections/${id}`,
      providesTags: (result, error, id) => [{ type: 'Election', id }]
    }),
    createElection: builder.mutation<ApiResponse<Election>, CreateElectionPayload>({
      query: (body) => ({
        url: '/elections',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Election']
    }),
    updateElection: builder.mutation<ApiResponse<Election>, { id: string; body: UpdateElectionPayload }>({
      query: ({ id, body }) => ({
        url: `/elections/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Election', id }]
    }),
    deleteElection: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/elections/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Election']
    }),
    toggleElectionStatus: builder.mutation<ApiResponse<Election>, string>({
      query: (id) => ({
        url: `/elections/${id}/status`,
        method: 'PUT'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Election', id }]
    })
  }),
});

export const { 
  useGetElectionsQuery, 
  useGetElectionByIdQuery,
  useCreateElectionMutation,
  useUpdateElectionMutation,
  useDeleteElectionMutation,
  useToggleElectionStatusMutation
} = electionsApi;
