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

export async function post(url, content) {
  return fetch(ROOT_URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  }).then(
    (response) => {
      if (!response.ok) {
        throw response.json();
      }
      return response.json().catch((error) => {
        return {};
      });
    },
    (networkError) => {
      throw { networkError: networkError.message };
    }
  );
}

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
      post(url, value)
        .then((response) => {
          setLabelResult(
            <Alert variant="success" className="w-100">
            </Alert>
          );
        })
        .catch((error) => {
          setLabelResult(
            <Alert variant="danger" className="w-100">
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
