import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button, Container, Form, Row } from "react-bootstrap";
import { Redirect, useLocation } from "react-router-dom";
import { checkReset, resetPassword } from "./MainCommunication";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ResetPasswordForm({ tokenURL }) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState(<></>);
  const [redirect, setRedirect] = useState(false);
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  const setFailure = (message) => {
    setFeedback(<Alert variant="danger">{message}</Alert>);
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // prevents the url to change directly
    setIsDisabled(true);
    resetPassword(tokenURL, password)
      .then(() => {
        setFeedback(
          <Alert variant="success">
            Your password has been reset.
            <br />
            You will be redirected to the login page.
          </Alert>
        );
        setTimeout(() => setRedirect(true), 3000);
      })
      .catch((error) => {
        if (error.response && error.response.data.detail) {
          setFailure(error.response.data.detail);
        } else {
          setFailure("ERROR");
        }
      });
  };
  if (redirect) {
    return <Redirect to="/login/" />;
  }
  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <fieldset disabled={isDisabled}>
          <Form.Group controlId="formPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePassword}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </fieldset>
      </Form>
      <Row className={"mt-3"}>{feedback}</Row>
    </Container>
  );
}

function ResetPassword() {
  let query = useQuery();
  const [feedback, setFeedback] = useState(
    <Alert variant="primary">Checking link...</Alert>
  );
  const [resetForm, setResetForm] = useState(null);
  useEffect(() => {
    const tokenURL = query.get("token");
    if (tokenURL) {
      checkReset(tokenURL)
        .then(() => {
          setFeedback(<Alert variant="success">Resetting password...</Alert>);
          setResetForm(<ResetPasswordForm tokenURL={tokenURL} />);
        })
        .catch(() => {
          setFeedback(
            <Alert variant="danger">
              Incorrect URL token. It may be that the link is now outdated.
            </Alert>
          );
        });
    } else {
      setFeedback(<Alert variant="danger">No URL token provided</Alert>);
    }
  }, []);
  if (resetForm) {
    return resetForm;
  }
  return <Container>{feedback}</Container>;
}

export default ResetPassword;
