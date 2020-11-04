import React, { useState } from "react";
import { Card, Col, Container, Row, Button, Alert } from "react-bootstrap";

function Sentence(props) {
  const [children, setChildren] = useState(Array(0));
  const addChild = (event) => {
    setChildren(
      children.concat([
        <Sentence tab={props.tab + 1} number={children.length + 1} />,
      ])
    );
  };
  return (
    <>
      <Row>
        <Col md={{ span: 1, offset: props.tab }}>
          <label className={"w-100"}>{props.number}</label>
        </Col>
        <Col md={10 - props.tab}>
          <textarea className={"w-100"}></textarea>
        </Col>
        <Col md={1}>
          <Button onClick={addChild}>+</Button>
        </Col>
      </Row>
      {children}
    </>
  );
}

function ProofEditor() {
  return (
    <Container>
      <Sentence tab={1} number={1} />
    </Container>
  );
}

export default ProofEditor;
