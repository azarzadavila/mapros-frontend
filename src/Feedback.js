import React from "react";
import { Alert, Badge } from "react-bootstrap";
function NaturalToLeanErrorFeedback({ detail }) {
  return (
    <Alert variant="danger">
      <Badge variant="secondary" className="mr-2">
        Translation Error
      </Badge>
      {detail}
    </Alert>
  );
}
function LeanErrorFeedback({ detail }) {
  return (
    <Alert variant="danger">
      <Badge variant="secondary" className="mr-2">
        Lean Error
      </Badge>
      {detail}
    </Alert>
  );
}
function ErrorFeedback({ detail }) {
  detail = detail ? detail : "NETWORK ERROR";
  return <Alert variant="danger">{detail}</Alert>;
}
function ProofInProgressFeedback() {
  return <Alert variant="primary">Proof in progress</Alert>;
}
function ProofFinishedFeedback() {
  return <Alert variant="success">Proof finished</Alert>;
}
function Feedback({ variant, detail = null }) {
  if (variant === "naturalToLeanError") {
    return <NaturalToLeanErrorFeedback detail={detail} />;
  }
  if (variant === "leanError") {
    return <LeanErrorFeedback detail={detail} />;
  }
  if (variant === "proofInProgress") {
    return <ProofInProgressFeedback />;
  }
  if (variant === "proofFinished") {
    return <ProofFinishedFeedback />;
  }
  if (variant === "error") {
    return <ErrorFeedback detail={detail} />;
  }
  throw new Error("Unrecognized feedback type");
}

export default Feedback;
