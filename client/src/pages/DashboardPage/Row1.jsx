/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import DashboardBox from "../../components/DashboardBox";
import BoxHeader from "../../components/BoxHeader";
import { api } from "../../state/api";
import { useDispatch } from "react-redux";
import { useTheme, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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

const Row1 = ({ yearSetting }) => {
  const dispatch = useDispatch();
  const [year, setYear] = useState(yearSetting);
  const [loading, setLoading] = useState(false);
  const { palette } = useTheme();
  const [vesselArrivalsData, setVesselArrivalsData] = useState([]);
  const [totalCargoData, setTotalCargoData] = useState([]);
  const [totalThroughPutData, setTotalThroughPutData] = useState([]);

  useEffect(() => {
    setYear(yearSetting);
  }, [yearSetting]);

  useEffect(() => {
    async function fetchArrivalNumbers(month) {
      const response = await dispatch(
        api.endpoints.getData.initiate({
          columnName: "Vessel Arrivals (Number)",
          date: `${year} ${month}`,
        })
      );
      return response.data;
    }

    async function fetchArrivalTonnage(month) {
      const response = await dispatch(
        api.endpoints.getData.initiate({
          columnName:
            "Vessel Arrivals - Shipping Tonnage (Thousand Gross Tonnes)",
          date: `${year} ${month}`,
        })
      );
      return response.data;
    }

    async function fetchTotalCargo(month) {
      const response = await dispatch(
        api.endpoints.getData.initiate({
          columnName: "Total Cargo (Thousand Tonnes)",
          date: `${year} ${month}`,
        })
      );
      return response.data;
    }

    async function fetchTotalContainerThroughput(month) {
      const response = await dispatch(
        api.endpoints.getData.initiate({
          columnName:
            "Total Container Throughput (Thousand Twenty-Foot Equivalent Units)",
          date: `${year} ${month}`,
        })
      );
      return response.data;
    }
    async function fetchAllData() {
      setLoading(true);
      const arrivalData = [];
      const totalCargoData = [];
      const totalThroughPutData = [];

      for (let month of months) {
        const arrivalNumbersData = await fetchArrivalNumbers(month);
        const arrivalTonnageData = await fetchArrivalTonnage(month);
        const throughputData = await fetchTotalContainerThroughput(month);
        const cargoData = await fetchTotalCargo(month);
        arrivalData.push({
          name: month,
          vesselArrivalNumber:
            arrivalNumbersData["Vessel Arrivals (Number)"][0],
          vesselArrivalTonnage: !isNaN(
            arrivalTonnageData[
              "Vessel Arrivals - Shipping Tonnage (Thousand Gross Tonnes)"
            ][0]
          )
            ? arrivalTonnageData[
                "Vessel Arrivals - Shipping Tonnage (Thousand Gross Tonnes)"
              ][0] / 10
            : null,
        });
        totalCargoData.push({
          name: month,
          totalCargo: cargoData["Total Cargo (Thousand Tonnes)"][0],
        });

        totalThroughPutData.push({
          name: month,
          totalThroughput:
            throughputData[
              "Total Container Throughput (Thousand Twenty-Foot Equivalent Units)"
            ][0],
        });
      }
      setTotalCargoData(totalCargoData);
      setVesselArrivalsData(arrivalData);
      setTotalThroughPutData(totalThroughPutData);
      setLoading(false);
    }
    fetchAllData();
  }, [dispatch, year]);

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

  return (
    <>
      {/** ROW 1 COLUMN 1 */}
      <DashboardBox gridArea="a">
        <BoxHeader
          title="Vessel Arrivals - Ships & Tonnage"
          subtitle="Number of ship arrivals & Tonnage (10-Thousands Gross Tonnes)"
          sideText={calculatePercentageChange(
            vesselArrivalsData,
            "vesselArrivalTonnage"
          )}
        />

        {!loading ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={500}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 45,
              }}
              data={vesselArrivalsData}
            >
              <CartesianGrid vertical={false} stroke={palette.grey[800]} />
              <XAxis
                dataKey="name"
                tickLine={false}
                style={{ fontSize: "10px" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px" }}
              />
              <Tooltip />
              <Legend
                height={20}
                wrapperStyle={{
                  margin: "0 0 10px 0",
                }}
              />
              <Line
                type="monotone"
                dataKey="vesselArrivalNumber"
                stroke={palette.tertiary[500]}
              />
              <Line
                type="monotone"
                dataKey="vesselArrivalTonnage"
                stroke={palette.primary.main}
              />
            </LineChart>
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

      {/** ROW 1 COLUMN 2 */}
      <DashboardBox gridArea="b">
        <BoxHeader
          title="Total Cargo"
          subtitle="(thousand tonnes)"
          sideText={calculatePercentageChange(totalCargoData, "totalCargo")}
        />
        {!loading ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={500}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 55,
              }}
              data={totalCargoData}
            >
              <CartesianGrid vertical={false} stroke={palette.grey[800]} />
              <XAxis
                axisLine={false}
                tickLine={false}
                style={{ fontSize: "10px" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                style={{ fontSize: "10px" }}
              />
              <Tooltip />
              <Bar dataKey="totalCargo" fill="url(#colorUv)" />
            </BarChart>
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

      {/** ROW 1 COLUMN 3 */}
      <DashboardBox gridArea="c">
        <BoxHeader
          title="Total Container Throughput (Monthly)"
          subtitle={"(Thousand Twenty-Foot Equivalent Units)"}
          sideText={calculatePercentageChange(
            totalThroughPutData,
            "totalThroughput"
          )}
        />
        {!loading ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={500}
              height={500}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 55,
              }}
              data={totalThroughPutData}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="0 10" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="totalThroughput"
                stroke={palette.primary.light}
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
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
    </>
  );
};

export default Row1;
