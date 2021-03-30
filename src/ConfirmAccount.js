import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Container } from "react-bootstrap";
import { Redirect, useLocation } from "react-router-dom";
import { confirmAccount } from "./MainCommunication";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ConfirmAccount() {
  let query = useQuery();
  const [feedback, setFeedback] = useState(
    <Alert variant="primary">Checking link...</Alert>
  );
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    const tokenURL = query.get("token");
    if (tokenURL) {
      confirmAccount(tokenURL)
        .then(() => {
          setFeedback(
            <Alert variant="success">
              Your account has been activated !<br />
              You will know be redirected to the login page.
            </Alert>
          );
          setTimeout(() => setRedirect(true), 3000);
        })
        .catch(() => {
          setFeedback(
            <Alert variant="danger">
              Incorrect URL token. It may be that the link is now outdated.
            </Alert>
          );
        });
    } else {
      setFeedback(<Alert variant="danger">No URL token provided</Alert>);
    }
  }, []);
  if (redirect) {
    return <Redirect to="/login/" />;
  }
  return <Container>{feedback}</Container>;
}

export default ConfirmAccount;
