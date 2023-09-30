import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  reducerPath: "main",
  tagTypes: ["Kpis", "Hello"],
  endpoints: (build) => ({
    getKpis: build.query({
      query: () => "kpi/kpis/",
      providesTags: ["Kpi"],
    }),
    getHello: build.query({
      query: () => "/api/hello",
      providesTags: ["Hello"],
    }),
  }),
});

export const { useGetKpisQuery, useGetHelloQuery } = api;
