import React, { useEffect, useState } from "react";
import { Alert, Button, Container, ListGroup, Row } from "react-bootstrap";
import {
  listUsersNotAssignedStatement,
  sendStatement,
} from "./MainCommunication";
import { Redirect, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SendTheoremStatement() {
  let query = useQuery();
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState(<></>);
  const [redirect, setRedirect] = useState(null);
  useEffect(() => {
    const id = query.get("id");
    listUsersNotAssignedStatement(id)
      .then((response) => {
        setUsers(
          response.data.map((user) => {
            const u = { ...user };
            u.checked = false;
            return u;
          })
        );
        if (response.data.length === 0) {
          setFeedback(
            <Alert variant="primary">
              All available users have received the theorem statement
            </Alert>
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
  const handleSend = () => {
    const usersToSend = users.filter((u) => u.checked).map((u) => u.id);
    const statementId = query.get("id");
    sendStatement(statementId, usersToSend)
      .then(() => {
        setFeedback(<Alert variant="success">Statement sent...</Alert>);
        setTimeout(() => {
          setRedirect(
            <Redirect to={"/owned_statement?id=" + statementId} push />
          );
        }, 2000);
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
  if (redirect) {
    return redirect;
  }
  return (
    <Container className="vh-100">
      <Row className="mt-3 mb-3">
        <h2>List of users</h2>
      </Row>
      <Row>{feedback}</Row>
      <Row className="h-75">
        <ListGroup className="w-100 overflow-auto h-100">
          {users.map((user, index) => {
            return (
              <ListGroup.Item
                key={user.id}
                className="w-100 d-flex justify-content-between"
              >
                {user.first_name + " " + user.last_name.toUpperCase()}
                <input
                  type="checkbox"
                  aria-label="Checkbox for selecting user"
                  checked={user.checked}
                  onChange={(event) => {
                    const newUsers = users.slice();
                    newUsers[index] = { ...newUsers[index] };
                    newUsers[index].checked = event.target.checked;
                    setUsers(newUsers);
                  }}
                />
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Row>
      <Row className="justify-content-between">
        <Button
          onClick={() => {
            const statementId = query.get("id");
            const path = "/owned_statement?id=" + statementId;
            setRedirect(<Redirect to={path} />);
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSend}>Send</Button>
      </Row>
    </Container>
  );
}

export default SendTheoremStatement;
