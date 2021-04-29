import React from "react";
import { BackBanner } from "./LinkBanner";
import MainViewParent from "./MainViewParent";

function TheoremStatementView() {
  return (
    <BackBanner to="/list_owned_statements/">
      <MainViewParent isProofView={false} viewType={"statementView"} />
    </BackBanner>
  );
}

export default TheoremStatementView;
