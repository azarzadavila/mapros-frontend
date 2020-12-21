import React, { useEffect, useReducer, useState, createRef } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";

addStyles();

function Premise(props) {
  return (
    <Row>
      <Col xs={{ span: 9, offset: 2 }}>
        <EditableMathField className={"w-100"} />
      </Col>
      <Col xs={1}>
        <Button>+</Button>
      </Col>
    </Row>
  );
}

function Intervals() {
  const [question, setQuestion] = useState("");
  const onChangeQuestion = (mathField) => {
    setQuestion(mathField.latex());
  };
  return (
    <Container>
      <Premise />
      <Row>
        <Col xs={2}>
          <label className={"w-100"}>Ask :</label>
        </Col>
        <Col xs={10}>
          <EditableMathField latex={question} onChange={onChangeQuestion} />
        </Col>
      </Row>
      <Row>
        <Col xs={2}>
          <Button className={"w-100"}>Compute</Button>
        </Col>
        <Col xs={10}>
          <StaticMathField>{"\\frac{a}{\\beta}"}</StaticMathField>
        </Col>
      </Row>
    </Container>
  );
}

export default Intervals;
