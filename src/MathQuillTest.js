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
    case "add":
      const start = state.slice(0, action.index + 1);
      const middle = [
        { id: id + 1, value: "" },
        { id: id + 2, value: "" },
      ];
      id += 2;
      const end = state.slice(action.index + 1, state.length);
      return start.concat(middle, end);
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
  const getKeyDown = (index) => {
    return (event) => {
      if (event.ctrlKey && event.keyCode === 13) {
        dispatch({ type: "add", index: index });
      }
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
                onKeyDown={getKeyDown(index)}
              />
            );
          })}
        </InputGroup>
      </Row>
    </Container>
  );
};

export default MathQuillTest;
