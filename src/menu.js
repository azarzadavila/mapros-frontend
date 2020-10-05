import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import logo_named_statements from "./img/journals.svg";
import logo_contexts from "./img/x-diamond-fill.svg";
import logo_definitions from "./img/book-fill.svg";
import logo_symbols from "./img/pi.svg";
import "./menu.css";

function MenuItem(props) {
  return (
    <Col md={4} xs={12} className="mb-3">
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
    </Col>
  );
}

function Menu() {
  return (
    <Container>
      <Row>
        <MenuItem
          name="Named Statements"
          img={logo_named_statements}
          alt="Named Statements logo"
        />
        <MenuItem name="Contexts" img={logo_contexts} alt="Contexts logo" />
        <MenuItem
          name="Definitions"
          img={logo_definitions}
          alt="Definitions logo"
        />
        <MenuItem name="Symbols" img={logo_symbols} alt="Symbols logo" />
      </Row>
    </Container>
  );
}

export default Menu;
