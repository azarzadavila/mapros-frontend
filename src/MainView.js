import React, { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { askState } from "./MainCommunication";

function HypothesisLine({ ident, text, onChange, onDelete }) {
  return (
    <Row className="mb-3">
      <Col xs={8}>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>{ident}</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control value={text} onChange={onChange} />
          <InputGroup.Append>
            <Button onClick={onDelete}>-</Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
    </Row>
  );
}

function ProofLine({
  text,
  onChange,
  onDelete,
  state,
  onAskState,
  additional,
}) {
  return (
    <>
      <Row className="mb-3">
        <Col xs={8}>
          <InputGroup>
            <Form.Control value={text} onChange={onChange} />
            <InputGroup.Append>
              <Button onClick={onDelete}>-</Button>
              <Button onClick={onAskState}>S</Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
        <Col xs={4}>
          <Alert variant="dark">{state}</Alert>
        </Col>
      </Row>
      {additional.map((addi, index) => (
        <Row className="mb-3" key={index}>
          <Col xs={8}>
            <Alert variant="dark">
              ({addi.ident}) : {addi.value}
            </Alert>
          </Col>
        </Row>
      ))}
    </>
  );
}

let lastHyp = 0;
let lastProof = 0;

function MainView() {
  const [hypotheses, setHypotheses] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const onChangeName = (event) => {
    setName(event.target.value);
  };
  const onChangeGoal = (event) => {
    setGoal(event.target.value);
  };
  const addHypothesis = (event) => {
    const newHypotheses = hypotheses.slice();
    newHypotheses.push({ ident: "", text: "", id: lastHyp });
    setHypotheses(newHypotheses);
    lastHyp += 1;
  };
  const handleHypothesisChange = (index) => {
    return (event) => {
      const newHypotheses = hypotheses.slice();
      newHypotheses[index] = { ...newHypotheses[index] };
      newHypotheses[index].text = event.target.value;
      setHypotheses(newHypotheses);
    };
  };
  const deleteFromList = (list, setList) => {
    return (index) => {
      return (event) => {
        const newListStart = list.slice(0, index);
        const newListEnd = list.slice(index + 1, list.length);
        const newList = newListStart.concat(newListEnd);
        setList(newList);
      };
    };
  };
  const handleHypothesisDelete = deleteFromList(hypotheses, setHypotheses);
  const addProof = (event) => {
    const newProofs = proofs.slice();
    newProofs.push({ text: "", id: lastProof, state: "", additional: [] });
    setProofs(newProofs);
    lastProof += 1;
  };
  const handleProofChange = (index) => {
    return (event) => {
      const newProofs = proofs.slice();
      newProofs[index] = { ...newProofs[index] };
      newProofs[index].text = event.target.value;
      setProofs(newProofs);
    };
  };
  const handleProofDelete = deleteFromList(proofs, setProofs);
  const hypothesesContent = () => {
    return hypotheses.map((hypothesis) => hypothesis.text);
  };
  const proofsContent = (index) => {
    const res = [];
    for (let i = 0; i <= index; i++) {
      res.push(proofs[i].text);
    }
    return res;
  };
  const clearAfter = (index, proofs) => {
    for (let i = index; i < proofs.length; i++) {
      proofs[i].state = "";
    }
  };
  const changeWithResponse = (data) => {
    const newHypotheses = hypotheses.slice();
    data.hypothesesIdent.forEach((ident, index) => {
      newHypotheses[index] = { ...newHypotheses[index] };
      newHypotheses[index].ident = ident;
    });
    setHypotheses(newHypotheses);
    setInitialMessage(data.initialState);
    const newProofs = proofs.slice();
    data.states.forEach((state, index) => {
      newProofs[index] = { ...newProofs[index] };
      newProofs[index].state = state;
    });
    data.additional.forEach((additional, index) => {
      newProofs[index].additional = additional;
    });
    clearAfter(data.states.length, newProofs);
    setProofs(newProofs);
  };

  const updateState = (index, state) => {
    const newProofs = proofs.slice();
    newProofs[index] = { ...newProofs[index] };
    newProofs[index].state = state;
    setProofs(newProofs);
  };

  const genToSend = (index) => {
    return {
      name: name,
      hypotheses: hypothesesContent(),
      goal: goal,
      proofs: proofsContent(index),
    };
  };

  const askStateInitial = (event) => {
    const toSend = genToSend(-1);
    askState(toSend)
      .then((response) => changeWithResponse(response.data))
      .catch((error) => {
        if (error.response && error.response.data.detail) {
          setInitialMessage(error.response.data.detail);
        } else {
          setInitialMessage("ERROR");
        }
      });
  };

  const handleAskState = (index) => {
    return (event) => {
      const toSend = genToSend(index);
      askState(toSend)
        .then((response) => changeWithResponse(response.data))
        .catch((error) => {
          if (error.response && error.response.data.detail) {
            updateState(index, error.response.data.detail);
          } else {
            updateState(index, "ERROR");
          }
        });
    };
  };
  return (
    <Container>
      <Row className="mb-3">
        <Col xs={8}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Theorem Name :</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              placeholder="name"
              aria-label="name"
              value={name}
              onChange={onChangeName}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={4}>
          If,
          <Button className="ml-3" onClick={addHypothesis}>
            +
          </Button>
        </Col>
      </Row>
      {hypotheses.map((hypothesis, index) => {
        return (
          <HypothesisLine
            ident={hypothesis.ident}
            text={hypothesis.text}
            key={hypothesis.id}
            onChange={handleHypothesisChange(index)}
            onDelete={handleHypothesisDelete(index)}
          />
        );
      })}
      <Row>
        <Col xs={8}>
          <label>Then,</label>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={8}>
          <Form.Control
            placeholder="goal"
            aria-label="goal"
            value={goal}
            onChange={onChangeGoal}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          Proof:
          <Button className="ml-3 mb-3" onClick={addProof}>
            +
          </Button>
          <Button className="ml-3 mb-3" onClick={askStateInitial}>
            S
          </Button>
        </Col>
        <Col xs={4}>
          <Alert variant="dark">{initialMessage}</Alert>
        </Col>
      </Row>
      {proofs.map((proof, index) => {
        return (
          <ProofLine
            text={proof.text}
            state={proof.state}
            key={proof.id}
            onChange={handleProofChange(index)}
            onDelete={handleProofDelete(index)}
            onAskState={handleAskState(index)}
            additional={proof.additional}
          />
        );
      })}
    </Container>
  );
}

export default MainView;
