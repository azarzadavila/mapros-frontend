import React, { useState } from "react";
import { Card, Col, Container, Row, Button, Alert } from "react-bootstrap";
import { ROOT_URL } from "./Constants";

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
    fetch(ROOT_URL + "check_sentence/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        xml: value,
      }),
    })
      .then(
        (response) => {
          if (!response.ok) {
            response.text().then((error) => {
              console.log(error);
            });
            throw new Error("This is not a correct sentence !");
          }
        },
        (networkError) => {
          console.log(networkError.message);
          throw new Error("Network Error");
        }
      )
      .then(() => {
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
