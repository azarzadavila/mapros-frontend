import React, { useState } from "react";
import { Alert, Button, Container, Form, Row } from "react-bootstrap";
import { createAccount } from "./MainCommunication";

function CreateAccount() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedBack] = useState(<></>);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };
  const handleLastName = (event) => {
    setLastName(event.target.value);
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  const setSuccess = () => {
    setFeedBack(
      <Alert variant="success">
        The account creation was successful you should receive a confirmation
        email.
      </Alert>
    );
  };
  const setFailure = (message) => {
    setFeedBack(<Alert variant="danger">{message}</Alert>);
    setIsDisabled(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // prevents the url to change directly
    setIsDisabled(true);
    createAccount(firstName, lastName, email, password)
      .then((response) => {
        setSuccess();
      })
      .catch((error) => {
        if (error.response && error.response.data.detail) {
          setFailure(error.response.data.detail);
        } else if (error.response) {
          console.log(error.response);
          setFailure(JSON.stringify(error.response.data));
        } else {
          setFailure("ERROR");
        }
      });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <fieldset disabled={isDisabled}>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="form-control"
              placeholder="Enter first name"
              value={firstName}
              onChange={handleFirstName}
              required
            />
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="form-control"
              placeholder="Enter last name"
              value={lastName}
              onChange={handleLastName}
              required
            />
          </Form.Group>
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
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </fieldset>
      </Form>
      <Row className={"mt-3"}>{feedback}</Row>
    </Container>
  );
}

export default CreateAccount;
