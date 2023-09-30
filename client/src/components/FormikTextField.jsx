/* eslint-disable react/prop-types */
import { TextField } from "@mui/material";
import { FastField } from "formik";

const getNestedObject = (nestedObj, pathArr) => {
  return pathArr.reduce(
    (obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : undefined),
    nestedObj
  );
};

const FormikTextField = ({ label, name, type = "text", ...otherProps }) => {
  return (
    <FastField name={name}>
      {({ field, form }) => {
        const namePath = name.split(".");
        const errorValue = getNestedObject(form.errors, namePath);
        const wasTouched = getNestedObject(form.touched, namePath);

        return (
          <TextField
            {...field}
            label={label}
            error={Boolean(wasTouched && errorValue)}
            helperText={wasTouched && errorValue ? errorValue : ""}
            fullWidth
            margin="normal"
            InputProps={{
              inputProps: {
                style: { color: "blue" },
              },
            }}
            {...otherProps}
            type={type}
          />
        );
      }}
    </FastField>
  );
};

export default FormikTextField;
