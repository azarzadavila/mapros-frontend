import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Col, FormControl, Row } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { cookies, ROOT_URL } from "./Constants";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      message: null,
      redirect: null,
    };
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    fetch(ROOT_URL + "auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then(
        (response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Username or password incorrect.");
        },
        (networkError) => {
          console.log(networkError.message);
          throw new Error(networkError.message);
        }
      )
      .then((jsonResponse) => {
        if (jsonResponse) {
          cookies.set("token", jsonResponse.token, { path: "/" });
          this.setState({ redirect: "/menu/" });
        }
      })
      .catch((error) => {
        const message = (
          <Row className={"justify-content-center mb-3"}>
            <Col md={3}>
              <Alert variant="danger">{error.message}</Alert>
            </Col>
          </Row>
        );
        this.setState({ message: message });
      });
    event.preventDefault();
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {this.state.message}
          <Row className={"justify-content-center"}>
            <Col md={3}>
              <label>Username</label>
              <FormControl
                className="mb-3"
                placeholder="Username"
                type="text"
                required
                value={this.state.username}
                onChange={this.handleChangeUsername}
              />
            </Col>
          </Row>
          <Row className={"justify-content-center"}>
            <Col md={3}>
              <label>Password</label>
              <FormControl
                className="mb-3"
                placeholder="Password"
                type="password"
                required
                value={this.state.password}
                onChange={this.handleChangePassword}
              />
            </Col>
          </Row>
          <Row className={"justify-content-center"}>
            <Col md={3}>
              <FormControl type="submit" value="Sign In" />
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

export default Login;
