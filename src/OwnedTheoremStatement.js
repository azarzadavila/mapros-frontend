import React, { useEffect, useState } from "react";
import { Alert, Button, Container, ListGroup, Row } from "react-bootstrap";
import { listOwnedTheoremStatements } from "./MainCommunication";
import ListOwnedTheoremStatements from "./ListOwnedTheoremStatements";

function OwnedTheoremStatements() {
  const [component, setComponent] = useState(<ListOwnedTheoremStatements setComponentParent={setComponent}/>);
  return { component };
}

export default OwnedTheoremStatements;
