import { StaticMathField } from "react-mathquill";
import React from "react";
import { Button, Col, InputGroup, Row } from "react-bootstrap";
import MathQuillElement from "./MathQuillElement";
import ReadExpression from "./ReadExpression";

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

export function ProofLine({
  onChange,
  onDelete,
  goal,
  isGoalLean,
  onAskState,
  sentences,
  initItems = [{ id: 0, value: "" }],
}) {
  return (
    <>
      <Row className="mb-3">
        <Col xs={8}>
          <InputGroup>
            <MathQuillElement setValue={onChange} initItems={initItems} />
            <InputGroup.Append>
              <Button onClick={onDelete}>-</Button>
              <Button onClick={onAskState}>S</Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
        <Col xs={4}>
          <ReadExpression variant="goal" isLean={isGoalLean}>
            {goal}
          </ReadExpression>
        </Col>
      </Row>
      {sentences.map((sentence, index) => (
        <Row className="mb-3">
          <Col xs={8}>
            <ReadExpression
              key={index}
              variant="sentence"
              isLean={sentence.isLean}
              ident={sentence.ident}
            >
              {sentence.sentence}
            </ReadExpression>
          </Col>
        </Row>
      ))}
    </>
  );
}

export const deleteFromList = (list, setList) => {
  return (index) => {
    return () => {
      const newListStart = list.slice(0, index);
      const newListEnd = list.slice(index + 1, list.length);
      const newList = newListStart.concat(newListEnd);
      setList(newList);
    };
  };
};
