import React, { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { end, LeanFile, start, stateAt, sync } from "./LeanCommunication";

function LineEditor({ line, onChange, numLabel, onClick }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };
  return (
    <Row>
      <Col xs={10}>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>{numLabel}</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="text" onChange={handleChange} value={line} />
        </InputGroup>
      </Col>
      <Col xs={2}>
        <Button variant="primary" onClick={(event) => onClick()}>
          S
        </Button>
      </Col>
    </Row>
  );
}

function LeanEditor({ changeMsg, lines, setLines }) {
  const handleLine = (index, value) => {
    const newLines = lines.slice();
    newLines[index] = value;
    setLines(newLines);
  };
  const addLine = (event) => {
    setLines(lines.concat(""));
  };
  const handleClick = (index) => {
    console.log("After index " + index);
    console.log("line " + index);
    console.log("col " + lines[index].length);
    stateAt(new LeanFile(lines), index + 1, lines[index].length)
      .then((response) => {
        changeMsg(JSON.stringify(response.data.messages));
      })
      .catch((error) => {
        changeMsg(error.message);
      });
  };
  return (
    <>
      <div>
        {lines.map((item, index) => {
          return (
            <LineEditor
              line={item}
              onChange={(value) => {
                handleLine(index, value);
              }}
              numLabel={(index + 1).toString()}
              key={index}
              onClick={() => handleClick(index)}
            />
          );
        })}
      </div>
      <Row>
        <Button variant="primary" onClick={addLine}>
          +
        </Button>
      </Row>
    </>
  );
}

function LeanPanel({ msg }) {
  return <p>{msg}</p>;
}

function LeanView() {
  const [msg, setMsg] = useState("");
  const [lines, setLines] = useState([]);
  const changeMsg = (value) => {
    setMsg(value);
  };
  return (
    <Container>
      <Row>
        <Col xs={8}>
          <Row>
            <Col xs={4}>
              <Button
                variant="primary"
                onClick={() =>
                  start().catch((error) => changeMsg(error.message))
                }
              >
                START
              </Button>
            </Col>
            <Col xs={4}>
              <Button
                variant="primary"
                onClick={() => end().catch((error) => changeMsg(error.message))}
              >
                END
              </Button>
            </Col>
            <Col xs={4}>
              <Button
                variant="primary"
                onClick={() =>
                  sync(new LeanFile(lines))
                    .then((response) =>
                      changeMsg(JSON.stringify(response.data.messages))
                    )
                    .catch((error) => changeMsg(error.message))
                }
              >
                SYNC
              </Button>
            </Col>
          </Row>
          <LeanEditor changeMsg={changeMsg} lines={lines} setLines={setLines} />
        </Col>
        <Col xs={4}>
          <LeanPanel msg={msg} />
        </Col>
      </Row>
    </Container>
  );
}

export default LeanView;
