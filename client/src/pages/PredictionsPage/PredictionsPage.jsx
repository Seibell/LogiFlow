import React from "react";
import UploadForm from "./UploadForm";
import CargoChart from "./PredictionGraph";
import { Divider } from "@mui/material";

function PredictionsPage() {
  return (
    <div>
      <UploadForm />
      <CargoChart />
    </div>
  );
}

export default PredictionsPage;
