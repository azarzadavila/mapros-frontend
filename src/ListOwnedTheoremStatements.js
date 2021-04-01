import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import { listOwnedTheoremStatements } from "./MainCommunication";

const genFake = () => {
  const res = [];
  for (let i = 0; i < 100; i++) {
    res.push({ name: "theo" + i, id: i });
  }
  return res;
};

function ListOwnedTheoremStatements() {
  const [children, setChildren] = useState([]);
  const [feedback, setFeedback] = useState(
    <Alert variant="primary">Loading...</Alert>
  );
  useEffect(() => {
    listOwnedTheoremStatements()
      .then((response) => {
        setChildren(response.data);
        if (response.data.length === 0) {
          setFeedback(
            <Alert variant="primary">No theorem statement registered</Alert>
          );
        } else {
          setFeedback(<></>);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.detail) {
          setFeedback(
            <Alert variant="danger">{error.response.data.detail}</Alert>
          );
        } else {
          setFeedback(<Alert variant="danger">{error.message}</Alert>);
        }
      });
  }, []);
  return (
    <Container className="vh-100">
      <Row className="justify-content-between mt-3 mb-3">
        <h2>List of owned theorem statements</h2>
        <Button>New theorem statement</Button>
      </Row>
      <Row>{feedback}</Row>
      <Row className="h-75">
        <ListGroup className="w-100 overflow-auto h-100">
          {children.map((child) => {
            return (
              <ListGroup.Item
                className="justify-content-between d-flex"
                key={child.id}
                action
              >
                {child.name}
                <Button className="btn-sm btn-danger">X</Button>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Row>
    </Container>
  );
}

export default ListOwnedTheoremStatements;
