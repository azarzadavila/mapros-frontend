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
      let newValue = "";
      if (index % 2 === 0) {
        newValue = event.target.value;
      } else {
        newValue = event.latex();
      }
      newInputs[index].value = newValue;
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
        const newInput = [
          { id: id + 1, value: "" },
          { id: id + 2, value: "" },
        ];
        id += 2;
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
          {inputs.map((inputObj, i) => {
            if (i % 2 === 0) {
              return (
                <input
                  key={inputObj.id}
                  type={"text"}
                  value={inputObj.value}
                  onChange={getChangeInput(i)}
                  onKeyDown={getKeyDown(i)}
                  size={inputObj.value.length + 1}
                />
              );
            } else {
              return (
                <EditableMathField
                  key={inputObj.id}
                  latex={inputObj.value}
                  onChange={getChangeInput(i)}
                />
              );
            }
          })}
        </InputGroup>
      </Row>
    </Container>
  );
};

export default MathQuillTest;
