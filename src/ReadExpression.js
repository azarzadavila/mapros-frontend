import React from "react";
import { getOutput, splitLatex } from "./MainViewUtils";
import { Alert, Badge } from "react-bootstrap";

function Ident({ children }) {
  return (
    <Badge pill variant="dark">
      {children}
    </Badge>
  );
}

function Hypothesis({ children, ident }) {
  return (
    <Alert variant="dark">
      <Ident>{ident}</Ident>
      {children}
    </Alert>
  );
}

function Sentence({ children, ident, isLean }) {
  const badge = isLean ? <Badge variant="warning">Lean</Badge> : <></>;
  return (
    <Alert variant="dark">
      <Ident>{ident}</Ident>
      {badge}
      {children}
    </Alert>
  );
}

function InitGoal({ children }) {
  return <Alert variant="dark">{children}</Alert>;
}

function Goal({ children, isLean }) {
  const badge = isLean ? <Badge variant="warning">Lean</Badge> : <></>;
  return (
    <Alert variant="primary">
      {badge}
      {children}
    </Alert>
  );
}

function ReadExpression({ variant, ident, isLean = false, children }) {
  const child = splitLatex(children).map((val, index) => getOutput(index, val));
  if (variant === "hypothesis") {
    return <Hypothesis ident={ident}>{child}</Hypothesis>;
  }
  if (variant === "sentence") {
    return (
      <Sentence ident={ident} isLean={isLean}>
        {child}
      </Sentence>
    );
  }
  if (variant === "initGoal") {
    return <InitGoal>{child}</InitGoal>;
  }
  if (variant === "goal") {
    return <Goal isLean={isLean}>{child}</Goal>;
  }
  throw new Error("Unrecognized readexpression type");
}

export default ReadExpression;
