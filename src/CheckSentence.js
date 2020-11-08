import React, { useState } from "react";
import { Card, Col, Container, Row, Button, Alert } from "react-bootstrap";
import { ROOT_URL } from "./Constants";
import { checkSentenceProof, checkSentenceXML } from "./FormalCommunication";

function CheckSentence() {
  const [value, setValue] = useState("");
  const [labelPanel, setLabelPanel] = useState(<></>);
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const errorPanel = (error) => {
    setLabelPanel(
      <Alert variant={"danger"} className={"w-100"}>
        {error}
      </Alert>
    );
  };
  const successPanel = () => {
    setLabelPanel(
      <Alert variant={"success"} className={"w-100"}>
        This is a correct sentence.
      </Alert>
    );
  };
  const submitSentence = () => {
    setLabelPanel(<></>);
    checkSentenceXML(value)
      .then((response) => {
        successPanel();
      })
      .catch((error) => {
        errorPanel(error.message);
      });
  };
  const handleTab = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;
      setValue(value.substring(0, start) + "   " + value.substring(end));
    }
  };
  return (
    <Container>
      <Row>
        <Col>
          <textarea
            className={"w-100"}
            value={value}
            onChange={handleChange}
            onKeyDown={handleTab}
            rows={20}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            variant="primary"
            className={"w-100"}
            onClick={submitSentence}
          >
            Check Sentence
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>{labelPanel}</Col>
      </Row>
    </Container>
  );
}

export default CheckSentence;
