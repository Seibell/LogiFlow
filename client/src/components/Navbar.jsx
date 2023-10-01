import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FlexedBox from "./FlexedBox";

function Navbar() {
  const { palette } = useTheme();
  const [active, setActive] = useState("dashboard");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setActive("dashboard");
    } else if (location.pathname === "/predictions") {
      setActive("predictions");
    } else if (location.pathname === "/Simulation") {
      setActive("Simulations");
    }
  }, [location.pathname]);

  return (
    <FlexedBox mb="0.25rem" p="0.5rem 0rem" color={palette.grey[300]}>
      {/** LEFT SIDE */}
      <FlexedBox gap="0.75rem">
        <LocalShippingIcon sx={{ fontsize: "28px" }} />
        <Typography variant="h4" fontSize="16px">
          PSA LogiFlow
        </Typography>
      </FlexedBox>

      {/** RIGHT SIDE */}
      <FlexedBox gap="2rem">
        <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
          <Link
            to="/"
            onClick={() => setActive("dashboard")}
            style={{
              color: active === "dashboard" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            }}
          >
            Dashboard
          </Link>
        </Box>
        <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
          <Link
            to="/predictions"
            onClick={() => setActive("predictions")}
            style={{
              color: active === "predictions" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            }}
          >
            Predictions
          </Link>
        </Box>
        <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
          <Link
            to="/Simulation"
            onClick={() => setActive("Simulations")}
            style={{
              color: active === "Simulations" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            }}
          >
            Simulations
          </Link>
        </Box>
      </FlexedBox>
    </FlexedBox>
  );
}

export default Navbar;
