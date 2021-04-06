import React, { useEffect, useState } from "react";
import { Alert, Button, Container, ListGroup, Row } from "react-bootstrap";
import { listOwnedTheoremStatements, listTheoremProofs } from "./MainCommunication";
import { Redirect } from "react-router-dom";

function ListTheoremProofs() {
  const [children, setChildren] = useState([]);
  const [feedback, setFeedback] = useState(
    <Alert variant="primary">Loading...</Alert>
  );
  const [redirect, setRedirect] = useState(null);
  useEffect(() => {
    listTheoremProofs()
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
  if (redirect) {
    return redirect;
  }
  return (
    <Container className="vh-100">
      <Row className="justify-content-between mt-3 mb-3">
        <h2>List of theorem statements to prove</h2>
      </Row>
      <Row>{feedback}</Row>
      <Row className="h-75">
        <ListGroup className="w-100 overflow-auto h-100">
          {children.map((child) => {
            return (
              <ListGroup.Item
                className="justify-content-between d-flex"
                key={child.id}
              >
                <Button
                  onClick={() => {
                    setRedirect(
                      <Redirect to={"/theorem_proof?id=" + child.id} push />
                    );
                  }}
                  className="w-100 d-flex justify-content-start border-0 bg-transparent text-body"
                >
                  {child.theorem_statement.name}
                </Button>
                <Button className="btn-sm btn-danger">X</Button>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Row>
    </Container>
  );
}

export default ListTheoremProofs;
