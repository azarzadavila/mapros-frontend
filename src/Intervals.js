import React, { useEffect, useReducer, useState, createRef } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { addStyles, EditableMathField } from "react-mathquill";

function Intervals() {
  return (
    <Container>
      <Row>
        <Col xs={2}>
          <label className={"w-100"}>Ask :</label>
        </Col>
      </Row>
      <Row>
        <Col xs={2}>
          <Button className={"w-100"}>Compute</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Intervals;
