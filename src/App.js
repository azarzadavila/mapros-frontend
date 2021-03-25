import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import Menu from "./menu";
import Login from "./Login";
import { cookies, ROOT_URL } from "./Constants";
import MainView from "./MainView";
import TestMainView from "./TestMainView";

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
  onCheckAuth() {
    checkAuth().then((response) => {
      response
        ? this.setState({ main: <Redirect to="/menu/" /> })
        : this.setState({ main: <Redirect to="/login/" /> });
    });
  }
  componentDidMount() {}

  render() {
    return (
      <Router>
        <Route
          exact={true}
          path="/"
          component={MainView}
        />
        <Route path="/login/" component={Login} />
        <Route path="/menu/" component={Menu} />
        <Route path="/main/" component={MainView} />
        <Route path="/maintest/" component={TestMainView} />
      </Router>
    );
  }
}

export default App;
