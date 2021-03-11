import React from "react";
import {
  Container,
  FormControl,
  InputGroup,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";

function MainView() {
  return (
    <Container>
      <Row className="mb-3">
        <Col xs={8}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Theorem Name :</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder="name" aria-label="name" />
          </InputGroup>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={4}>
          If,<Button className="ml-3">+</Button>
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          <label>Then,</label>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={8}>
          <FormControl placeholder="goal" aria-label="goal" />
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          Proof:
          <Button className="ml-3 mb-3">+</Button>
          <Button className="ml-3 mb-3">S</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default MainView;
