import React, { useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Alert,
  Form,
  FormControl,
  FormGroup,
} from "react-bootstrap";
import { ROOT_URL } from "./Constants";

function Sentence(props) {
  const [value, setValue] = useState("");
  const [proofSentence, setProofSentence] = useState("");
  const [proofs, setProofs] = useState("");
  const [args, setArgs] = useState("");
  const [children, setChildren] = useState([]);
  const handleValue = (event) => {
    setValue(event.target.value);
  };
  const handleProofSentence = (event) => {
    setProofSentence(event.target.value);
  };
  const handleProofs = (event) => {
    setProofs(event.target.value);
  };
  const handleArgs = (event) => {
    setArgs(event.target.value);
  };
  const addChild = (event) => {
    setChildren(
      children.concat([
        <Sentence
          tab={props.tab + 1}
          number={children.length + 1}
          idx={children.length + 1}
        />,
      ])
    );
  };
  return (
    <>
      <Row>
        <Col xs={{ span: 1, offset: props.tab }}>
          <Form.Label>{props.number}</Form.Label>
        </Col>
        <Col xs={10 - props.tab}>
          <Form.Control type="text" onChange={handleValue} value={value} />
        </Col>
        <Col xs={1}>
          <Button variant="primary" onClick={addChild}>
            +
          </Button>
        </Col>
      </Row>
      {children}
      <Row>
        <Col xs={{ span: 2, offset: props.tab }}>
          <Form.Label>Proof:</Form.Label>
        </Col>
        <Col xs={10 - props.tab}>
          <Form.Control
            type="text"
            onChange={handleProofSentence}
            value={proofSentence}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 2, offset: props.tab }}>
          <Form.Label>By using:</Form.Label>
        </Col>
        <Col xs={10 - props.tab}>
          <Form.Control type="text" onChange={handleProofs} value={proofs} />
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 2, offset: props.tab }}>
          <Form.Label>Args:</Form.Label>
        </Col>
        <Col xs={10 - props.tab}>
          <Form.Control type="text" onChange={handleArgs} value={args} />
        </Col>
      </Row>
    </>
  );
}

function StandAloneProof() {
  return (
    <Container>
      <Sentence tab={0} />
    </Container>
  );
}

export default StandAloneProof;
