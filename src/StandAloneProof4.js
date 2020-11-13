import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Alert,
  Form,
  FormControl,
  FormGroup,
  InputGroup,
} from "react-bootstrap";
import { ROOT_URL } from "./Constants";

const StandAloneProofDispatch = React.createContext(null);

function Proof(props) {
  const dispatch = useContext(StandAloneProofDispatch);
  const makeChild = (child, index) => {
    return (
      <Proof index={props.index.concat([index])} children={child.children} />
    );
  };
  useEffect(() => {
    console.log("effect at " + props.index);
  });
  return (
    <>
      <Row>
        <Col xs={1}>{props.index}</Col>
        <Col xs={10}>SENTENCE</Col>
        <Col xs={1}>
          <Button
            onClick={(event) => {
              dispatch({ index: props.index });
            }}
          >
            +
          </Button>
        </Col>
      </Row>
      {props.children.map(makeChild)}
    </>
  );
}

function addChild(state, index) {
  if (index.length === 0) {
    const child = { children: [] };
    return Object.assign({}, state, {
      children: state.children.concat([child]),
    });
  }
  const newChildren = state.children.slice();
  newChildren[index[0]] = addChild(
    newChildren[index[0]],
    index.slice(1, index.length)
  );
  return Object.assign({}, state, { children: newChildren });
}

function standAloneProofReducer(state, action) {
  return addChild(state, action.index);
}
const initialState = { children: [] };

function StandAloneProof4() {
  const [state, dispatch] = useReducer(standAloneProofReducer, initialState);
  return (
    <StandAloneProofDispatch.Provider value={dispatch}>
      <Container>
        <Proof index={[]} children={state.children} />
      </Container>
    </StandAloneProofDispatch.Provider>
  );
}

export default StandAloneProof4;
