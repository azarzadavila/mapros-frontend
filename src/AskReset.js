import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button, Container, Form, Row } from "react-bootstrap";
import { askReset } from "./MainCommunication";

function AskReset() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [feedback, setFeedBack] = useState(<></>);
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const setFailure = (message) => {
    setFeedBack(<Alert variant="danger">{message}</Alert>);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsDisabled(true);
    askReset(email)
      .then(() => {
        setFeedBack(
          <Alert variant="success">
            An email was sent to the address for resetting your password.
          </Alert>
        );
      })
      .catch((error) => {
        setIsDisabled(false);
        if (error.response && error.response.data.detail) {
          setFailure(error.response.data.detail);
        } else {
          setFailure("ERROR");
        }
      });
  };
  return (
    <Container>
      <Row>
        Please enter the email address of your account to ask for a password
        reset.
      </Row>
      <Form onSubmit={handleSubmit}>
        <fieldset disabled={isDisabled}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={handleEmail}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </fieldset>
      </Form>
      <Row>{feedback}</Row>
    </Container>
  );
}

export default AskReset;
