import React, { useReducer, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { addStyles, EditableMathField } from "react-mathquill";
addStyles();
let id = 0;
const initialState = [{ id: 0, value: "" }];
function reducer(state, action) {
  let start, middle, end, newState;
  switch (action.type) {
    case "update":
      newState = state.slice();
      newState[action.index].value = action.value;
      return newState;
    case "add":
      start = state.slice(0, action.index + 1);
      middle = [
        { id: id + 1, value: "" },
        { id: id + 2, value: "" },
      ];
      id += 2;
      end = state.slice(action.index + 1, state.length);
      return start.concat(middle, end);
    case "delete":
      start = state.slice(0, action.index);
      start[action.index - 1].value += " ";
      start[action.index - 1].value += state[action.index + 1].value;
      end = state.slice(action.index + 2, state.length);
      return start.concat(end);
    default:
      throw new Error();
  }
}
const MathQuillTest = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const getChangeInput = (index) => {
    if (index % 2 === 0) {
      return (event) => {
        dispatch({ type: "update", index: index, value: event.target.value });
      };
    } else {
      return (mathField) => {
        dispatch({ type: "update", index: index, value: mathField.latex() });
      };
    }
  };
  const getKeyDown = (index) => {
    if (index % 2 === 0) {
      return (event) => {
        if (event.ctrlKey && event.keyCode === 13) {
          dispatch({ type: "add", index: index });
        }
      };
    } else {
      return (event) => {
        if (event.keyCode === 8 && state[index].value === "") {
          dispatch({ type: "delete", index: index });
        }
      };
    }
  };
  return (
    <Container>
      <Row>
        <InputGroup>
          {state.map((inputObj, index) => {
            if (index % 2 === 0) {
              return (
                <input
                  key={inputObj.id}
                  type="text"
                  value={inputObj.value}
                  onChange={getChangeInput(index)}
                  onKeyDown={getKeyDown(index)}
                />
              );
            } else {
              return (
                <EditableMathField
                  key={inputObj.id}
                  latex={inputObj.value}
                  onChange={getChangeInput(index)}
                  onKeyDown={getKeyDown(index)}
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
