import React, { useEffect, useReducer, useState, createRef } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";
import {v4 as uuid4} from "uuid";

addStyles();

function Premise(props) {
  return (
    <Row>
      <Col xs={{ span: 9, offset: 2 }}>
        <EditableMathField
          className={"w-100"}
          latex={props.latex}
          onChange={props.onChange}
        />
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
  const [premises, setPremises] = useState([""]);
  const onPremiseChange = (index) => {
    return (mathField) => {
      const newPremises = premises.slice();
      newPremises[index] = mathField.latex();
      setPremises(newPremises);
    };
  };
  return (
    <Container>
      {premises.map((premise, index) => {
        return (
          <Premise
            key={index}
            latex={premise}
            onChange={onPremiseChange(index)}
          />
        );
      })}
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
