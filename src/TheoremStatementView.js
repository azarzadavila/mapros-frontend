import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import {
  askState,
  createTheoremStatement,
  getOwnedTheoremStatement,
  updateTheoremStatement,
} from "./MainCommunication";
import MathQuillElement from "./MathQuillElement";
import { addStyles } from "react-mathquill";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import {
  deleteFromList,
  Goal,
  preprocessLatex,
  splitLatex,
} from "./MainViewUtils";
import WaitingContainer from "./WaitingContainer";

addStyles();

function HypothesisLine({
  ident,
  onChange,
  onDelete,
  initItems = [{ id: 0, value: "" }],
}) {
  return (
    <Row className="mb-3">
      <Col xs={8}>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>{ident}</InputGroup.Text>
          </InputGroup.Prepend>
          <MathQuillElement setValue={onChange} initItems={initItems} />
          <InputGroup.Append>
            <Button onClick={onDelete}>-</Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
    </Row>
  );
}

let lastHyp = 0;

const genInitHypotheses = (hypotheses) => {
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
    lastHyp += 1;
    return toRet;
  });
};

const genInitGoal = (goal) => {
  let res = splitLatex(preprocessLatex(goal));
  return res.map((val, index) => {
    return { id: index, value: val };
  });
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function TheoremStatementView() {
  let query = useQuery();
  const [redirect, setRedirect] = useState(null);
  const [hypotheses, setHypotheses] = useState([]);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [leanError, setLeanError] = useState("NO MESSAGE");
  const [waitVisibility, setWaitVisibility] = useState("invisible");
  const [initialGoal, setInitGoal] = useState(
    <MathQuillElement setValue={setGoal} />
  );
  const [pingPong, setPingPong] = useState(true);
  useEffect(() => {
    const id = query.get("id");
    if (id) {
      getOwnedTheoremStatement(id)
        .then((response) => {
          setName(response.data.name);
          setHypotheses(genInitHypotheses(response.data.hypotheses));
          setGoal(response.data.goal);
          const initGoalItems = genInitGoal(response.data.goal);
          // TODO adding the <div> is hack to force re-rendering
          setInitGoal(
            <div>
              <MathQuillElement setValue={setGoal} initItems={initGoalItems} />
            </div>
          );
        })
        .catch((error) => {
          //TODO error
          console.log(error);
        });
    }
  }, [pingPong]);
  const onChangeName = (event) => {
    setName(event.target.value);
  };
  const addHypothesis = (event) => {
    const newHypotheses = hypotheses.slice();
    newHypotheses.push({
      ident: "",
      text: "",
      id: lastHyp,
    });
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
  const handleHypothesisDelete = deleteFromList(hypotheses, setHypotheses);

  const hypothesesContent = () => {
    return hypotheses.map((hypothesis) => hypothesis.text);
  };
  const changeWithResponse = (data) => {
    const newHypotheses = hypotheses.slice();
    data.hypotheses_ident.forEach((ident, index) => {
      newHypotheses[index] = { ...newHypotheses[index] };
      newHypotheses[index].ident = ident;
    });
    setHypotheses(newHypotheses);
    setInitialMessage(data.initial_goal);
    if (data.error) {
      setLeanError(data.error);
    } else {
      setLeanError("NO MESSAGE");
    }
  };

  const genToSend = (index) => {
    return {
      name: name,
      hypotheses: hypothesesContent(),
      goal: goal,
      proofs: [],
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
          setLeanError(error.response.data.detail);
        } else {
          console.log(error);
          setLeanError("ERROR");
        }
        setWaitVisibility("invisible");
      });
  };
  const history = useHistory();
  const handleSave = (event) => {
    let hyps = hypothesesContent();
    hyps = hyps.join("\n");
    const toSend = { name: name, hypotheses: hyps, goal: goal };
    const id = query.get("id");
    if (id) {
      console.log("ID BEFORE SEND " + id);
      console.log(id);
      updateTheoremStatement(id, toSend)
        .then((response) => {
          console.log(response);
          history.replace("/owned_statement?id=" + response.data.id);
          setPingPong(!pingPong);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      createTheoremStatement(toSend)
        .then((response) => {
          console.log(response);
          history.replace("/owned_statement?id=" + response.data.id);
          setPingPong(!pingPong);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  if (redirect) {
    return redirect;
  }
  return (
    <WaitingContainer>
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
        <Col xs={2}>
          <Button onClick={handleSave}>Save</Button>
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
            initItems={hypothesis.initItems}
          />
        );
      })}
      <Row>
        <Col xs={8}>
          <label>Then,</label>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={8}>{initialGoal}</Col>
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
      <Alert className="w-100" variant="primary">
        {leanError}
      </Alert>
    </WaitingContainer>
  );
}

export default TheoremStatementView;
