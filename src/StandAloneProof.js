import React, { useContext, useReducer, useState } from "react";
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

let last = 0;
const StandAloneProofDispatch = React.createContext(null);

function Sentence(props) {
  const dispatch = useContext(StandAloneProofDispatch);
  const [value, setValue] = useState("");
  const [proofSentence, setProofSentence] = useState("");
  const [proofs, setProofs] = useState("");
  const [args, setArgs] = useState("");
  const [children, setChildren] = useState([]);
  const handleValue = (event) => {
    setValue(event.target.value);
    dispatch({ idx: props.idx, value: event.target.value });
  };
  const handleProofSentence = (event) => {
    setProofSentence(event.target.value);
  };
  const handleProofs = (event) => {
    setProofs(event.target.value);
  };
  const handleArgs = (event) => {
    setArgs(event.target.value);
  };
  const addChild = (event) => {
    last += 1;
    setChildren(
      children.concat([
        <Sentence
          tab={props.tab + 1}
          number={`${props.number}.${children.length + 1}`}
          idx={last}
          key={last}
        />,
      ])
    );
  };
  const spaceStyle = {
    "margin-left": props.tab.toString() + "%",
  };
  return (
    <>
      <Row style={spaceStyle} className="mt-3">
        <Col xs={11}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>{props.number}</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type="text" onChange={handleValue} value={value} />
          </InputGroup>
        </Col>
        <Col xs={1}>
          <Button variant="primary" onClick={addChild}>
            +
          </Button>
        </Col>
      </Row>
      <div>{children}</div>
      <Row style={spaceStyle} className="mt-3">
        <Col xs={12}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Proof</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              onChange={handleProofSentence}
              value={proofSentence}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row style={spaceStyle}>
        <Col xs={12}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>By using</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type="text" onChange={handleProofs} value={proofs} />
          </InputGroup>
        </Col>
      </Row>
      <Row style={spaceStyle}>
        <Col xs={12}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Args</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type="text" onChange={handleArgs} value={args} />
          </InputGroup>
        </Col>
      </Row>
    </>
  );
}

function standAloneProofReducer(state, action) {
  const idx = action.idx;
  const idxState = Object.assign({}, state[idx], { sentence: action.value });
  const source2 = {};
  source2[idx] = idxState;
  return Object.assign({}, state, source2);
}

const initialState = { 0: { sentence: "" } };
function StandAloneProof() {
  const [state, dispatch] = useReducer(standAloneProofReducer, initialState);
  return (
    <StandAloneProofDispatch.Provider value={dispatch}>
      <Container>
        <Sentence tab={0} number={1} idx={0} />
      </Container>
    </StandAloneProofDispatch.Provider>
  );
}

export default StandAloneProof;
