import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";

export function LinkBanner({ children, to, btn, push }) {
  const [redirect, setRedirect] = useState(false);
  if (redirect) {
    return <Redirect to={to} push={push} />;
  }
  return (
    <div>
      <div className="w-100">
        <div className="bg-primary">
          <Button
            className="btn-light mt-1 mb-1 ml-1"
            onClick={() => setRedirect(true)}
          >
            {btn}
          </Button>
        </div>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function MenuBanner({ children }) {
  return (
    <LinkBanner to="/menu/" push btn={"HOME"}>
      {children}
    </LinkBanner>
  );
}

export function BackBanner({ to, children}) {
  return (
    <LinkBanner to={to} btn={"BACK"}>
      {children}
    </LinkBanner>
  );
}
