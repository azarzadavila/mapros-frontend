import React, { useEffect, useState } from "react";
import {
  clearAfter,
  deleteFromList,
  Goal,
  HypothesisLine,
  preprocessLatex,
  ProofLine,
  Sentence,
  splitLatex,
} from "./MainViewUtils";
import Feedback from "./Feedback";
import {
  askState,
  createTheoremStatement,
  getOwnedTheoremStatement,
  getTheoremProof,
  updateTheoremProof,
  updateTheoremStatement,
} from "./MainCommunication";
import { addStyles } from "react-mathquill";
import WaitingContainer from "./WaitingContainer";
import { Alert, Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import MathQuillElement from "./MathQuillElement";
import { Redirect, useHistory, useLocation } from "react-router-dom";

addStyles();
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const genInitGoalStatement = (goal) => {
  let res = splitLatex(preprocessLatex(goal));
  return res.map((val, index) => {
    return { id: index, value: val };
  });
};
const genInitHypothesesProof = (hypotheses) => {
  let ret = hypotheses.split("\n");
  return ret.map((hyp) => {
    return { ident: "", text: hyp };
  });
};

function MainViewParent({
  isStatementReadOnly = false,
  isProofView = true,
  viewType = null,
}) {
  const query = useQuery();
  const history = useHistory();
  const [redirect, setRedirect] = useState(null);
  const [generalFeedback, setGeneralFeedback] = useState(null);
  const [hypotheses, setHypotheses] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [goalInput, setGoalInput] = useState(
    <MathQuillElement setValue={setGoal} />
  );
  const [feedback, setFeedback] = useState(<></>);
  const [feedbackIndex, setFeedbackIndex] = useState(-1);
  const [initialGoal, setInitialGoal] = useState("");
  const [waitVisibility, setWaitVisibility] = useState("invisible");
  const [lastHyp, setLastHyp] = useState(0);
  const [lastProof, setLastProof] = useState(0);
  useEffect(() => {
    if (viewType === "statementView") {
      effectTheoremStatement();
    } else if (viewType === "proofView") {
      effectProof();
    }
  }, []);
  const genInitHypothesesStatement = (hypotheses) => {
    const lines = hypotheses.split("\n");
    let res = lines.map(preprocessLatex);
    res = res.map(splitLatex);
    return res.map((child, ind) => {
      const toRet = {
        ident: "",
        text: lines[ind],
        id: lastHyp,
        initItems: child.map((val, index) => {
          return { id: index, value: val };
        }),
      };
      setLastHyp(lastHyp + 1);
      return toRet;
    });
  };
  const genInitProofs = (proofs) => {
    const lines = proofs.split("\n");
    let res = lines.map(preprocessLatex);
    res = res.map(splitLatex);
    return res.map((child, ind) => {
      const toRet = {
        text: lines[ind],
        id: lastProof,
        initItems: child.map((val, index) => {
          return { id: index, value: val };
        }),
        goal: "",
        sentences: [],
      };
      setLastProof(lastProof + 1);
      return toRet;
    });
  };
  const effectTheoremStatement = () => {
    const id = query.get("id");
    if (id) getTheoremStatement(id);
  };
  const getTheoremStatement = (id) => {
    getOwnedTheoremStatement(id)
      .then((response) => {
        setName(response.data.name);
        setHypotheses(genInitHypothesesStatement(response.data.hypotheses));
        setGoal(response.data.goal);
        const initGoalItems = genInitGoalStatement(response.data.goal);
        // TODO adding the <div> is hack to force re-rendering
        setGoalInput(
          <div>
            <MathQuillElement setValue={setGoal} initItems={initGoalItems} />
          </div>
        );
      })
      .catch((error) => {
        setGeneralFeedback(<Alert variant="danger">{error.message}</Alert>);
        console.log(error);
      });
  };
  const effectProof = () => {
    const id = query.get("id");
    if (id) {
      getProofView(id);
    } else {
      setGeneralFeedback(
        <Alert variant="danger">Failed to find proof id</Alert>
      );
    }
  };
  const getProofView = (id) => {
    getTheoremProof(id)
      .then((response) => {
        const theorem_statement = response.data.theorem_statement;
        setName(theorem_statement.name);
        setHypotheses(genInitHypothesesProof(theorem_statement.hypotheses));
        setGoal(theorem_statement.goal);
        setProofs(genInitProofs(response.data.proof));
      })
      .catch((error) => {
        setGeneralFeedback(<Alert variant="danger">{error.message}</Alert>);
        console.log(error);
      });
  };
  const handleSaveStatement = () => {
    let hyps = hypothesesContent();
    hyps = hyps.join("\n");
    const toSend = { name: name, hypotheses: hyps, goal: goal };
    const id = query.get("id");
    if (id) {
      updateTheoremStatement(id, toSend)
        .then((response) => {
          history.replace("/owned_statement?id=" + response.data.id);
          setGeneralFeedback(
            <Alert variant="success">Statement updated...</Alert>
          );
          setTimeout(() => setGeneralFeedback(<></>), 1000);
          effectTheoremStatement();
        })
        .catch((error) => {
          setGeneralFeedback(<Alert variant="danger">{error.message}</Alert>);
          console.log(error);
        });
    } else {
      createTheoremStatement(toSend)
        .then((response) => {
          history.replace("/owned_statement?id=" + response.data.id);
          setGeneralFeedback(
            <Alert variant="success">Statement created...</Alert>
          );
          setTimeout(() => setGeneralFeedback(<></>), 1000);
          effectTheoremStatement();
        })
        .catch((error) => {
          setGeneralFeedback(<Alert variant="danger">{error.message}</Alert>);
          console.log(error);
        });
    }
  };
  const handleSaveProof = () => {
    let proof = proofsContentAll();
    proof = proof.join("\n");
    const id = query.get("id");
    if (id) {
      updateTheoremProof(id, proof)
        .then(() => {
          setGeneralFeedback(<Alert variant="success">Proof updated...</Alert>);
          setTimeout(() => setGeneralFeedback(<></>), 1000);
          effectProof();
        })
        .catch((error) => console.log(error));
    }
  };
  const onChangeName = (event) => {
    setName(event.target.value);
  };
  const addHypothesis = () => {
    const newHypotheses = hypotheses.slice();
    newHypotheses.push({ ident: "", text: "", id: lastHyp });
    setHypotheses(newHypotheses);
    setLastHyp(lastHyp + 1);
  };
  const handleHypothesisChange = (index) => {
    return (value) => {
      const newHypotheses = hypotheses.slice();
      newHypotheses[index] = { ...newHypotheses[index] };
      newHypotheses[index].text = value;
      setHypotheses(newHypotheses);
    };
  };
  const handleHypothesisDelete = deleteFromList(hypotheses, setHypotheses);
  const addProof = () => {
    const newProofs = proofs.slice();
    newProofs.push({ text: "", id: lastProof, goal: "", sentences: [] });
    setProofs(newProofs);
    setLastProof(lastProof + 1);
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
  const proofsContentAll = () => {
    return proofs.map((proof) => proof.text);
  };
  const changeWithResponse = (data) => {
    const newHypotheses = hypotheses.slice();
    data.hypotheses_ident.forEach((ident, index) => {
      newHypotheses[index] = { ...newHypotheses[index] };
      newHypotheses[index].ident = ident;
    });
    setHypotheses(newHypotheses);
    setInitialGoal(data.initial_goal);
    const newProofs = proofs.slice();
    data.goals.forEach((state, index) => {
      newProofs[index] = { ...newProofs[index] };
      newProofs[index].goal = state;
    });
    data.sentences.forEach((cur_sentences, index) => {
      newProofs[index].sentences = cur_sentences;
    });
    clearAfter(data.goals.length, newProofs);
    setFeedback(<Feedback variant={data.status} detail={data.feedback} />);
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
  const handleAskState = (index) => {
    return () => {
      setWaitVisibility("visible");
      askState(genToSend(index))
        .then((response) => {
          changeWithResponse(response.data);
          setFeedback(
            <Feedback
              variant={response.data.status}
              detail={response.data.detail}
            />
          );
        })
        .catch((error) => {
          if (error.response && error.response.data.status) {
            changeWithResponse(error.response.data);
            setFeedback(
              <Feedback
                variant={error.response.data.status}
                detail={error.response.data.detail}
              />
            );
          } else if (error.response && error.response.data) {
            setFeedback(
              <Feedback
                variant="error"
                detail={JSON.stringify(error.response.data)}
              />
            );
          } else {
            setFeedback(<Feedback variant="error" />);
          }
        })
        .then(() => {
          setFeedbackIndex(index);
          setWaitVisibility("invisible");
        });
    };
  };
  const buttonAddHypothesis = isStatementReadOnly ? (
    <></>
  ) : (
    <Button className="ml-3" onClick={addHypothesis}>
      +
    </Button>
  );
  const hypothesisLineReadOnly = (hypothesis, index) => {
    return (
      <Sentence
        key={index}
        ident={hypothesis.ident}
        sentence={hypothesis.text}
      />
    );
  };
  const hypothesisLineEditable = (hypothesis, index) => {
    return (
      <HypothesisLine
        ident={hypothesis.ident}
        text={hypothesis.text}
        key={hypothesis.id}
        onChange={handleHypothesisChange(index)}
        onDelete={handleHypothesisDelete(index)}
        initItems={hypothesis.initItems}
      />
    );
  };
  const hypothesisLine = isStatementReadOnly
    ? hypothesisLineReadOnly
    : hypothesisLineEditable;
  const goalLine = isStatementReadOnly ? <Goal goal={goal} /> : goalInput;
  const proofView = isProofView ? (
    <>
      <Row>Proof:</Row>
      {proofs.map((proof, index) => {
        let curFeedback = null;
        if (index === feedbackIndex) {
          curFeedback = feedback;
        }
        return (
          <>
            <ProofLine
              text={proof.text}
              goal={proof.goal}
              key={proof.id}
              onChange={handleProofChange(index)}
              onDelete={handleProofDelete(index)}
              onAskState={handleAskState(index)}
              sentences={proof.sentences}
              feedback={curFeedback}
              initItems={proof.initItems}
            />
            {curFeedback}
          </>
        );
      })}
      <Row>
        <Button className="ml-3 mb-3" onClick={addProof}>
          +
        </Button>
      </Row>
    </>
  ) : (
    <></>
  );
  const nextToNameComponent = () => {
    if (!viewType) return <></>;
    if (viewType === "statementView")
      return (
        <>
          <Col xs={2}>
            <Button onClick={handleSaveStatement}>Save</Button>
          </Col>
          <Col xs={2}>
            <Button
              onClick={() => {
                const id = query.get("id");
                const path = "/send_statement?id=" + id;
                setRedirect(<Redirect to={path} push />);
              }}
            >
              Send
            </Button>
          </Col>
          <Col xs={2}>
            <Button
              onClick={() => {
                const id = query.get("id");
                const path = "/users_statement?id=" + id;
                setRedirect(<Redirect to={path} push />);
              }}
            >
              Manage
            </Button>
          </Col>
        </>
      );
    if (viewType === "proofView")
      return (
        <Col xs={4}>
          <Button onClick={handleSaveProof}>Save</Button>
        </Col>
      );
    throw new Error("Unrecognized nextToName");
  };
  let initialFeedback = feedbackIndex === -1 ? feedback : <></>;
  if (redirect) return redirect;
  return (
    <WaitingContainer waitVisibility={waitVisibility}>
      <Row>{generalFeedback}</Row>
      <Row className="mb-3">
        <Col xs={6}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Theorem Name :</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              placeholder="name"
              aria-label="name"
              value={name}
              onChange={onChangeName}
              readOnly={isStatementReadOnly}
            />
          </InputGroup>
        </Col>
        {nextToNameComponent()}
      </Row>
      <Row className="mb-3">
        <Col xs={4}>
          If,
          {buttonAddHypothesis}
        </Col>
      </Row>
      {hypotheses.map((hypothesis, index) => {
        return hypothesisLine(hypothesis, index);
      })}
      <Row>
        <Col xs={8}>Then,</Col>
      </Row>
      <Row className="mb-3">
        <Col xs={8}>
          <InputGroup>
            {goalLine}
            <InputGroup.Append>
              <Button onClick={handleAskState(-1)}>S</Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
        <Col xs={4}>
          <Goal goal={initialGoal} />
        </Col>
      </Row>
      {initialFeedback}
      {proofView}
    </WaitingContainer>
  );
}

export default MainViewParent;
