import React, { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

function LineEditor({ line, onChange, numLabel }) {
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
        <Button variant="primary">S</Button>
      </Col>
    </Row>
  );
}

function LeanEditor() {
  const [lines, setLines] = useState([]);
  const handleLine = (index, value) => {
    const newLines = lines.slice();
    newLines[index] = value;
    setLines(newLines);
  };
  const addLine = (event) => {
    setLines(lines.concat(""));
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

function LeanPanel({msg}) {
  return <p>{msg}</p>
}

function LeanView() {
  return (
    <Container>
      <Row>
        <Col xs={8}>
          <LeanEditor />
        </Col>
        <Col xs={4}>
          <LeanPanel msg={"Hello World"}/>
        </Col>
      </Row>
    </Container>
  );
}

export default LeanView;
