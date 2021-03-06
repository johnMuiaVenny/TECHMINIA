import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/fontawesome-free-solid";

import { closeModal } from "@redq/reuse-modal";
import Error500 from "components/Error/Error500";
import FormikControl from "containers/FormikContainer/FormikControl";
import { AuthContext } from "contexts/auth/auth.context";
import { Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useHistory, useLocation } from "react-router-dom";
import {
  addArrayToLocalStorage,
  addObjectToLocalStorageObject,
  parseJwt,
  unhashPassword,
} from "utils";
import { axiosInstance, tokenConfig } from "utils/axios";
// import GoogleSocialAuth from "./GoogleSocialAuth";
import {
  Button,
  Container,
  Divider,
  LinkButton,
  Offer,
  OfferSection,
  Wrapper,
} from "./SignInOutForm.style";
import { loginValidationSchema } from "./validation.schema";
import { logToConsole } from "utils/logging";

export default function SignInModal() {
  const history = useHistory();
  const location = useLocation();
  const alert = useAlert();
  const path = location.pathname.replace(/\/+$/, "");
  const pathname = path[0] === "/" ? path.split("/")[1].trim() : path;
  const isAuthPage = pathname === "auth";
  const [initialValues, setInitialValues] = useState();
  const { state, authDispatch } = useContext(AuthContext);
  const [error, setError] = useState(false);
  const [showPhone, setShowPhone] = useState(Boolean());
  const [showEmail, setShowEmail] = useState(Boolean());
  const [isLoading, setIsLoading] = useState(Boolean());
  const [showPhoneVerify, setShowPhoneVerify] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("darasa_auth_profile") !== null) {
      setInitialValues({
        login: JSON.parse(localStorage.getItem("darasa_auth_profile")).email,
        password: unhashPassword(),
      });
    } else {
      setInitialValues({
        login: "",
        password: "",
      });
    }
  }, []);

  const toggleSignUpForm = () => {
    authDispatch({
      type: "SIGNUP",
    });
    // alert(isAuthPage);
    if (!isAuthPage) {
      closeModal();
      history.push("/auth");
    }
  };

  const toggleForgotPassForm = () => {
    authDispatch({
      type: "FORGOTPASS",
    });
  };
  const togglePhoneVerifyForm = () => {
    authDispatch({
      type: "PHONEVERIFICATION",
    });
  };

  const onSubmit = async (values, { setErrors, setSubmitting }) => {
    setIsLoading(true);
    setSubmitting(true);
    const body = values;
    logToConsole("body", body);
    if (showPhone) {
      body["login"] = `+${body.login.replace("+", "")}`;
    }
    setTimeout(() => {
      // call the login function
      // setLogin(true);
      // setLoginDetails(values);

      axiosInstance
        .post(`/auth/login/`, body)
        .then(async (res) => {
          logToConsole("data received", res);

          const userPayload = parseJwt(res.data.token.refresh);
          logToConsole("user payload", userPayload);
          const roles = userPayload.role;
          localStorage.removeItem("darasa_auth_roles");
          addArrayToLocalStorage("darasa_auth_roles", roles);
          // eslint-disable-next-line no-unused-vars

          var payload = {};

          let extraPayloadData = {
            token: res.data.token,
          };
          // hashPassword(values.password_confirm);
          // eslint-disable-next-line no-unused-vars
          payload = { ...payload, ...extraPayloadData };
          await addObjectToLocalStorageObject("darasa_auth_payload", payload);

          if (typeof window !== "undefined") {
            await localStorage.setItem(
              "access_token",
              `${res.data.token.access}`
            );
            await localStorage.setItem(
              "refresh_token",
              `${res.data.token.refresh}`
            );
            // closeModal();
          }
          // CHECK TOKEN & LOAD USER
          await axiosInstance
            .get(`/auth/profile/`, tokenConfig())
            .then(async (res) => {
              let auth_profile = res.data;
              addObjectToLocalStorageObject(
                "darasa_auth_profile",
                auth_profile
              );
              alert.success("Redirecting ...");
              authDispatch({
                type: "UPDATE",
                payload: {
                  ...state,
                  profile: auth_profile,
                },
              });
              await new Promise((resolve) => setTimeout(resolve, 500));
              setSubmitting(false);
              setIsLoading(false);
            })
            .catch((err) => {
              if (err.response) {
                setErrors(err.response.data);
              } else {
                setError(err);
              }
              logToConsole(err.response.status);
              setSubmitting(false);
              setIsLoading(false);
            });

          await new Promise((resolve) => setTimeout(resolve, 3000));
          logToConsole("response", res);
          history.push("/dashboard");
        })
        .catch((err) => {
          if (err.response) {
            setErrors(
              err.response.data.detail === "Login or password invalid."
                ? {
                    password: `Incorrect password or ${
                      showPhone ? "phone" : "email"
                    }`,
                  }
                : {
                    password: err.response.data.detail,
                  }
            );
            if (err.response.data.detail === "Phone Number Not Activated") {
              setShowPhoneVerify(true);
            }
          } else {
            setError(err);
          }

          logToConsole(err);
          setSubmitting(false);
          setIsLoading(false);
        });

      var payload = {};
      let email = { email: values.email, secret: values.password };
      payload = { ...payload, ...email };
      addObjectToLocalStorageObject("darasa_auth_payload", payload);
    }, 500);
  };

  if (error) {
    return <Error500 err={error} />;
  }

  const LoginForm = (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={() => loginValidationSchema(showPhone)}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Form>
            <FormikControl
              control="input"
              type={showPhone ? "phone" : "email"}
              label={showPhone ? "Phone" : "Email"}
              name="login"
            />
            <FormikControl
              control="input"
              type="password"
              label="Password"
              name="password"
            />
            {showPhoneVerify && (
              <OfferSection>
                <Offer>
                  Click
                  <LinkButton onClick={togglePhoneVerifyForm}>here</LinkButton>
                  to verify phone
                </Offer>
              </OfferSection>
            )}

            <Button
              type="submit"
              disabled={!formik.isValid}
              fullwidth
              isLoading={isLoading}
              title={formik.isSubmitting ? "Loging you in... " : "Log in"}
              style={{
                margin: "10px 0",
                background: showPhone ? "#ec7623" : "#652e8d",
                color: "#ffffff",
              }}
            />
          </Form>
        );
      }}
    </Formik>
  );

  const handlePhoneButtonClick = (e) => {
    e.preventDefault();

    setShowPhone(true);
    setShowEmail(false);
    setInitialValues({
      login: "",
      password: "",
    });
  };

  const handleEmailButtonClick = (e) => {
    e.preventDefault();

    setShowPhone(false);
    setShowEmail(true);
    setInitialValues({
      login: "",
      password: "",
    });
  };

  return (
    <Wrapper>
      <Container>
        {showPhone && LoginForm}
        {!showPhone && (
          <Button
            fullwidth
            title={
              <>
                <FontAwesomeIcon icon={faPhone} className="mr-2" /> Log in using
                phone
              </>
            }
            onClick={handlePhoneButtonClick}
            style={{
              margin: "10px 0",
              background: "#ec7623",
              color: "#ffffff",
            }}
          />
        )}
        <Divider>
          <span>or</span>
        </Divider>
        {showEmail && LoginForm}
        {!showEmail && (
          <Button
            fullwidth
            title={
              <>
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Log in
                using email
              </>
            }
            onClick={handleEmailButtonClick}
            style={{ margin: "10px 0", color: "#ffffff" }}
          />
        )}

        {/* <GoogleSocialAuth /> */}

        <Offer style={{ padding: "20px 0" }}>
          Don't have any account?{" "}
          <LinkButton onClick={toggleSignUpForm}>Sign Up</LinkButton>
        </Offer>
      </Container>
      <OfferSection>
        <Offer>
          Forgot your password?
          <LinkButton onClick={toggleForgotPassForm}>Reset It</LinkButton>
        </Offer>
      </OfferSection>
    </Wrapper>
  );
}
