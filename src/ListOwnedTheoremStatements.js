import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Container,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import {
  deleteStatement,
  listOwnedTheoremStatements,
} from "./MainCommunication";
import { Redirect } from "react-router-dom";
import { MenuBanner } from "./LinkBanner";

function DeleteModal({ onConfirm, onHide }) {
  return (
    <Modal show onHide={onHide} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Are you sure you want to delete the selected statement ? It will be
          also deleted for all the people who received it.
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

function ListOwnedTheoremStatements() {
  const [children, setChildren] = useState([]);
  const [feedback, setFeedback] = useState(
    <Alert variant="primary">Loading...</Alert>
  );
  const [redirect, setRedirect] = useState(null);
  const [modal, setModal] = useState(<></>);
  const refresh = () => {
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
  };
  useEffect(refresh, []);
  const handleDelete = (id) => {
    deleteStatement(id)
      .then(() => {
        setFeedback(<Alert variant="success">Delete successful...</Alert>);
        setTimeout(() => refresh(), 1000);
      })
      .catch(() => {
        setFeedback(<Alert variant="danger">Failed to delete...</Alert>);
      });
  };
  if (redirect) {
    return redirect;
  }
  return (
    <MenuBanner>
      {modal}
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
                  <Button
                    className="btn-sm btn-danger"
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
      </Container>
    </MenuBanner>
  );
}

export default ListOwnedTheoremStatements;
