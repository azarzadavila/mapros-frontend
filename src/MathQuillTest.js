import React, { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { addStyles, EditableMathField } from "react-mathquill";
addStyles();
let id = 0;
const initialState = [{ id: 0, value: "" }];
function reducer(state, action) {}
const MathQuillTest = () => {
  return (
    <Container>
      <Row>
        <InputGroup></InputGroup>
      </Row>
    </Container>
  );
};

export default MathQuillTest;
