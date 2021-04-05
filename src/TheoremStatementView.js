import React, { useEffect, useState } from "react";
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
import {
  askState,
  createTheoremStatement,
  getOwnedTheoremStatement,
  getTheoremStatement,
  updateTheoremStatement,
} from "./MainCommunication";
import MathQuillElement from "./MathQuillElement";
import { addStyles, StaticMathField } from "react-mathquill";
import { Redirect, useLocation, useHistory } from "react-router-dom";

addStyles();

function splitLatex(s) {
  return s.split("$");
}

function replaceMathbb(match, group0) {
  return "\\" + group0;
}

function preprocessLatex(s) {
  return s.replace(/\\mathbb\{(\w)\}/g, replaceMathbb);
}

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

const getOutput = (index, value) => {
  if (index % 2 === 0) {
    return <span key={index}>{value}</span>;
  } else {
    return (
      <StaticMathField key={index}>{preprocessLatex(value)}</StaticMathField>
    );
  }
};

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
  const ret = res.map((val, index) => {
    return { id: index, value: val };
  });
  return ret;
};

function Goal({ goal }) {
  return (
    <Col xs={4}>
      <Alert variant="dark">
        {splitLatex(goal).map((val, index) => getOutput(index, val))}
      </Alert>
    </Col>
  );
}

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

export default TheoremStatementView;
