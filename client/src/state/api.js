import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_DEPLOYMENT_URL }),
  reducerPath: "main",
  tagTypes: ["Kpis", "Hello", "Data", "News"],
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
    getCostFunction: build.query({
      query: () => "/cost_function",
      providesTags: ["CostFunction"],
    }),
    getNews: build.query({
      query: () => "/get_latest_news",
      providesTags: ["News"],
    }),
  }),
});

export const {
  useGetKpisQuery,
  useGetHelloQuery,
  useGetDataQuery,
  useGetAllDataQuery,
  useGetNewsQuery,
} = api;
