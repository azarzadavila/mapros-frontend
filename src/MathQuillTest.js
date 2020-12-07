import React, { useReducer, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { addStyles, EditableMathField } from "react-mathquill";
addStyles();
let id = 0;
const initialState = [{ id: 0, value: "" }];
function reducer(state, action) {
  switch (action.type) {
    case "update":
      const newState = state.slice();
      newState[action.index].value = action.value;
      return newState;
    default:
      throw new Error();
  }
}
const MathQuillTest = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const getChangeInput = (index) => {
    return (event) => {
      dispatch({ type: "update", index: index, value: event.target.value });
    };
  };
  return (
    <Container>
      <Row>
        <InputGroup>
          {state.map((inputObj, index) => {
            return (
              <input
                key={inputObj.id}
                type="text"
                value={inputObj.value}
                onChange={getChangeInput(index)}
              />
            );
          })}
        </InputGroup>
      </Row>
    </Container>
  );
};

export default MathQuillTest;
