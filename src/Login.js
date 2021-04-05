import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { cookies } from "./Constants";
import { authenticate } from "./MainCommunication";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState(<></>);
  const [redirect, setRedirect] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  const setFailure = (message) => {
    setFeedback(<Alert variant="danger">{message}</Alert>);
    setIsDisabled(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // prevents the url to change directly
    setIsDisabled(true);
    authenticate(email, password)
      .then((response) => {
        cookies.set("token", response.data.token, {
          path: "/",
          maxAge: 60 * 60 * 24,
        });
        setRedirect(<Redirect to="/menu/" />);
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
    return redirect;
  } else {
    return (
      <Container>
        <Row className="justify-content-center mt-3">
          <Col xs={6}>
            <Form onSubmit={handleSubmit}>
              <fieldset disabled={isDisabled}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={handleEmail}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePassword}
                    required
                  />
                </Form.Group>
                <div className="w-100 justify-content-center d-flex">
                  <Button variant="primary" type="submit">
                    Sign In
                  </Button>
                </div>
              </fieldset>
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={6} className="d-flex justify-content-between">
            <Link to="/ask_reset/">Forgot your password?</Link>
            <Link to="/createaccount/">Create account</Link>
          </Col>
        </Row>
        <Row className="mt-3 justify-content-center">{feedback}</Row>
      </Container>
    );
  }
}

export default Login;
