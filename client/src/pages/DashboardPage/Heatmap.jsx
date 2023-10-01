/* eslint-disable react/prop-types */
import { ResponsiveCalendar } from "@nivo/calendar";
import { generateHeatmapData } from "./heatmapData";
import { useTheme } from "@mui/material";

const Heatmap = ({ yearSetting = 2023 }) => {
  const data = generateHeatmapData(yearSetting);
  const { palette } = useTheme();

  // Calculate "from" and "to" dates based on yearSetting
  const from = new Date(yearSetting, 0, 1); // First day of the yearSetting year
  const to = new Date(yearSetting, 11, 31); // Last day of the yearSetting year

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <ResponsiveCalendar
      data={data}
      from={formatDate(from)}
      to={formatDate(to)}
      emptyColor={palette.grey[900]}
      colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
      margin={{ top: 20, right: 25, bottom: 15, left: 20 }}
      yearSpacing={40}
      monthBorderColor={palette.grey[800]}
      dayBorderWidth={2}
      dayBorderColor={palette.background.light}
      theme={{
        textColor: palette.grey[500],
        fontSize: 12,
        tooltip: {
          container: {
            background: palette.background.light,
            color: palette.grey.main,
            fontSize: "inherit",
            borderRadius: "2px",
            boxShadow: "none",
            padding: "10px 14px",
          },
        },
      }}
    />
  );
};

export default Heatmap;
