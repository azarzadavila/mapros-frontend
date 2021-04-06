import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Row } from "react-bootstrap";
import logo_definitions from "./img/book-fill.svg";
import logo_symbols from "./img/pi.svg";
import "./menu.css";
import { Redirect } from "react-router-dom";
import { cookies } from "./Constants";
import { MenuItem } from "./MenuUtils";

function UnauthenticatedMenu() {
  const [redirect, setRedirect] = useState(null);
  const logIn = () => {
    setRedirect(<Redirect to="/login/" />);
  };
  if (redirect) {
    return redirect;
  }
  return (
    <Container>
      <Row className="d-flex justify-content-end mt-3 mb-3">
        <Button variant="primary" onClick={logIn}>
          Log In
        </Button>
      </Row>
      <Row>
        <MenuItem name="Main" img={logo_symbols} alt="Main" link="/main/" />
      </Row>
    </Container>
  );
}

export default UnauthenticatedMenu;
