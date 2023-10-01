import React from "react";
import UploadForm from "./UploadForm";
import CargoChart from "./PredictionGraph";

function PredictionsPage() {
  return (
    <div>
      <UploadForm />
      <CargoChart />
    </div>
  );
}

export default PredictionsPage;
