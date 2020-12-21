import React, { useEffect, useReducer, useState, createRef } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";

function Intervals() {
  return (
    <Container>
      <Row>
        <Col xs={2}>
          <label className={"w-100"}>Ask :</label>
        </Col>
        <Col xs={10}>
          <EditableMathField latex={"\\sqrt{x-\\gamma}"} />
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
