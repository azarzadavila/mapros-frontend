import React, { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { addStyles, EditableMathField } from "react-mathquill";
addStyles();
let id = 0;
const MathQuillTest = () => {
  const [latex, setLatex] = useState("\\frac{1}{\\sqrt{2}}\\cdot 2");
  const [text, setText] = useState("");
  const [inputs, setInputs] = useState([{ id: 0, value: "" }]);
  const getChangeInput = (index) => {
    return (event) => {
      const newInputs = inputs.slice();
      newInputs[index].value = event.target.value;
      setInputs(newInputs);
    };
  };
  const changeInput = (event) => {
    setText(event.target.value);
  };
  const getKeyDown = (index) => {
    return (event) => {
      if (event.ctrlKey && event.keyCode === 13) {
        const inputsStart = inputs.slice(0, index + 1);
        id = id + 1;
        const newInput = [{ id: id, value: "" }];
        const inputEnd = inputs.slice(index + 1, inputs.length);
        const newInputs = inputsStart.concat(newInput, inputEnd);
        console.log(newInputs);
        setInputs(newInputs);
      }
    };
  };
  const keyDown = (event) => {
    if (event.ctrlKey && event.keyCode === 13) {
    }
  };
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
        <Col className={"text-primary w-100"}>{latex}</Col>
      </Row>
      <Row>
        <InputGroup>
          {inputs.map((inputObj, i) => (
            <input
              key={inputObj.id}
              type={"text"}
              value={inputObj.value}
              onChange={getChangeInput(i)}
              onKeyDown={getKeyDown(i)}
            />
          ))}
        </InputGroup>
      </Row>
    </Container>
  );
};

export default MathQuillTest;
