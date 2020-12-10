import React, { useReducer, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

const initialState = [{ value: "" }, { value: "" }];

const reducer = (state, action) => {
  let newState;
  switch (action.type) {
    case "update":
      newState = state.slice();
      newState[action.index].value = action.value;
      return newState;
    case "add":
      newState = state.slice();
      newState[0].value += "a";
      return newState;
    default:
      throw new Error();
  }
};

const UseReducerTest = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Container>
      <Row>
        <Col>
          <input
            value={state[0].value}
            onChange={(event) => {
              dispatch({ type: "update", value: event.target.value, index: 0 });
            }}
          />
          <input
            value={state[1].value}
            onChange={(event) => {
              dispatch({ type: "update", value: event.target.value, index: 1 });
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            onClick={(event) => {
              dispatch({ type: "add" });
            }}
          >
            +
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default UseReducerTest;
