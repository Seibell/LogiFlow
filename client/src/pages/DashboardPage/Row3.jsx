/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import DashboardBox from "../../components/DashboardBox";
import BoxHeader from "../../components/BoxHeader";
import { api, useGetNewsQuery } from "../../state/api";
import { useDispatch } from "react-redux";
import { useTheme, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { DataGrid } from "@mui/x-data-grid";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Row3 = ({ yearSetting }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const [year, setYear] = useState(yearSetting);
  const [loading, setLoading] = useState(false);
  const [cargoData, setCargoData] = useState([]);
  const [sentimentScore, setSentimentScore] = useState(0);
  const [top10LatestNews, setTop10LatestNews] = useState([]);
  const [bunkerSalesData, setBunkerSalesData] = useState([]);
  const news = useGetNewsQuery();

  const columns = [
    {
      field: "title",
      headerName: "Headline title",
      width: 470,
    },
    {
      field: "sentiment",
      headerName: "Score",
      width: 60,
    },
    {
      field: "date",
      headerName: "Date",
      width: 80,
    },
  ];

  const dataGridTheme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            "& .MuiDataGrid-cell": {
              color: "white",
              borderColor: palette.grey[800],
            },
            "& .MuiDataGrid-columnHeader": {
              color: "white",
              borderColor: palette.grey[800],
            },
            "& .MuiDataGrid-row": {
              borderColor: palette.grey[800],
            },
            "& .MuiPaginationItem-root": {
              color: "white",
            },
            button: {
              color: "white",
            },
            p: {
              color: "white",
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    async function getTop10LatestNews() {
      const top10LatestNews = [];
      let sum = 0;
      for (let i = 0; i < 10; i++) {
        let obj = {
          id: i + 1,
          title: news.data[i].headline,
          sentiment: news.data[i].sentiment_score,
          date: news.data[i].date,
        };
        sum += news.data[i].sentiment_score;
        top10LatestNews.push(obj);
      }
      const avg = sum / 10;
      setSentimentScore(avg);
      setTop10LatestNews(top10LatestNews);
    }
    getTop10LatestNews();
  }, [news]);

  function calculatePercentageChange(data, name) {
    const filteredData = [];
    for (let month of data) {
      if (month[name] && month[name] !== 0) {
        filteredData.push(month[name]);
      }
    }

    if (filteredData.length < 2) return null;

    const newValue = filteredData[filteredData.length - 1];
    const oldValue = filteredData[filteredData.length - 2];
    const percentageChange = ((newValue - oldValue) / oldValue) * 100;
    return percentageChange.toFixed(2) + "%";
  }

  useEffect(() => {
    setYear(yearSetting);
  }, [yearSetting]);

  useEffect(() => {
    async function fetchGeneralCargo(month) {
      const response = await dispatch(
        api.endpoints.getData.initiate({
          columnName: "Cargo (General) (Thousand Tonnes)",
          date: `${year} ${month}`,
        })
      );
      return response.data;
    }

    async function fetchBulkCargo(month) {
      const response = await dispatch(
        api.endpoints.getData.initiate({
          columnName: "Cargo (Bulk) (Thousand Tonnes)",
          date: `${year} ${month}`,
        })
      );
      return response.data;
    }

    async function fetchOilInBulkCargo(month) {
      const response = await dispatch(
        api.endpoints.getData.initiate({
          columnName: "Cargo (Oil-In-Bulk) (Thousand Tonnes)",
          date: `${year} ${month}`,
        })
      );
      return response.data;
    }

    async function fetchNonOilBulkCargo(month) {
      const response = await dispatch(
        api.endpoints.getData.initiate({
          columnName: "Cargo (General & Non-Oil In Bulk) (Thousand Tonnes)",
          date: `${year} ${month}`,
        })
      );
      return response.data;
    }

    async function fetchBunkerSales(month) {
      const response = await dispatch(
        api.endpoints.getData.initiate({
          columnName: "Bunker Sales (Thousand Tonnes)",
          date: `${year} ${month}`,
        })
      );
      return response.data;
    }

    async function fetchAllData() {
      setLoading(true);
      const totalCargoData = [];
      const bunkerSalesData = [];

      for (let month of months) {
        const generalCargoData = await fetchGeneralCargo(month);
        const bulkCargoData = await fetchBulkCargo(month);
        const oilInBulkCargoData = await fetchOilInBulkCargo(month);
        const nonOilBulkCargoData = await fetchNonOilBulkCargo(month);
        const bunkerSales = await fetchBunkerSales(month);

        bunkerSalesData.push({
          name: month,
          bunkerSales: bunkerSales["Bunker Sales (Thousand Tonnes)"][0],
        });

        totalCargoData.push({
          name: month,
          generalCargo:
            generalCargoData["Cargo (General) (Thousand Tonnes)"][0],
          bulkCargo: bulkCargoData["Cargo (Bulk) (Thousand Tonnes)"][0],
          oilInBulkCargo:
            oilInBulkCargoData["Cargo (Oil-In-Bulk) (Thousand Tonnes)"][0],
          nonOilBulkCargo:
            nonOilBulkCargoData[
              "Cargo (General & Non-Oil In Bulk) (Thousand Tonnes)"
            ][0],
          averageCargo:
            (generalCargoData["Cargo (General) (Thousand Tonnes)"][0] +
              bulkCargoData["Cargo (Bulk) (Thousand Tonnes)"][0] +
              oilInBulkCargoData["Cargo (Oil-In-Bulk) (Thousand Tonnes)"][0] +
              nonOilBulkCargoData[
                "Cargo (General & Non-Oil In Bulk) (Thousand Tonnes)"
              ][0]) /
            4,
        });
      }
      setCargoData(totalCargoData);
      setBunkerSalesData(bunkerSalesData);
      setLoading(false);
    }

    fetchAllData();
  }, [dispatch, year]);

  console.log(top10LatestNews);
  return (
    <>
      {/** ROW 3 COLUMN 1 */}
      <DashboardBox gridArea="g">
        <BoxHeader
          title="Total bunker sales (monthly)"
          subtitle="(Thousand Tonnes)"
          sideText={calculatePercentageChange(bunkerSalesData, "bunkerSales")}
        />
        {!loading ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              width={500}
              height={500}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 69,
              }}
              data={bunkerSalesData}
            >
              <CartesianGrid strokeDasharray="0 10" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bunkerSales" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="80%"
          >
            <CircularProgress />
          </Box>
        )}
      </DashboardBox>

      {/** ROW 3 COLUMN 2 */}
      <DashboardBox gridArea="h">
        <BoxHeader
          title="Cargo Breakdown"
          subtitle="Consists of General, Bulk, Oil-In-Bulk, General & Non-Oil In Bulk (Thousand Tonnes)"
          sideText={calculatePercentageChange(cargoData, "averageCargo")}
        />
        {!loading ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              width={500}
              height={500}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 69,
              }}
              data={cargoData}
            >
              <CartesianGrid strokeDasharray="0 10" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="generalCargo" fill={palette.tertiary[500]} />
              <Bar dataKey="bulkCargo" fill={palette.primary.main} />
              <Bar dataKey="oilInBulkCargo" fill={palette.secondary.main} />
              <Bar dataKey="nonOilBulkCargo" fill={palette.grey.main} />
              <Line type="monotone" dataKey="averageCargo" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="80%"
          >
            <CircularProgress />
          </Box>
        )}
      </DashboardBox>

      {/** ROW 3 COLUMN 3 */}
      <DashboardBox gridArea="i">
        <BoxHeader
          title="News Sentiment Analysis"
          subtitle="Latest headlines from the news related to the port - sentiment ranges from 0 to 10 (most bearish)"
          sideText={"Average sentiment score: " + sentimentScore.toFixed(2)}
        />
        {!loading ? (
          <Box sx={{ height: "82%", width: "100%", padding: 2 }}>
            <ThemeProvider theme={dataGridTheme}>
              <DataGrid
                sx={{
                  borderColor: palette.grey[800],
                  "& .MuiDataGrid-cell:hover": {
                    color: palette.primary.main,
                  },
                }}
                rows={top10LatestNews}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 3,
                    },
                  },
                }}
                pageSizeOptions={[3]}
                disableRowSelectionOnClick
              />
            </ThemeProvider>
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="80%"
          >
            <CircularProgress />
          </Box>
        )}
      </DashboardBox>
    </>
  );
};

export default Row3;
