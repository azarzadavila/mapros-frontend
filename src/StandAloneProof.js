import React, { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import {
  checkStandalone,
  Proof as ProofObj,
  Sentence,
  SentenceProof,
  textToXML,
} from "./FormalCommunication";

let last = 0;

function Proof({ proof, onChange, tab, numLabel }) {
  const spaceStyle = {
    marginLeft: tab.toString() + "%",
  };
  const handleSentence = (event) => {
    const newProof = { ...proof };
    newProof.sentence = event.target.value;
    onChange(newProof);
  };
  const handleSentenceProofRule = (event) => {
    const newProof = { ...proof };
    newProof.sentenceProofRule = event.target.value;
    onChange(newProof);
  };
  const handleSentenceProofProofs = (event) => {
    const newProof = { ...proof };
    newProof.sentenceProofProofs = event.target.value;
    onChange(newProof);
  };
  const handleSentenceProofArgs = (event) => {
    const newProof = { ...proof };
    newProof.sentenceProofArgs = event.target.value;
    onChange(newProof);
  };
  const handleChildrenChange = (index, childProof) => {
    const newProof = { ...proof };
    newProof.children[index] = childProof;
    onChange(newProof);
  };
  const addChild = (event) => {
    last += 1;
    const newProof = { ...proof };
    newProof.children.push({
      children: [],
      sentence: "",
      sentenceProofRule: "",
      sentenceProofProofs: "",
      sentenceProofArgs: "",
      key: last,
    });
    onChange(newProof);
  };
  return (
    <>
      <Row style={spaceStyle} className="mt-3">
        <Col xs={11}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>{numLabel}</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              onChange={handleSentence}
              value={proof.sentence}
            />
          </InputGroup>
        </Col>
        <Col xs={1}>
          <Button variant="primary" onClick={addChild}>
            +
          </Button>
        </Col>
      </Row>
      <div>
        {proof.children.map((child, index) => {
          return (
            <Proof
              proof={child}
              onChange={(proof) => {
                handleChildrenChange(index, proof);
              }}
              tab={tab + 1}
              numLabel={numLabel + (index + 1).toString() + "."}
              key={child.key}
            />
          );
        })}
      </div>
      <Row style={spaceStyle} className="mt-3">
        <Col xs={12}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Proof</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              onChange={handleSentenceProofRule}
              value={proof.sentenceProofRule}
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
            <Form.Control
              type="text"
              onChange={handleSentenceProofProofs}
              value={proof.sentenceProofProofs}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row style={spaceStyle}>
        <Col xs={12}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Args</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              onChange={handleSentenceProofArgs}
              value={proof.sentenceProofArgs}
            />
          </InputGroup>
        </Col>
      </Row>
    </>
  );
}

function buildSentenceProof(proof) {
  const rule = proof.sentenceProofRule.trim().replace(" ", "");
  let proofsStr = proof.sentenceProofProofs
    .trim()
    .replace(" ", "")
    .split(",")
    .filter((s) => {
      return s !== "";
    });
  const proofs = [];
  for (let s of proofsStr) {
    const indexes = s.split(".");
    proofs.push(
      indexes.map((index) => {
        const toRet = parseInt(index) - 1;
        if (isNaN(toRet)) {
          throw new Error("incorrect proofs to use");
        }
        return toRet;
      })
    );
  }
  const args = proof.sentenceProofArgs
    .trim()
    .replace(" ", "")
    .split(",")
    .filter((s) => {
      return s !== "";
    });
  console.log(proofs);
  return new SentenceProof(rule, proofs, args);
}

async function buildProof(proof) {
  try {
    const xml = (await textToXML(proof.sentence)).data.xml;
    const proofObj = new ProofObj(new Sentence(xml));
    proofObj.sentence_proof = buildSentenceProof(proof);
    for (let child of proof.children) {
      proofObj.push(await buildProof(child));
    }
    return proofObj;
  } catch (e) {
    throw e;
  }
}

function checkProof(root) {
  buildProof(root)
    .then((response) => {
      return checkStandalone(response);
    })
    .then((response) => {
      if (response.data.status) {
        console.log("success");
      } else {
        console.log("Failed");
      }
    })
    .catch((e) => {
      console.log(e.message);
      if (e.response) {
        console.log(e.response.data);
      }
    });
}

function StandAloneProof5() {
  const [proof, setProof] = useState({
    children: [],
    sentence: "",
    sentenceProofRule: "",
    sentenceProofProofs: "",
    sentenceProofArgs: "",
    key: last,
  });
  return (
    <Container>
      <Proof
        proof={proof}
        onChange={(proof) => {
          setProof(proof);
        }}
        tab={0}
        numLabel=""
      />
      <Row>
        <Col>
          <Button
            variant="primary"
            className="mt-3 w-100"
            onClick={() => {
              checkProof(proof);
            }}
          >
            Check Proof
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default StandAloneProof5;
