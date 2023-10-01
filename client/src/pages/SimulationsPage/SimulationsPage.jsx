import CostSlider from "./CostSlider";
import { Box, Typography } from "@mui/material";

function SimulationsPage() {
    return (
        <Box
            width="100%"
            height="100%"
            display="grid"
            gap="0.5rem"
        >
            <Typography variant="h3" mb="">Key Port Indicator Simulator</Typography>
                
            <CostSlider />
            <Typography variant="h4" color="primary">Total Bunker Sales</Typography>
            <Typography variant="h4">TBA</Typography>
            <Typography variant="h4" color="primary">Total Cargo</Typography>
            <Typography variant="h4">TBA</Typography>
        </Box>
    );
}

export default SimulationsPage;