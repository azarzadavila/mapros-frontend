import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Container, FormControl, Row} from "react-bootstrap";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeUsername(event) {
        this.setState({username: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event){
        alert('Username ' + this.state.username + ' Password : ' + this.state.password);
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <Row className={"justify-content-center"}>
                        <Col md={3}>
                            <label>Username</label>
                            <FormControl className="mb-3" placeholder="Username" type="text" required value={this.state.username} onChange={this.handleChangeUsername}/>
                        </Col>
                    </Row>
                    <Row className={"justify-content-center"}>
                        <Col md={3}>
                            <label>Password</label>
                            <FormControl className="mb-3" placeholder="Password" type="password" required value={this.state.password} onChange={this.handleChangePassword}/>
                        </Col>
                    </Row>
                    <Row className={"justify-content-center"}>
                        <Col md={3}>
                            <FormControl type="submit" value="Sign In"/>
                        </Col>
                    </Row>
                </form>
            </div>
        );
    }
}


function App() {
    return (
        <Container>
            <Login/>
        </Container>
    );
}

export default App;
