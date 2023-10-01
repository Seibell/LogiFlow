/* eslint-disable react/prop-types */
import DashboardBox from "../../components/DashboardBox";
import BoxHeader from "../../components/BoxHeader";
import { useState, useEffect } from "react";
import { api } from "../../state/api";
import { useDispatch } from "react-redux";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Box,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Heatmap from "./Heatmap";

const selectStyle = {
  color: "white",
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(228, 219, 233, 0.25)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(228, 219, 233, 0.25)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(228, 219, 233, 0.25)",
  },
  ".MuiSvgIcon-root ": {
    fill: "white !important",
  },
};

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 40 * 4.5 + 8,
      width: 250,
    },
  },
};

const Row2 = ({ onChangeYearSetting }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const [yearSetting, setYearSetting] = useState(2023);
  const [totalThroughPutData, setTotalThroughPutData] = useState([]);
  const years = Array.from(
    { length: 2023 - 1995 + 1 },
    (_, i) => 1995 + i
  ).reverse();

  const handleOnChange = (year) => {
    onChangeYearSetting(year);
    setYearSetting(year);
  };

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
    async function fetchTotalContainerThroughput() {
      const response = await dispatch(
        api.endpoints.getAllData.initiate({
          columnName:
            "Total Container Throughput (Thousand Twenty-Foot Equivalent Units)",
        })
      );
      const data =
        response.data[
          "Total Container Throughput (Thousand Twenty-Foot Equivalent Units)"
        ];
      // Step 1: Create an empty object for yearly aggregation
      const yearlyThroughput = [];
      let startYear = 1995;
      let sum_of_throughput_yearly = 0;

      // Step 2: Iterate over the throughput array
      for (let i = 0; i < data.length; i++) {
        if (!sum_of_throughput_yearly) {
          sum_of_throughput_yearly = 0;
        }
        sum_of_throughput_yearly += data[i];

        if ((i + 1) % 12 == 0 || i == data.length - 1) {
          // Check at every 12th month or the last data point
          yearlyThroughput.push({
            year: startYear++,
            totalThroughput: sum_of_throughput_yearly.toFixed(0),
          });
          sum_of_throughput_yearly = 0;
        }
      }
      setTotalThroughPutData(yearlyThroughput);
    }

    fetchTotalContainerThroughput();
  }, [dispatch]);

  return (
    <>
      {/** ROW 2 COLUMN 1 */}
      <DashboardBox gridArea="d">
        <BoxHeader
          title="Ship traffic heatmap"
          subtitle="Ship activity over time (randomised)"
        />
        <Box width="100%" height="66%" paddingLeft="1rem">
          <Heatmap yearSetting={yearSetting} />
        </Box>
      </DashboardBox>

      {/** ROW 2 COLUMN 2 */}
      <DashboardBox gridArea="e">
        <BoxHeader
          title="Dashboard settings"
          subtitle="set your dashboard preferences here"
        />
        <Box sx={{ minWidth: 250, marginTop: 2, paddingX: 2 }}>
          <FormControl
            variant="outlined"
            fullWidth
            style={{ color: palette.primary.main }}
          >
            <InputLabel id="year-label" style={{ color: palette.grey[400] }}>
              Select Year
            </InputLabel>
            <Select
              labelId="year-label"
              value={yearSetting}
              onChange={(event) => handleOnChange(event.target.value)}
              label="Select Year"
              MenuProps={MenuProps}
              sx={selectStyle}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DashboardBox>

      {/** ROW 2 COLUMN 3 */}
      <DashboardBox gridArea="f">
        <BoxHeader
          title="Total Container Throughput (Yearly)"
          subtitle={"(Thousand Twenty-Foot Equivalent Units)"}
          sideText={calculatePercentageChange(
            totalThroughPutData,
            "totalThroughput"
          )}
        />
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
            <XAxis dataKey="year" />
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
      </DashboardBox>
    </>
  );
};

export default Row2;
