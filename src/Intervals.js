import React, { useEffect, useReducer, useState, createRef } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";
import { v4 as uuid4 } from "uuid";
import { askQuestion } from "./IntervalsCommunication";

addStyles();

function getIndex(list, id) {
  let i = 0;
  while (i < list.length) {
    if (list[i].id === id) {
      return i;
    }
    i++;
  }
  throw new Error();
}

const initialPremises = [{ id: "id" + uuid4(), value: "" }];

const premisesReducer = (premises, action) => {
  switch (action.type) {
    case "update":
      return premises.map((premise) => {
        if (premise.id === action.id) {
          return { ...premise, value: action.value };
        }
        return premise;
      });
    case "add":
      const index = getIndex(premises, action.id);
      const startPremises = premises.slice(0, index + 1);
      const endPremises = premises.slice(index + 1, premises.length);
      const newElem = { id: "id" + uuid4(), value: "" };
      return startPremises.concat([newElem], endPremises);
    default:
      throw new Error();
  }
};

function Premise({ latex, onChange, add }) {
  return (
    <Row>
      <Col xs={{ span: 9, offset: 2 }}>
        <EditableMathField
          className={"w-100"}
          latex={latex}
          onChange={(mathField) => onChange(mathField.latex())}
        />
      </Col>
      <Col xs={1}>
        <Button onClick={() => add()}>+</Button>
      </Col>
    </Row>
  );
}

function Intervals() {
  const [question, setQuestion] = useState("");
  const onChangeQuestion = (mathField) => {
    setQuestion(mathField.latex());
  };
  const [premises, premisesDispatch] = useReducer(
    premisesReducer,
    initialPremises
  );
  const handlePremiseChange = (id) => {
    return (value) =>
      premisesDispatch({ type: "update", value: value, id: id });
  };
  const handleAdd = (id) => {
    return () => premisesDispatch({ type: "add", id: id });
  };
  const [answer, setAnswer] = useState("");
  const handleAsk = () => {
    const premisesSent = premises.map((premise) => premise.value);
    askQuestion(premisesSent, question)
      .then((response) => {
        setAnswer(response.data.answer);
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  return (
    <Container>
      {premises.map((premise) => {
        return (
          <Premise
            key={premise.id}
            latex={premise.value}
            onChange={handlePremiseChange(premise.id)}
            add={handleAdd(premise.id)}
          />
        );
      })}
      <Row>
        <Col xs={2}>
          <label className={"w-100"}>Ask :</label>
        </Col>
        <Col xs={10}>
          <EditableMathField
            className={"w-100"}
            latex={question}
            onChange={onChangeQuestion}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={2}>
          <Button className={"w-100"} onClick={handleAsk}>
            Compute
          </Button>
        </Col>
        <Col xs={10}>
          <StaticMathField className={"w-100"}>{answer}</StaticMathField>
        </Col>
      </Row>
    </Container>
  );
}

export default Intervals;
