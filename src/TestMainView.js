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
                     goal,
                     onAskState,
                     sentences,
                     leanMsg,
                   }) {
  let leanAlert;
  if (leanMsg) {
    leanAlert = (
      <Row className="mb-3">
        <Alert variant="primary" className="w-100">
          {leanMsg}
        </Alert>
      </Row>
    );
  } else {
    leanAlert = <></>;
  }
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
          <Alert variant="dark">{goal}</Alert>
        </Col>
      </Row>
      {sentences.map((sentence, index) => (
        <Row className="mb-3" key={index}>
          <Col xs={8}>
            <Alert variant="dark">
              ({sentence.ident}) : {sentence.sentence}
            </Alert>
          </Col>
        </Row>
      ))}
      {leanAlert}
    </>
  );
}

let lastHyp = 0;
let lastProof = 0;

const initHypotheses = [
  {ident: "", text: "$a_n, b_n, c_n$ are real-valued sequences", id: 0},
  {ident: "", text: "$l \\in \\mathbb{R}$", id: 1},
  {ident: "", text: "$a_n \\rightarrow l$", id: 2},
  {ident: "", text: "$c_n \\rightarrow l$", id: 3},
  {ident: "", text: "$\\forall n : a_n \\leq b_n$", id: 4},
  {ident: "", text: "$\\forall n : b_n \\leq c_n$", id: 5},
];

const initGoal = "$b_n \\rightarrow l$";

const initProofs = [
  { goal: "", id: 0, text: "Let $\\epsilon$", sentences: [] },
  { goal: "", id: 1, text: "Let's choose $N_a$ such that H1 uses $\\epsilon$", sentences: [] },
  { goal: "", id: 2, text: "Let's choose $N_c$ such that H2 uses $\\epsilon$", sentences: [] },
  { goal: "", id: 3, text: "Let $N = max(N_a, N_c)$", sentences: [] },
  { goal: "", id: 4, text: "We claim $N$ works", sentences: [] },
  { goal: "", id: 5, text: "By inequality properties, $N_a \\leq N$", sentences: [] },
  { goal: "", id: 6, text: "By inequality properties, $N_c \\leq N$", sentences: [] },
  { goal: "", id: 7, text: "Let $n$", sentences: [] },
  { goal: "", id: 8, text: "$a_n \\leq b_n$ by H3 with n", sentences: [] },
  { goal: "", id: 9, text: "$b_n \\leq c_n$ by H4 with n", sentences: [] },
  { goal: "", id: 10, text: "By inequality properties, $N_a \\leq n$", sentences: [] },
  { goal: "", id: 11, text: "Let's choose n in A2", sentences: [] },
  { goal: "", id: 12, text: "$|a_n - l| < \\epsilon$ by A10 with A9", sentences: [] },
  { goal: "", id: 13, text: "By inequality properties, $N_c \\leq n$", sentences: [] },
  { goal: "", id: 14, text: "Let's choose n in A3", sentences: [] },
  { goal: "", id: 15, text: "$|c_n - l| < \\epsilon$ by A13 with A12", sentences: [] },
  { goal: "", id: 16, text: "Let's use absolute value inequality property on A11 A14 and on goal", sentences: [] },
  { goal: "", id: 17, text: "Let's separate A11", sentences: [] },
  { goal: "", id: 18, text: "Let's separate A14", sentences: [] },
  { goal: "", id: 19, text: "Let's split the goal and do on all subgoals", sentences: [] },
  { goal: "", id: 20, text: "By linear arithmetic", sentences: [] },
];

function TestMainView() {
  const [hypotheses, setHypotheses] = useState(initHypotheses);
  const [proofs, setProofs] = useState(initProofs);
  const [name, setName] = useState("sandwich");
  const [goal, setGoal] = useState(initGoal);
  const [initialMessage, setInitialMessage] = useState("");
  const [leanError, setLeanError] = useState("NO MESSAGE");
  const [leanIndex, setLeanIndex] = useState(-1);
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
    newProofs.push({ text: "", id: lastProof, goal: "", sentences: [] });
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
      proofs[i].goal = "";
      proofs[i].sentences = [];
    }
  };
  const changeWithResponse = (data) => {
    const newHypotheses = hypotheses.slice();
    data.hypotheses_ident.forEach((ident, index) => {
      newHypotheses[index] = { ...newHypotheses[index] };
      newHypotheses[index].ident = ident;
    });
    setHypotheses(newHypotheses);
    setInitialMessage(data.initial_goal);
    const newProofs = proofs.slice();
    data.goals.forEach((state, index) => {
      newProofs[index] = { ...newProofs[index] };
      newProofs[index].goal = state;
    });
    data.sentences.forEach((cur_sentences, index) => {
      newProofs[index].sentences = cur_sentences;
    });
    clearAfter(data.goals.length, newProofs);
    setLeanIndex(data.goals.length - 1);
    if (data.error) {
      setLeanError(data.error);
    } else {
      setLeanError("NO MESSAGE");
    }
    setProofs(newProofs);
  };

  const updateState = (index, state) => {
    const newProofs = proofs.slice();
    newProofs[index] = { ...newProofs[index] };
    newProofs[index].goal = state;
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
          setLeanIndex(-1);
          setLeanError(error.response.data.detail);
        } else {
          console.log(error);
          setLeanIndex(-1);
          setLeanError("ERROR");
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
            setLeanIndex(index);
            setLeanError(error.response.data.detail);
          } else {
            console.log(error);
            setLeanIndex(index);
            setLeanError("ERROR");
          }
        });
    };
  };
  let leanInitMsg;
  if (leanIndex === -1) {
    leanInitMsg = (
      <Alert className="w-100" variant="primary">
        {leanError}
      </Alert>
    );
  } else {
    leanInitMsg = <></>;
  }
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
          <Button className="ml-3 mb-3" onClick={askStateInitial}>
            S
          </Button>
        </Col>
        <Col xs={4}>
          <Alert variant="dark">{initialMessage}</Alert>
        </Col>
      </Row>
      {leanInitMsg}
      {proofs.map((proof, index) => {
        let leanMsg = null;
        if (index === leanIndex) {
          leanMsg = leanError;
        }
        return (
          <ProofLine
            text={proof.text}
            goal={proof.goal}
            key={proof.id}
            onChange={handleProofChange(index)}
            onDelete={handleProofDelete(index)}
            onAskState={handleAskState(index)}
            sentences={proof.sentences}
            leanMsg={leanMsg}
          />
        );
      })}
      <Row>
        <Button className="ml-3 mb-3" onClick={addProof}>
          +
        </Button>
      </Row>
    </Container>
  );
}

export default TestMainView;
