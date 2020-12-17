import React, { useEffect, useReducer, useState, createRef } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { addStyles, EditableMathField } from "react-mathquill";
addStyles();
const initialState = { lastId: 0, items: [{ id: 0, value: "" }] };
function reducer(state, action) {
  let start, middle, end, newItems, newValue;
  switch (action.type) {
    case "update":
      newItems = state.items.slice();
      newItems[action.index].value = action.value;
      return Object.assign({}, state, { items: newItems });
    case "add":
      start = state.items.slice(0, action.index + 1);
      middle = [
        { id: state.lastId + 1, value: "" },
        { id: state.lastId + 2, value: "" },
      ];
      end = state.items.slice(action.index + 1, state.length);
      newItems = start.concat(middle, end);
      return { lastId: state.lastId + 2, items: newItems };
    case "delete":
      start = state.items.slice(0, action.index);
      newValue = start[action.index - 1].value;
      newValue += " ";
      newValue += state.items[action.index + 1].value;
      start[action.index - 1] = Object.assign({}, start[action.index - 1], {
        value: newValue,
      });
      end = state.items.slice(action.index + 2, state.length);
      newItems = start.concat(end);
      return Object.assign({}, state, { items: newItems });
    default:
      throw new Error();
  }
}
const MathQuillTest = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [elRefs, setElRefs] = useState([]);
  useEffect(() => {
    setElRefs(
      Array(state.items.length)
        .fill()
        .map((_, index) => elRefs[index] || createRef())
    );
  }, [state]);
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
        if (
          event.keyCode === 39 &&
          event.target.selectionStart === state.items[index].value.length &&
          state.items.length !== index + 1
        ) {
          elRefs[index + 1].focus();
        }
      };
    } else {
      return (event) => {
        if (event.keyCode === 8 && state.items[index].value === "") {
          dispatch({ type: "delete", index: index });
        }
      };
    }
  };
  return (
    <Container>
      <Row>
        <InputGroup>
          {state.items.map((inputObj, index) => {
            if (index % 2 === 0) {
              return (
                <input
                  key={inputObj.id}
                  type="text"
                  value={inputObj.value}
                  onChange={getChangeInput(index)}
                  onKeyDown={getKeyDown(index)}
                  ref={elRefs[index]}
                />
              );
            } else {
              return (
                <EditableMathField
                  key={inputObj.id}
                  latex={inputObj.value}
                  onChange={getChangeInput(index)}
                  onKeyDown={getKeyDown(index)}
                  mathquillDidMount={(mathField) => (elRefs[index] = mathField)}
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
