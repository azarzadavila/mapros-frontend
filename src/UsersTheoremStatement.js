import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Container,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { listUsersStatement, removeUserStatement } from "./MainCommunication";
import { Redirect, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function DeleteModal({ onConfirm, onHide }) {
  return (
    <Modal show onHide={onHide} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Are you sure you want to remove this user from the people that can see
          and complete the statement ?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            onConfirm();
            onHide();
          }}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function UsersTheoremStatement() {
  let query = useQuery();
  const [children, setChildren] = useState([]);
  const [feedback, setFeedback] = useState(<></>);
  const [redirect, setRedirect] = useState(null);
  const [modal, setModal] = useState(<></>);
  const refresh = () => {
    const id = query.get("id");
    listUsersStatement(id)
      .then((response) => {
        setChildren(response.data);
        if (response.data.length === 0) {
          setFeedback(
            <Alert variant="primary">No user has received the statement</Alert>
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
  };
  useEffect(refresh, []);
  const handleDelete = (id) => {
    removeUserStatement(id)
      .then(() => {
        setFeedback(<Alert variant="success">User deleted from list...</Alert>);
        setTimeout(() => refresh(), 1000);
      })
      .catch(() => {
        setFeedback(
          <Alert variant="danger">Failed to delete user from list</Alert>
        );
      });
  };
  if (redirect) {
    return redirect;
  }
  return (
    <Container className="vh-100">
      {modal}
      <Row className="mt-3 mb-3">
        <h2>List of users having the statement</h2>
      </Row>
      <Row>{feedback}</Row>
      <Row className="h-75">
        <ListGroup className="w-100 overflow-auto h-100">
          {children.map((child, index) => {
            const user = child.user;
            return (
              <ListGroup.Item
                key={child.id}
                className="w-100 d-flex justify-content-between"
              >
                {user.first_name + " " + user.last_name.toUpperCase()}
                <Button
                  variant="danger"
                  onClick={() => {
                    setModal(
                      <DeleteModal
                        onConfirm={() => {
                          handleDelete(child.id);
                        }}
                        onHide={() => {
                          setModal(<></>);
                        }}
                      />
                    );
                  }}
                >
                  X
                </Button>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Row>
      <Row className="justify-content-start">
        <Button
          onClick={() => {
            const statementId = query.get("id");
            const path = "/owned_statement?id=" + statementId;
            setRedirect(<Redirect to={path} />);
          }}
        >
          Back
        </Button>
      </Row>
    </Container>
  );
}

export default UsersTheoremStatement;
