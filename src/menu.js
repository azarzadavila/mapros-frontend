import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import logo_named_statements from "./img/journals.svg";
import logo_contexts from "./img/x-diamond-fill.svg";
import logo_definitions from "./img/book-fill.svg";
import logo_symbols from "./img/pi.svg";
import "./menu.css";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Link,
} from "react-router-dom";

function MenuItem(props) {
  return (
    <Col md={4} xs={12} className="mb-3">
      <Link to={props.link}>
        <Card className="text-center h-100">
          <Card.Body>
            <Card.Img
              variant="top"
              src={props.img}
              alt={props.alt}
              className="logo-img"
            />
            <Card.Title>
              <hr />
              {props.name}
            </Card.Title>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
}

function Menu() {
  return (
    <Container>
      <Row>
        <MenuItem name="Main" img={logo_symbols} alt="Main" link="/main/" />
        <MenuItem
          name="List of owned statements"
          img={logo_definitions}
          alt="List of owned statements"
          link="/list_owned_statements/"
        />
      </Row>
    </Container>
  );
}

export default Menu;
