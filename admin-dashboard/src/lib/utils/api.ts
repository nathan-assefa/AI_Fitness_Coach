// api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl: string = import.meta.env.VITE_SERVER_URL;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: (builder) => ({
    userList: builder.query({
      query: () => "user-list",
    }),
    subscribedUserList: builder.query({
      query: () => "subscribed-user-list",
    }),
  }),
});

export const { useUserListQuery, useSubscribedUserListQuery } = api;
