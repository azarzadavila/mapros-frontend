import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import Menu from "./menu";
import Login from "./Login";
import CheckSentence from "./CheckSentence";
import { cookies, ROOT_URL } from "./Constants";
import ProofEditor from "./ProofEditor";
import SentenceToXml from "./SentenceToXml";
import StandAloneProof from "./StandAloneProof";
import {FormalCommuncation} from "./FormalCommunication";

async function checkAuth() {
  const token = cookies.get("token");
  if (token) {
    return await fetch(ROOT_URL + "auth/check/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    }).then(
      (response) => {
        return response.ok;
      },
      (networkError) => {
        console.log(networkError.message);
      }
    );
  }
  return false;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      main: <div></div>,
    };
  }

  componentDidMount() {
    checkAuth().then((response) => {
      response
        ? this.setState({ main: <Redirect to="/menu/" /> })
        : this.setState({ main: <Redirect to="/login/" /> });
    });
  }

  render() {
    return (
      <Router>
        <Route
          exact={true}
          path="/"
          render={() => {
            return this.state.main;
          }}
        />
        <Route path="/login/" component={Login} />
        <Route path="/menu/" component={Menu} />
        <Route path="/check_sentence/" component={CheckSentence}/>
        <Route path="/proof_editor/" component={ProofEditor}/>
        <Route path="/sentence_to_xml/" component={SentenceToXml}/>
        <Route path="/standalone_proof/" component={StandAloneProof}/>
        <Route path="/api-test/" component={FormalCommuncation}/>
      </Router>
    );
  }
}

export default App;
