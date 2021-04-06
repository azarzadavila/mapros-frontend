import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Row } from "react-bootstrap";
import {
  askState,
  getTheoremProof,
  updateTheoremProof,
} from "./MainCommunication";
import { addStyles } from "react-mathquill";
import { useLocation } from "react-router-dom";
import {
  deleteFromList,
  getChangeWithResponse,
  getHandleProofChange,
  Goal,
  preprocessLatex,
  ProofLine,
  Sentence,
  splitLatex,
} from "./MainViewUtils";
import WaitingContainer from "./WaitingContainer";
import { BackBanner } from "./LinkBanner";

addStyles();

let lastProof = 0;

const genInitHypotheses = (hypotheses) => {
  let ret = hypotheses.split("\n");
  return ret.map((hyp) => {
    return { ident: "", value: hyp };
  });
};

const genInitProofs = (proofs) => {
  console.log("Proof : " + proofs);
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
    lastProof += 1;
    return toRet;
  });
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function TheoremProofView() {
  let query = useQuery();
  const [hypotheses, setHypotheses] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [leanError, setLeanError] = useState("NO MESSAGE");
  const [leanIndex, setLeanIndex] = useState(-1);
  const [waitVisibility, setWaitVisibility] = useState("invisible");
  const [pingPong, setPingPong] = useState(true);
  const [feedBack, setFeedBack] = useState(<></>);
  const addProof = (event) => {
    const newProofs = proofs.slice();
    newProofs.push({
      text: "",
      id: lastProof,
      goal: "",
      sentences: [],
      initItems: [{ id: 0, value: "" }],
    });
    setProofs(newProofs);
    lastProof += 1;
  };
  const handleProofChange = getHandleProofChange(proofs, setProofs);
  const handleProofDelete = deleteFromList(proofs, setProofs);
  const hypothesesContent = () => {
    return hypotheses.map((hypothesis) => hypothesis.value);
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
  const changeWithResponse = getChangeWithResponse(
    hypotheses,
    setHypotheses,
    setInitialMessage,
    proofs,
    setLeanIndex,
    setLeanError,
    setProofs
  );

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
  useEffect(() => {
    const id = query.get("id");
    if (id) {
      getTheoremProof(id)
        .then((response) => {
          console.log(response);
          const theorem_statement = response.data.theorem_statement;
          console.log(theorem_statement);
          setName(theorem_statement.name);
          setHypotheses(genInitHypotheses(theorem_statement.hypotheses));
          setGoal(theorem_statement.goal);
          console.log(response.data.proof);
          setProofs(genInitProofs(response.data.proof));
        })
        .catch((error) => {
          setLeanError(error.message); // TODO
          console.log(error);
        });
    } else {
      setLeanError("FAILED TO FIND PROOF ID");
    }
  }, [pingPong]);
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
  const handleSave = () => {
    let proof = proofsContentAll();
    proof = proof.join("\n");
    const id = query.get("id");
    if (id) {
      updateTheoremProof(id, proof)
        .then((response) => {
          setFeedBack(<Alert variant="success">Proof updated...</Alert>);
          setTimeout(() => setFeedBack(<></>), 1000);
          setPingPong(!pingPong);
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <BackBanner to="/list_theorem_proofs/">
      <WaitingContainer waitVisibility={waitVisibility}>
        <Row>{feedBack}</Row>
        <Row className="mb-3">
          <Col xs={8}>Theorem Name : {name}</Col>
          <Col xs={4}>
            <Button onClick={handleSave}>Save</Button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs={4}>If,</Col>
          <Col xs={4}>
            <h2>GOAL STATE</h2>
          </Col>
        </Row>
        {hypotheses.map((hypothesis, index) => {
          return (
            <Sentence
              key={index}
              ident={hypothesis.ident}
              sentence={hypothesis.value}
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
            <Goal goal={goal} />
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
              initItems={proof.initItems}
            />
          );
        })}
        <Row>
          <Button className="ml-3 mb-3" onClick={addProof}>
            +
          </Button>
        </Row>
      </WaitingContainer>
    </BackBanner>
  );
}

export default TheoremProofView;
