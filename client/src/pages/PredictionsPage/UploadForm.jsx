import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "../../theme";

const theme = createTheme(themeSettings);

function UploadForm() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      date: "",
      vesselArrivals: "",
      vesselArrivalsShippingTonnage: "",
      totalCargoThousandTonnes: "",
      cargoGeneralThousandTonnes: "",
      cargoBulkThousandTonnes: "",
      cargoOilInBulkThousandTonnes: "",
      cargoGeneralAndNonOilInBulkThousandTonnes: "",
      totalContainerThroughput: "",
      bunkerSalesThousandTonnes: "",
      singaporeRegistryOfShipsNumber: "",
      singaporeRegistryOfShipsNumber000GT: "",
    },
    onSubmit: async (values) => {
      try {
        await axios.post("http://localhost:5000/api/upload", values);
        alert("Upload successful!");
        handleClose();
      } catch (error) {
        console.log(values);
        alert("Upload failed!");
      }
    },
  });

  return (
    <div>
      <Button color="secondary" variant="contained" onClick={handleClickOpen}>
        Upload Data
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Upload Monthly Data</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="date"
            label="Data Month/Year"
            type="month"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            value={formik.values.date}
            onChange={formik.handleChange}
          />
          <TextField
            margin="dense"
            name="vesselArrivals"
            label="Vessel Arrivals (Number)"
            type="number"
            fullWidth
            value={formik.values.vesselArrivals}
            onChange={formik.handleChange}
          />
          <TextField
            margin="dense"
            name="vesselArrivalsShippingTonnage"
            label="Vessel Arrivals - Shipping Tonnage (Thousand Gross Tonnes)"
            type="number"
            fullWidth
            value={formik.values.vesselArrivalsShippingTonnage}
            onChange={formik.handleChange}
          />
          <TextField
            margin="dense"
            name="totalCargoThousandTonnes"
            label="Total Cargo (Thousand Tonnes)"
            type="number"
            fullWidth
            value={formik.values.totalCargoThousandTonnes}
            onChange={formik.handleChange}
          />
          <TextField
            margin="dense"
            name="cargoGeneralThousandTonnes"
            label="Cargo (General) (Thousand Tonnes)"
            type="number"
            fullWidth
            value={formik.values.cargoGeneralThousandTonnes}
            onChange={formik.handleChange}
          />
          <TextField
            margin="dense"
            name="cargoBulkThousandTonnes"
            label="Cargo (Bulk) (Thousand Tonnes)"
            type="number"
            fullWidth
            value={formik.values.cargoBulkThousandTonnes}
            onChange={formik.handleChange}
          />
          <TextField
            margin="dense"
            name="cargoOilInBulkThousandTonnes"
            label="Cargo (Oil-In-Bulk) (Thousand Tonnes)"
            type="number"
            fullWidth
            value={formik.values.cargoOilInBulkThousandTonnes}
            onChange={formik.handleChange}
          />
          <TextField
            margin="dense"
            name="cargoGeneralAndNonOilInBulkThousandTonnes"
            label="Cargo (General & Non-Oil In Bulk) (Thousand Tonnes)"
            type="number"
            fullWidth
            value={formik.values.cargoGeneralAndNonOilInBulkThousandTonnes}
            onChange={formik.handleChange}
          />
          <TextField
            margin="dense"
            name="totalContainerThroughput"
            label="Total Container Throughput (Thousand Twenty-Foot Equivalent Units)"
            type="number"
            fullWidth
            value={formik.values.totalContainerThroughput}
            onChange={formik.handleChange}
          />
          <TextField
            margin="dense"
            name="bunkerSalesThousandTonnes"
            label="Bunker Sales (Thousand Tonnes)"
            type="number"
            fullWidth
            value={formik.values.bunkerSalesThousandTonnes}
            onChange={formik.handleChange}
          />
          <TextField
            margin="dense"
            name="singaporeRegistryOfShipsNumber"
            label="Singapore Registry Of Ships (End Of Period) - Number (Number)"
            type="number"
            fullWidth
            value={formik.values.singaporeRegistryOfShipsNumber}
            onChange={formik.handleChange}
          />
          <TextField
            margin="dense"
            name="singaporeRegistryOfShipsNumber000GT"
            label="Singapore Registry Of Ships (End Of Period) - '000 GT (Thousand Gross Tonnes)"
            type="number"
            fullWidth
            value={formik.values.singaporeRegistryOfShipsNumber000GT}
            onChange={formik.handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={formik.handleSubmit} color="secondary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UploadForm;
