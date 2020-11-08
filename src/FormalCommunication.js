import React, { useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Alert,
  Form,
  FormControl,
  FormGroup,
} from "react-bootstrap";
import { ROOT_URL } from "./Constants";
const axios = require("axios").default;

export function FormalCommuncation() {
  const [value, setValue] = useState("");
  const [url, setURL] = useState("");
  const [labelResult, setLabelResult] = useState(<></>);
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleURL = (event) => {
    setURL(event.target.value);
  };
  const send = (event) => {
    try {
      const data = JSON.parse(value);
      axios
        .post(ROOT_URL + url, data)
        .then((response) => {
          setLabelResult(
            <Alert variant="success" className="w-100">
              <em>Status Code : {response.status}</em>
              <br />
              {JSON.stringify(response.data)}
            </Alert>
          );
        })
        .catch((error) => {
          setLabelResult(
            <Alert variant="danger" className="w-100">
              <span>{error.message}</span>
              <br />
              <em>Status Code : {error.response.status}</em>
              <br />
              {JSON.stringify(error.response.data)}
            </Alert>
          );
        });
    } catch (e) {
      setLabelResult(
        <Alert variant="danger" className="w-100">
          Bad JSON
        </Alert>
      );
    }
  };
  return (
    <Container>
      <Row>
        <Col>
          <FormGroup>
            <Form.Label>URL</Form.Label>
            <Form.Control type="url" onChange={handleURL} value={url} />
          </FormGroup>
          <FormGroup>
            <Form.Label>Data to send</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              onChange={handleChange}
              value={value}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="primary" onClick={send}>
            Send
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="mt-2">Result</h2>
        </Col>
      </Row>
      <Row>
        <Col>{labelResult}</Col>
      </Row>
    </Container>
  );
}
