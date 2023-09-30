import { useEffect, useState } from "react";
import DashboardBox from "../../components/DashboardBox";
import BoxHeader from "../../components/BoxHeader";
import { api } from "../../state/api";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material";
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

const Row3 = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const [cargoData, setCargoData] = useState([]);

  useEffect(() => {
    async function fetchGeneralCargo(month) {
      const response = await dispatch(
        api.endpoints.getData.initiate({
          columnName: "Cargo (General) (Thousand Tonnes)",
          date: `2023 ${month}`,
        })
      );
      return response.data;
    }

    async function fetchBulkCargo(month) {
      const response = await dispatch(
        api.endpoints.getData.initiate({
          columnName: "Cargo (Bulk) (Thousand Tonnes)",
          date: `2023 ${month}`,
        })
      );
      return response.data;
    }

    async function fetchOilInBulkCargo(month) {
      const response = await dispatch(
        api.endpoints.getData.initiate({
          columnName: "Cargo (Oil-In-Bulk) (Thousand Tonnes)",
          date: `2023 ${month}`,
        })
      );
      return response.data;
    }

    async function fetchNonOilBulkCargo(month) {
      const response = await dispatch(
        api.endpoints.getData.initiate({
          columnName: "Cargo (General & Non-Oil In Bulk) (Thousand Tonnes)",
          date: `2023 ${month}`,
        })
      );
      return response.data;
    }
    async function fetchAllData() {
      const totalCargoData = [];

      for (let month of months) {
        const generalCargoData = await fetchGeneralCargo(month);
        const bulkCargoData = await fetchBulkCargo(month);
        const oilInBulkCargoData = await fetchOilInBulkCargo(month);
        const nonOilBulkCargoData = await fetchNonOilBulkCargo(month);

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
    }
    fetchAllData();
  }, [dispatch]);

  return (
    <>
      <DashboardBox gridArea="g"></DashboardBox>
      <DashboardBox gridArea="h">
        <BoxHeader
          title="Cargo Breakdown"
          subtitle="Consists of General, Bulk, Oil-In-Bulk, General & Non-Oil In Bulk (Thousand Tonnes)"
        />
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
      </DashboardBox>
      <DashboardBox gridArea="i"></DashboardBox>
      <DashboardBox gridArea="j"></DashboardBox>
    </>
  );
};

export default Row3;
