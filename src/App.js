import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Menu from "./menu";
import Login from "./Login";
import { cookies } from "./Constants";
import MainView from "./MainView";
import TestMainView from "./TestMainView";
import CreateAccount from "./CreateAccount";
import ConfirmAccount from "./ConfirmAccount";
import ResetPassword from "./ResetPassword";
import AskReset from "./AskReset";
import TestAPI from "./TestAPI";
import { checkToken } from "./MainCommunication";
import ListOwnedTheoremStatements from "./ListOwnedTheoremStatements";
import TheoremStatementView from "./TheoremStatementView";
import SendTheoremStatement from "./SendTheoremStatement";
import TheoremProofView from "./TheoremProofView";
import ListTheoremProofs from "./ListTheoremProofs";
import UsersTheoremStatement from "./UsersTheoremStatement";

function AuthenticatedComponent({ component }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      checkToken(token)
        .then(() => setIsAuthenticated(true))
        .catch(() => setIsAuthenticated(false));
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  if (isAuthenticated) {
    return component;
  } else if (isAuthenticated === null) {
    return <></>;
  } else {
    return <Redirect to="/login/" />;
  }
}

function AuthenticatedRoute({ path, component }) {
  return (
    <Route path={path}>
      <AuthenticatedComponent component={component} />
    </Route>
  );
}

function App() {
  return (
    <Router>
      <Switch className="w-100">
        <Route exact={true} path="/">
          <Redirect to="/menu/" />
        </Route>
        <Route path="/login/" component={Login} />
        <AuthenticatedRoute path="/menu/" component={<Menu />} />
        <Route path="/main/" component={MainView} />
        <Route path="/maintest/" component={TestMainView} />
        <Route path="/createaccount/" component={CreateAccount} />
        <Route path="/confirm_account" component={ConfirmAccount} />
        <Route path="/reset_password" component={ResetPassword} />
        <Route path="/ask_reset/" component={AskReset} />
        <AuthenticatedRoute path="/test_api/" component={<TestAPI />} />
        <AuthenticatedRoute
          path="/list_owned_statements/"
          component={<ListOwnedTheoremStatements />}
        />
        <AuthenticatedRoute
          path="/owned_statement"
          component={<TheoremStatementView />}
        />
        <AuthenticatedRoute
          path="/send_statement"
          component={<SendTheoremStatement />}
        />
        <AuthenticatedRoute
          path="/theorem_proof"
          component={<TheoremProofView />}
        />
        <AuthenticatedRoute
          path="/list_theorem_proofs/"
          component={<ListTheoremProofs />}
        />
        <AuthenticatedRoute
          path="/users_statement"
          component={<UsersTheoremStatement />}
        />
      </Switch>
    </Router>
  );
}

export default App;
