import React, { useReducer, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

const initialState = { value: "" };

const reducer = (state, action) => {
  return { value: state.value + "a" };
};

const UseReducerTest = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Container>
      <Row>
        <Col>
          <p>{state.value}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            onClick={(event) => {
              dispatch({});
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
