import { Button, Form, Input, Message } from "semantic-ui-react";
import { AxiosError } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ErrorMap } from "../../calls/interfaces/error-map";
import TokenHelper from "../../helpers/token-helper";
import { AuthorizationResult } from "../../calls/interfaces/authorization-result";
import LsiContext from "../../lsi/lsi-context";

import Calls from "../../calls/calls";
import "./auth-page.scss";
import Lsi from "./lsi";

interface Props {
  logout?: boolean;
}

function AuthPage(props: Props) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<undefined | string>();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const { lang } = useContext(LsiContext);
  const [registration, setRegistration] = useState<boolean>();
  const [disabledButton, setDisabledButton] = useState<boolean>();
  const [passwordError, setPasswordError] = useState<boolean>();

  useEffect(() => {
    if (props.logout) {
      Calls.auth.logout({}).then(() => {
        navigate("/");
      });
    }
  }, []);

  const tokenHelper = new TokenHelper();

  async function handleSubmit() {
    setDisabledButton(!disabledButton);
    setPasswordError(false);

    let authResult;

    if (registration && formData.password !== formData.confirmPassword) {
      setDisabledButton(!disabledButton);
      setPasswordError(true);
      return;
    }

    try {
      if (registration) {
        authResult = await Calls.auth.register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
      } else {
        authResult = await Calls.auth.login({
          email: formData.email,
          password: formData.password,
        });
      }
    } catch (e) {
      setDisabledButton(false);
      const error = e as AxiosError;
      const errorMap = error.response?.data as ErrorMap;
      return setErrorMessage(errorMap.message);
    }

    const authorizationResult: AuthorizationResult = authResult.data;

    tokenHelper.setToken(authorizationResult.token);
    navigate("/");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDisabledButton(false);
    setFormData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  }

  function handleRegister() {
    setRegistration(!registration);
  }

  return (
    <div className="form-container">
      <Form className="form-container__form" onSubmit={handleSubmit}>
        <h2>
          {registration ? Lsi.authorization[lang] : Lsi.authentication[lang]}
        </h2>
        <Form.Field>
          <Input
            placeholder={Lsi.enterEmail[lang]}
            type="email"
            name="email"
            onChange={handleChange}
            required
          />
        </Form.Field>
        <Form.Field>
          <Input
            placeholder={Lsi.enterPassword[lang]}
            type="password"
            name="password"
            onChange={handleChange}
            required
          />
        </Form.Field>
        {registration && (
          <>
            <Form.Field>
              <Input
                placeholder={Lsi.confirmPassword[lang]}
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                error={passwordError}
                required
              />
            </Form.Field>
            <Form.Field>
              <Input
                placeholder={Lsi.firstName[lang]}
                name="firstName"
                onChange={handleChange}
                error={passwordError}
                required
              />
            </Form.Field>
            <Form.Field>
              <Input
                placeholder={Lsi.lastName[lang]}
                name="lastName"
                onChange={handleChange}
                required
              />
            </Form.Field>
          </>
        )}
        {errorMessage && <Message color="red">{errorMessage}</Message>}
        <Button color="blue" type="submit" disabled={disabledButton}>
          {registration ? Lsi.authorization[lang] : Lsi.authentication[lang]}
        </Button>
        <div className="form-container__form-register-wrapper">
          <p className="form-container__form-register" onClick={handleRegister}>
            {!registration ? Lsi.register[lang] : Lsi.login[lang]}
          </p>
        </div>
      </Form>
    </div>
  );
}

export default AuthPage;
