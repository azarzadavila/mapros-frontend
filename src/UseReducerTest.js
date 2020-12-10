import React, { useReducer, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

const initialState = { value: "" };

const reducer = (state, action) => {
  switch (action.type) {
    case "update":
      return { value: action.value };
    case "add":
      return { value: state.value + "a" };
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
            value={state.value}
            onChange={(event) => {
              dispatch({ type: "update", value: event.target.value });
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
