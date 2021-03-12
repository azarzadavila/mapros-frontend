import React, { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";

function HypothesisLine({ ident, text, onChange, onDelete }) {
  return (
    <Row className="mb-3">
      <Col xs={8}>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>{ident}</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control value={text} onChange={onChange} />
          <InputGroup.Append>
            <Button onClick={onDelete}>-</Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
    </Row>
  );
}

function ProofLine({ text, onChange, onDelete }) {
  return (
    <Row className="mb-3">
      <Col xs={8}>
        <InputGroup>
          <Form.Control value={text} onChange={onChange} />
          <InputGroup.Append>
            <Button onClick={onDelete}>-</Button>
            <Button>S</Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
      <Col xs={4}>
        <Alert variant="dark">b_n \rightarrow l</Alert>
      </Col>
    </Row>
  );
}

let lastHyp = 0;
let lastProof = 0;

function MainView() {
  const [hypotheses, setHypotheses] = useState([]);
  const [proofs, setProofs] = useState([]);
  const addHypothesis = (event) => {
    const newHypotheses = hypotheses.slice();
    newHypotheses.push({ ident: "", text: "", id: lastHyp });
    setHypotheses(newHypotheses);
    lastHyp += 1;
  };
  const handleHypothesisChange = (index) => {
    return (event) => {
      const newHypotheses = hypotheses.slice();
      newHypotheses[index] = { ...newHypotheses[index] };
      newHypotheses[index].text = event.target.value;
      setHypotheses(newHypotheses);
    };
  };
  const deleteFromList = (list, setList) => {
    return (index) => {
      return (event) => {
        const newListStart = list.slice(0, index);
        const newListEnd = list.slice(index + 1, list.length);
        const newList = newListStart.concat(newListEnd);
        setList(newList);
      };
    };
  };
  const handleHypothesisDelete = deleteFromList(hypotheses, setHypotheses);
  const addProof = (event) => {
    const newProofs = proofs.slice();
    newProofs.push({ text: "", id: lastProof });
    setProofs(newProofs);
    lastProof += 1;
  };
  const handleProofChange = (index) => {
    return (event) => {
      const newProofs = proofs.slice();
      newProofs[index] = { ...newProofs[index] };
      newProofs[index].text = event.target.value;
      setProofs(newProofs);
    };
  };
  const handleProofDelete = deleteFromList(proofs, setProofs);
  return (
    <Container>
      <Row className="mb-3">
        <Col xs={8}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Theorem Name :</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control placeholder="name" aria-label="name" />
          </InputGroup>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={4}>
          If,
          <Button className="ml-3" onClick={addHypothesis}>
            +
          </Button>
        </Col>
      </Row>
      {hypotheses.map((hypothesis, index) => {
        return (
          <HypothesisLine
            ident={hypothesis.ident}
            text={hypothesis.text}
            key={hypothesis.id}
            onChange={handleHypothesisChange(index)}
            onDelete={handleHypothesisDelete(index)}
          />
        );
      })}
      <Row>
        <Col xs={8}>
          <label>Then,</label>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={8}>
          <Form.Control placeholder="goal" aria-label="goal" />
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          Proof:
          <Button className="ml-3 mb-3" onClick={addProof}>
            +
          </Button>
          <Button className="ml-3 mb-3">S</Button>
        </Col>
      </Row>
      {proofs.map((proof, index) => {
        return (
          <ProofLine
            text={proof.text}
            key={proof.id}
            onChange={handleProofChange(index)}
            onDelete={handleProofDelete(index)}
          />
        );
      })}
    </Container>
  );
}

export default MainView;
