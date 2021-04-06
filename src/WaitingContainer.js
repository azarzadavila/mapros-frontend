import React from "react";
import { Container, Spinner } from "react-bootstrap";

function WaitingContainer({ waitVisibility, children }) {
  return (
    <Container>
      {children}
      <div
        className={
          "fixed-top w-100 h-100 d-flex justify-content-center align-items-center" +
          " " +
          waitVisibility
        }
      >
        <div
          className={"fixed-top w-100 h-100 bg-dark"}
          style={{ opacity: 0.6 }}
        />
        <Spinner
          animation="border"
          role="status"
          style={{ width: "5rem", height: "5rem" }}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    </Container>
  );
}

export default WaitingContainer;
