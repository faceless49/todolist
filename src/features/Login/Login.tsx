import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormikHelpers, useFormik } from "formik";
import { useSelector } from "react-redux";
import { loginTC } from "./auth-reducer";
import { AppRootStateType, useAppDispatch } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { FormikErrorType } from "../../api/todolist-api";

type FormValuesType = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export const Login = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate(); // * Test hook

  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    (state) => state.auth.isLoggedIn
  );
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: Partial<FormikErrorType> = {};
      if (!values.email) {
        errors.email = "Required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
      return errors;
    },
    onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
      const action = await dispatch(loginTC(values));
      if (loginTC.rejected.match(action)) {
        if (action.payload?.fieldsErrors?.length) {
          const error = action.payload.fieldsErrors[0];
          formikHelpers.setFieldError(error.field, error.error);
        }
      }
      // if (res === 'bad') show error
      // formik.resetForm();
    },
  });

  // formik.setFieldValue('email', 'value')

  // if (isLoggedIn) {
  //   return <Navigate to={"/"} />;
  // }
  if (isLoggedIn) navigate("/");

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a
                  href={"https://social-network.samuraijs.com/"}
                  target={"_blank"}
                >
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                // name="email"
                // onChange={formik.handleChange}
                // value={formik.values.email}
                // onBlur={formik.handleBlur}
                {...formik.getFieldProps("email")}
              />
              {/*{formik.touched.email && formik.errors.email ? (*/}
              {/*  <div style={{ color: "red" }}>{formik.errors.email}</div>*/}
              {/*) : null}       */}

              {formik.touched.email && formik.errors.email && (
                <div style={{ color: "red" }}>{formik.errors.email}</div>
              )}
              <TextField
                type="password"
                label="Password"
                margin="normal"
                // name="password"
                // onChange={formik.handleChange}
                // value={formik.values.password}
                // onBlur={formik.handleBlur}
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password ? (
                <div style={{ color: "red" }}>{formik.errors.password}</div>
              ) : null}
              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox />}
                name="rememberMe"
                onChange={formik.handleChange}
                value={"rememberMe"}
                checked={formik.values.rememberMe}
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
