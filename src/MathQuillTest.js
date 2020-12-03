import React, { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { addStyles, EditableMathField } from "react-mathquill";
addStyles();
const MathQuillTest = () => {
  const [latex, setLatex] = useState("\\frac{1}{\\sqrt{2}}\\cdot 2");

  return (
    <Container>
      <Row>
        <EditableMathField
            className={"w-100"}
          latex={latex}
          onChange={(mathField) => {
            setLatex(mathField.latex());
          }}
        />
      </Row>
      <Row>
          <Col className={"text-primary w-100"}>
              {latex}
          </Col>
      </Row>
    </Container>
  );
};

export default MathQuillTest;
