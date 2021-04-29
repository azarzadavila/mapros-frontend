import React from "react";
import { BackBanner } from "./LinkBanner";
import MainViewParent from "./MainViewParent";

function TheoremProofView() {
  return (
    <BackBanner to="/list_theorem_proofs/">
      <MainViewParent isStatementReadOnly={true} viewType={"proofView"} />
    </BackBanner>
  );
}

export default TheoremProofView;
