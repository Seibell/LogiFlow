import React, { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from "recharts";
import axios from "axios";
import moment from "moment";
import { Button, TextField, Grid } from "@mui/material";

const CargoChart = () => {
  const [data, setData] = useState([]);
  const [monthsPredicted, setMonthsPredicted] = useState(12);
  const BASE_URL = import.meta.env.VITE_DEPLOYMENT_URL;

  const fetchData = useCallback(async () => {
    try {
      let response = await axios.get(
        `${BASE_URL}/predict_cargo/${monthsPredicted}`
      );
      let fetchedData = response.data.data;
      const predictedIndexStart = response.data.predicted_index[0];
      const predictedIndexEnd = response.data.predicted_index[1];

      // Assume the data is sorted by month in ascending order
      const lastOriginalMonth = fetchedData.month[predictedIndexStart - 1];
      console.log(lastOriginalMonth);
      const startPredictedDate = moment(lastOriginalMonth, "YYYY MMM").add(
        1,
        "months"
      );
      console.log(startPredictedDate);

      let formattedData = fetchedData.month.map((item, index) => ({
        month: item,
        totalCargo:
          index >= predictedIndexStart && index <= predictedIndexEnd
            ? null
            : fetchedData.cargo[index],
        predictedCargo:
          index >= predictedIndexStart && index <= predictedIndexEnd
            ? fetchedData.cargo[index]
            : null,
      }));

      // Create new month labels for predicted data
      for (let i = predictedIndexStart; i <= predictedIndexEnd; i++) {
        formattedData.push({
          month: moment(lastOriginalMonth, "YYYY MMM")
            .add(i - predictedIndexStart + 1, "months")
            .format("YYYY MMM"),
          totalCargo: null,
          predictedCargo: fetchedData.cargo[i],
        });
      }

      console.log(formattedData);

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching the data", error);
    }
  }, [monthsPredicted]);

  useEffect(() => {
    fetchData();
  }, []);

  const cargoValues = data.flatMap((item) => [
    item.totalCargo,
    item.predictedCargo,
  ]);
  const maxCargo = Math.max(...cargoValues);
  const minCargo = Math.min(...cargoValues);

  const handleMonthsPredictedChange = (event) => {
    const value = event.target.value;
    if (value >= 1 && value <= 12) {
      setMonthsPredicted(value);
    }
  };

  const regenerateGraph = () => {
    fetchData();
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Grid
        container
        justifyContent="flex-end"
        style={{ marginBottom: "20px", width: "100%" }}
      >
        <TextField
          type="number"
          inputProps={{ min: 1, max: 12 }}
          color="secondary"
          variant="outlined"
          value={monthsPredicted}
          onChange={handleMonthsPredictedChange}
          label="Months Predicted"
          style={{ background: "white", marginRight: "10px" }}
          InputLabelProps={{
            style: {
              color: "white",
              top: "-10px",
            },
          }}
        />
        <Button variant="contained" color="secondary" onClick={regenerateGraph}>
          Generate Graph
        </Button>
      </Grid>
      <LineChart
        width={1000}
        height={500}
        data={data}
        margin={{
          top: 5,
          right: 65,
          left: 20,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="category"
          dataKey="month"
          label={{ value: "Months", position: "insideBottomRight", offset: 0 }}
        />
        <YAxis
          label={{
            value: "Total Cargo",
            angle: -90,
            position: "insideLeft",
            offset: -10,
          }}
          domain={[minCargo, maxCargo]}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="totalCargo"
          stroke="lightgreen"
          dot={false}
          activeDot={{ r: 8 }}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="predictedCargo"
          stroke="red"
          dot={false}
          activeDot={{ r: 8 }}
          isAnimationActive={false}
        />
        <Brush dataKey="month" height={30} stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default CargoChart;
