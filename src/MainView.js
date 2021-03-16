import React, { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { askState } from "./MainCommunication";
import MathQuillElement from "./MathQuillElement";
import { addStyles, StaticMathField } from "react-mathquill";
addStyles();

function splitLatex(s) {
  return s.split("$");
}

function HypothesisLine({ ident, text, onChange, onDelete }) {
  return (
    <Row className="mb-3">
      <Col xs={8}>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>{ident}</InputGroup.Text>
          </InputGroup.Prepend>
          <MathQuillElement setValue={onChange} />
          <InputGroup.Append>
            <Button onClick={onDelete}>-</Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
    </Row>
  );
}

const getOutput = (index, value) => {
  if (index % 2 === 0) {
    return <span key={index}>{value}</span>;
  } else {
    return <StaticMathField key={index}>{value}</StaticMathField>;
  }
};

function Sentence({ ident, sentence }) {
  return (
    <Row className="mb-3">
      <Col xs={8}>
        <Alert variant="dark">
          ({ident}) :{" "}
          {splitLatex(sentence).map((val, index) => getOutput(index, val))}
        </Alert>
      </Col>
    </Row>
  );
}

function Goal({ goal }) {
  return (
    <Col xs={4}>
      <Alert variant="dark">
        {splitLatex(goal).map((val, index) => getOutput(index, val))}
      </Alert>
    </Col>
  );
}

function ProofLine({
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
            <MathQuillElement setValue={onChange} />
            <InputGroup.Append>
              <Button onClick={onDelete}>-</Button>
              <Button onClick={onAskState}>S</Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
        <Goal goal={goal} />
      </Row>
      {sentences.map((sentence, index) => (
        <Sentence
          key={index}
          ident={sentence.ident}
          sentence={sentence.sentence}
        />
      ))}
      {leanAlert}
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
  const [leanError, setLeanError] = useState("NO MESSAGE");
  const [leanIndex, setLeanIndex] = useState(-1);
  const [waitVisibility, setWaitVisibility] = useState("invisible");
  const onChangeName = (event) => {
    setName(event.target.value);
  };
  const onChangeGoal = (value) => {
    setGoal(value);
  };
  const addHypothesis = (event) => {
    const newHypotheses = hypotheses.slice();
    newHypotheses.push({ ident: "", text: "", id: lastHyp });
    setHypotheses(newHypotheses);
    lastHyp += 1;
  };
  const handleHypothesisChange = (index) => {
    return (value) => {
      const newHypotheses = hypotheses.slice();
      newHypotheses[index] = { ...newHypotheses[index] };
      newHypotheses[index].text = value;
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
    return (value) => {
      const newProofs = proofs.slice();
      newProofs[index] = { ...newProofs[index] };
      newProofs[index].text = value;
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
    setWaitVisibility("visible");
    askState(toSend)
      .then((response) => {
        setWaitVisibility("invisible");
        changeWithResponse(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.data.detail) {
          setLeanIndex(-1);
          setLeanError(error.response.data.detail);
        } else {
          console.log(error);
          setLeanIndex(-1);
          setLeanError("ERROR");
        }
        setWaitVisibility("invisible");
      });
  };

  const handleAskState = (index) => {
    return (event) => {
      const toSend = genToSend(index);
      setWaitVisibility("visible");
      askState(toSend)
        .then((response) => {
          changeWithResponse(response.data);
          setWaitVisibility("invisible");
        })
        .catch((error) => {
          if (error.response && error.response.data.detail) {
            setLeanIndex(index);
            setLeanError(error.response.data.detail);
          } else {
            console.log(error);
            setLeanIndex(index);
            setLeanError("ERROR");
          }
          setWaitVisibility("invisible");
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
        <Col xs={4}>
          <h2>GOAL STATE</h2>
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
          <MathQuillElement setValue={onChangeGoal} />
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          Proof:
          <Button className="ml-3 mb-3" onClick={askStateInitial}>
            S
          </Button>
        </Col>
        <Goal goal={initialMessage} />
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
      <div
        className={
          "fixed-top w-100 h-100 d-flex justify-content-center align-items-center" +
          " " +
          waitVisibility
        }
      >
        <div
          className={"fixed-top w-100 h-100 bg-dark"}
          style={{ opacity: 0.6 }}
        />
        <Spinner
          animation="border"
          role="status"
          style={{ width: "5rem", height: "5rem" }}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    </Container>
  );
}

export default MainView;
