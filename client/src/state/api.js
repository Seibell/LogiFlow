import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  reducerPath: "main",
  tagTypes: ["Kpis", "Hello", "Data"],
  endpoints: (build) => ({
    getKpis: build.query({
      query: () => "kpi/kpis/",
      providesTags: ["Kpi"],
    }),
    getHello: build.query({
      query: () => "/api/hello",
      providesTags: ["Hello"],
    }),
    getData: build.query({
      query: ({ columnName, date }) =>
        `/get_data/${encodeURIComponent(columnName)}?month=${encodeURIComponent(
          date
        )}`,
      providesTags: ["Data"],
    }),
    getAllData: build.query({
      query: ({ columnName }) => `/get_data/${encodeURIComponent(columnName)}`,
    }),
  }),
});

export const {
  useGetKpisQuery,
  useGetHelloQuery,
  useGetDataQuery,
  useGetAllDataQuery,
} = api;
