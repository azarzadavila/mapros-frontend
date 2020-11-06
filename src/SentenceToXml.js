import React, { useState } from "react";
import { Card, Col, Container, Row, Button, Alert } from "react-bootstrap";
import { ROOT_URL } from "./Constants";

function SuccessLabel(props) {
  return <Alert variant="primary" className={"w-100"}>{props.result}</Alert>;
}

function FailLabel(props) {
  return (
    <Alert variant="danger" className={"w-100"}>
      {props.result}
    </Alert>
  );
}

function SentenceToXml() {
  const [labelResult, setLabelResult] = useState(<></>);
  const [sentence, setSentence] = useState("");
  const transformToXml = (event) => {
    setLabelResult(<></>);
    fetch(ROOT_URL + "text_to_xml/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sentence: sentence,
      }),
    })
      .then(
        (response) => {
          if (!response.ok) {
            throw new Error("Conversion failed");
          }
          return response.json();
        },
        (networkError) => {
          throw new Error("Network error");
        }
      )
      .then((jsonResponse) => {
        setLabelResult(<SuccessLabel result={jsonResponse.xml} />);
      })
      .catch((error) => {
        setLabelResult(<FailLabel result={error.message} />);
      });
  };
  const handleChange = (event) => {
    setSentence(event.target.value);
  };
  return (
    <Container>
      <Row>
        <textarea
          className={"w-100"}
          onChange={handleChange}
          value={sentence}
        />
      </Row>
      <Row className={"justify-content-center"}>
        <Button className={"w-50"} onClick={transformToXml}>
          Transform To XML
        </Button>
      </Row>
      <Row>
        <Col>{labelResult}</Col>
      </Row>
    </Container>
  );
}

export default SentenceToXml;
