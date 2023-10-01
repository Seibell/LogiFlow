/* eslint-disable react/prop-types */
import DashboardBox from "../../components/DashboardBox";
import BoxHeader from "../../components/BoxHeader";
import { useState } from "react";
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

const Row2 = ({ onChangeYearSetting }) => {
  const { palette } = useTheme();
  const [yearSetting, setYearSetting] = useState(2023);
  const years = Array.from(
    { length: 2023 - 1995 + 1 },
    (_, i) => 1995 + i
  ).reverse();

  const handleOnChange = (year) => {
    onChangeYearSetting(year);
    setYearSetting(year);
  };

  return (
    <>
      <DashboardBox gridArea="d">
        <BoxHeader title="Heatmap" subtitle="Ship activity over time" />
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
      <DashboardBox gridArea="f"></DashboardBox>
    </>
  );
};

export default Row2;
