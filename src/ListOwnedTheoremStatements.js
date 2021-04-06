import React, { useEffect, useState } from "react";
import { Alert, Button, Container, ListGroup, Row } from "react-bootstrap";
import { listOwnedTheoremStatements } from "./MainCommunication";
import { Redirect } from "react-router-dom";
import { MenuBanner } from "./LinkBanner";

function ListOwnedTheoremStatements() {
  const [children, setChildren] = useState([]);
  const [feedback, setFeedback] = useState(
    <Alert variant="primary">Loading...</Alert>
  );
  const [redirect, setRedirect] = useState(null);
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
  if (redirect) {
    return redirect;
  }
  return (
    <MenuBanner>
      <Container className="vh-100">
        <Row className="justify-content-between mt-3 mb-3">
          <h2>List of owned theorem statements</h2>
          <Button
            onClick={() => {
              setRedirect(<Redirect to="/owned_statement/" push />);
            }}
          >
            New theorem statement
          </Button>
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
                        <Redirect to={"/owned_statement?id=" + child.id} push />
                      );
                    }}
                    className="w-100 d-flex justify-content-start border-0 bg-transparent text-body"
                  >
                    {child.name}
                  </Button>
                  <Button className="btn-sm btn-danger">X</Button>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Row>
      </Container>
    </MenuBanner>
  );
}

export default ListOwnedTheoremStatements;
