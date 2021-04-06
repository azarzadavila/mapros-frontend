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

export function ProofLine({
  onChange,
  onDelete,
  goal,
  onAskState,
  sentences,
  leanMsg,
  initItems = [{ id: 0, value: "" }],
}) {
  let leanAlert;
  if (leanMsg) {
    leanAlert = (
      <Row className="mb-3">
        <Alert variant="primary" className="w-100">
          {leanMsg}
        </Alert>
      </Row>
    );
  } else {
    leanAlert = <></>;
  }
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
        <Goal goal={goal} />
      </Row>
      {sentences.map((sentence, index) => (
        <Sentence
          key={index}
          ident={sentence.ident}
          sentence={sentence.sentence}
        />
      ))}
      {leanAlert}
    </>
  );
}

export const getChangeWithResponse = (
  hypotheses,
  setHypotheses,
  setInitialMessage,
  proofs,
  setLeanIndex,
  setLeanError,
  setProofs
) => {
  return (data) => {
    const newHypotheses = hypotheses.slice();
    data.hypotheses_ident.forEach((ident, index) => {
      newHypotheses[index] = { ...newHypotheses[index] };
      newHypotheses[index].ident = ident;
    });
    setHypotheses(newHypotheses);
    setInitialMessage(data.initial_goal);
    const newProofs = proofs.slice();
    data.goals.forEach((state, index) => {
      newProofs[index] = { ...newProofs[index] };
      newProofs[index].goal = state;
    });
    data.sentences.forEach((cur_sentences, index) => {
      newProofs[index].sentences = cur_sentences;
    });
    clearAfter(data.goals.length, newProofs);
    setLeanIndex(data.goals.length - 1);
    if (data.error) {
      setLeanError(data.error);
    } else {
      setLeanError("NO MESSAGE");
    }
    setProofs(newProofs);
  };
};

export const deleteFromList = (list, setList) => {
  return (index) => {
    return (event) => {
      const newListStart = list.slice(0, index);
      const newListEnd = list.slice(index + 1, list.length);
      const newList = newListStart.concat(newListEnd);
      setList(newList);
    };
  };
};

export const getHandleProofChange = (proofs, setProofs) => {
  return (index) => {
    return (value) => {
      const newProofs = proofs.slice();
      newProofs[index] = { ...newProofs[index] };
      newProofs[index].text = value;
      setProofs(newProofs);
    };
  };
};
