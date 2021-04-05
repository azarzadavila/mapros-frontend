import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import React from "react";

export function MenuItem(props) {
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
