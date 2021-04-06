import { StaticMathField } from "react-mathquill";
import React from "react";
import { Alert, Button, Col, InputGroup, Row } from "react-bootstrap";
import MathQuillElement from "./MathQuillElement";

export function splitLatex(s) {
  return s.split("$");
}

export function replaceMathbb(match, group0) {
  return "\\" + group0;
}

export function preprocessLatex(s) {
  return s.replace(/\\mathbb\{(\w)\}/g, replaceMathbb);
}

export const getOutput = (index, value) => {
  if (index % 2 === 0) {
    return <span key={index}>{value}</span>;
  } else {
    return (
      <StaticMathField key={index}>{preprocessLatex(value)}</StaticMathField>
    );
  }
};

export const clearAfter = (index, proofs) => {
  for (let i = index; i < proofs.length; i++) {
    proofs[i].goal = "";
    proofs[i].sentences = [];
  }
};

export function Sentence({ ident, sentence }) {
  return (
    <Row className="mb-3">
      <Col xs={8}>
        <Alert variant="dark">
          ({ident}) :{" "}
          {splitLatex(sentence).map((val, index) => getOutput(index, val))}
        </Alert>
      </Col>
    </Row>
  );
}

export function Goal({ goal }) {
  return (
    <Col xs={4}>
      <Alert variant="dark">
        {splitLatex(goal).map((val, index) => getOutput(index, val))}
      </Alert>
    </Col>
  );
}

export function HypothesisLine({
  ident,
  onChange,
  onDelete,
  initItems = [{ id: 0, value: "" }],
}) {
  return (
    <Row className="mb-3">
      <Col xs={8}>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>{ident}</InputGroup.Text>
          </InputGroup.Prepend>
          <MathQuillElement setValue={onChange} initItems={initItems} />
          <InputGroup.Append>
            <Button onClick={onDelete}>-</Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
    </Row>
  );
}
