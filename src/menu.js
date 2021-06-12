import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Row } from "react-bootstrap";
import logo_definitions from "./img/book-fill.svg";
import logo_symbols from "./img/pi.svg";
import "./menu.css";
import { Redirect } from "react-router-dom";
import { cookies } from "./Constants";
import { MenuItem } from "./MenuUtils";

function Menu() {
  const [redirect, setRedirect] = useState(null);
  const logOut = () => {
    cookies.remove("token", { path: "/" });
    setRedirect(<Redirect to="/login/" />);
  };
  if (redirect) {
    return redirect;
  }
  return (
    <Container>
      <Row className="d-flex justify-content-end mt-3 mb-3">
        <Button className="btn-danger" onClick={logOut}>
          Log Out
        </Button>
      </Row>
      <Row>
        <MenuItem name="Main" img={logo_symbols} alt="Main" link="/main/" />
        <MenuItem
          name="List of owned statements"
          img={logo_definitions}
          alt="List of owned statements"
          link="/list_owned_statements/"
        />
        <MenuItem
          name="List of theorems to prove"
          img={logo_definitions}
          alt="List of theorems to prove"
          link="/list_theorem_proofs/"
        />
      </Row>
    </Container>
  );
}

export default Menu;
