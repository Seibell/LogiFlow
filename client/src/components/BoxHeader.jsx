/* eslint-disable react/prop-types */
import { Box, Typography, useTheme } from "@mui/material";
import FlexedBox from "./FlexedBox";

const BoxHeader = ({ icon, title, subtitle, sideText }) => {
  const { palette } = useTheme();
  return (
    <FlexedBox color={palette.grey[400]} margin="1.5rem 1rem 0 1rem">
      <FlexedBox>
        {icon}
        <Box width="100%">
          <Typography variant="h4" mb="-0.1rem">
            {title}
          </Typography>
          <Typography variant="h6">{subtitle}</Typography>
        </Box>
      </FlexedBox>
      <Typography variant="h5" fontWeight="700" color={palette.secondary[500]}>
        {sideText}
      </Typography>
    </FlexedBox>
  );
};

export default BoxHeader;
