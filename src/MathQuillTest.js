import React, { useEffect, useReducer, useState, createRef } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { addStyles, EditableMathField } from "react-mathquill";
addStyles();
const initialState = { lastId: 0, items: [{ id: 0, value: "" }] };
const LEFT = -1;
const RIGHT = 1;
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
        {
          id: state.lastId + 2,
          value: start[action.index].value.substring(action.selectionStart),
        },
      ];
      start[action.index] = Object.assign({}, start[action.index], {
        value: start[action.index].value.substring(0, action.selectionStart),
      });
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
function reducerRefs(state, action) {
  switch (action.type) {
    case "effect":
      return {
        array: Array(action.length)
          .fill()
          .map((_, index) => state.array[index] || createRef()),
      };
    case "update":
      const newArray = state.array.slice();
      newArray[action.index] = action.ref;
      return { array: newArray };
    case "focus":
      if (action.index % 2 === 0) {
        state.array[action.index].current.focus();
      } else {
        state.array[action.index].focus();
      }
      return state;
    default:
      throw new Error();
  }
}
const initialRef = { array: [] };
const MathQuillTest = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [elRefs, dispatchRef] = useReducer(reducerRefs, initialRef);
  useEffect(() => {
    dispatchRef({ type: "effect", length: state.items.length });
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
          dispatch({
            type: "add",
            index: index,
            selectionStart: event.target.selectionStart,
          });
        }
        if (
          event.keyCode === 39 &&
          event.target.selectionStart === state.items[index].value.length &&
          state.items.length !== index + 1
        ) {
          dispatchRef({ type: "focus", index: index + 1 });
        }
        if (
          event.keyCode === 37 &&
          event.target.selectionStart === 0 &&
          index !== 0
        ) {
          dispatchRef({ type: "focus", index: index - 1 });
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
                  ref={elRefs.array[index]}
                />
              );
            } else {
              return (
                <EditableMathField
                  key={inputObj.id}
                  latex={inputObj.value}
                  onChange={getChangeInput(index)}
                  onKeyDown={getKeyDown(index)}
                  mathquillDidMount={(mathField) =>
                    dispatchRef({
                      type: "update",
                      index: index,
                      ref: mathField,
                    })
                  }
                  config={{
                    handlers: {
                      moveOutOf: (dir, mathField) => {
                        if (dir === LEFT) {
                          dispatchRef({ type: "focus", index: index - 1 });
                        } else if (dir === RIGHT) {
                          dispatchRef({ type: "focus", index: index + 1 });
                        }
                      },
                    },
                  }}
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
