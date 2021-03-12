import React, { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

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

let lastHyp = 0;

function MainView() {
  const [hypotheses, setHypotheses] = useState([]);
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
  const handleHypothesisDelete = (index) => {
    return (event) => {
      const newHypothesesStart = hypotheses.slice(0, index);
      const newHypothesesEnd = hypotheses.slice(index + 1, hypotheses.length);
      const newHypotheses = newHypothesesStart.concat(newHypothesesEnd);
      setHypotheses(newHypotheses);
    };
  };
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
          <Button className="ml-3 mb-3">+</Button>
          <Button className="ml-3 mb-3">S</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default MainView;
