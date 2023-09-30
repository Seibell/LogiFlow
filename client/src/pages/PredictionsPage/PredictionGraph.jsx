import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const generateData = () => {
  let data = [];
  for (let i = 0; i <= 500; i++) {
    data.push({
      month: i,
      totalCargo: Math.floor(Math.random() * (55000 - 25000 + 1) + 25000),
    });
  }
  return data;
};

const data = generateData();

const CargoChart = () => {
  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let response = await axios.get("/api/cargo-data");
  //       setData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching the data", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <LineChart
        width={1000}
        height={500}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          label={{ value: "Months", position: "insideBottomRight", offset: 0 }}
        />
        <YAxis
          label={{ value: "Total Cargo", angle: -90, position: "insideLeft" }}
          domain={[25000, 55000]}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="totalCargo"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
};

export default CargoChart;
