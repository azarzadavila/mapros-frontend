import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Alert,
  Button,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { cookies, ROOT_URL } from "./Constants";

const axios = require("axios").default;

function TestAPI() {
  const [toSend, setToSend] = useState("");
  const [code, setCode] = useState(null);
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [reqType, setReqType] = useState("get");
  const [isDisabled, setIsDisabled] = useState(false);
  const handleToSend = (event) => {
    setToSend(event.target.value);
  };
  const handleUrl = (event) => {
    setUrl(event.target.value);
  };
  const handleReqType = (event) => {
    setReqType(event.target.value);
  };
  async function send() {
    const token = cookies.get("token");
    const headers = { Authorization: "Token " + token };
    if (reqType === "get") {
      return axios.get(ROOT_URL + url, { headers: headers });
    } else if (reqType === "post") {
      return axios.post(ROOT_URL + url, JSON.parse(toSend), {
        headers: headers,
      });
    }
    throw Error("Unrecognized request type");
  }
  const setResponse = (response) => {
    setCode(response.status);
    setMessage(JSON.stringify(response.data));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // prevents the url to change directly
    setIsDisabled(true);
    send()
      .then((response) => {
        setResponse(response);
      })
      .catch((error) => {
        if (error.response) {
          setResponse(error.response);
        } else {
          setCode("0");
          setMessage(error.message);
        }
      })
      .then(() => setIsDisabled(false));
  };
  return (
    <Container>
      <Row className="w-100 justify-content-center">
        <Form className="w-100 mb-3" onSubmit={handleSubmit}>
          <fieldset disabled={isDisabled}>
            <Form.Group controlId="formUrl">
              <Form.Label>URL</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>{ROOT_URL}</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="form-control"
                  placeholder={"Enter url"}
                  value={url}
                  onChange={handleUrl}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="formReqType">
              <Form.Label>Request Type</Form.Label>
              <Form.Control as="select" onChange={handleReqType}>
                <option value="get">GET</option>
                <option value="post">POST</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId={"formToSend"}>
              <Form.Label>JSON to send</Form.Label>
              <Form.Control
                className="w-100"
                as="textarea"
                value={toSend}
                onChange={handleToSend}
              />
            </Form.Group>
            <div className="w-100 d-flex justify-content-center">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </fieldset>
        </Form>
      </Row>
      <Row>
        <Alert variant={"primary"} className="w-100">
          Status Code : {code}
          <br />
          {message}
        </Alert>
      </Row>
    </Container>
  );
}

export default TestAPI;
