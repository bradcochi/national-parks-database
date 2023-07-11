import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const npsApi = createApi({
    reducerPath: 'npsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://localhost:8000'
    }),
    endpoints: (builder) => ({
        getAccount: builder.query({
            query: () => ({
                url: `/token`,
                credentials: 'include'
            }),
            transformResponse: (response) => response ? response.account: null,
            providesTags: ['Account']
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/token',
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: ['Account']
        }),
        login: builder.mutation({
            query: ({username, password}) => {
                const body = new FormData()
                body.append('username', username)
                body.append('password', password)
                return {
                    url: '/token',
                    method: 'POST',
                    body,
                    credentials: 'include'
                }
            },
            invalidatesTags: ['Account']
        }),
        signup: builder.mutation
    })
})