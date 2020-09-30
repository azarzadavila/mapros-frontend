import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Container, FormControl, Row} from "react-bootstrap";

// const root_url = 'http://localhost:8000/';
const root_url = 'https://mapros.herokuapp.com/';

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

    handleSubmit(event) {
        fetch(root_url + 'auth/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: this.state.username, password: this.state.password})
            }).then(response => {
            if (response.ok) {
                return response.json();
            }
            alert('Incorrect username or password');
        }, networkError => {
            console.log(networkError.message);
        }).then(jsonResponse => {
            console.log(jsonResponse);
        });
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <Row className={"justify-content-center"}>
                        <Col md={3}>
                            <label>Username</label>
                            <FormControl className="mb-3" placeholder="Username" type="text" required
                                         value={this.state.username} onChange={this.handleChangeUsername}/>
                        </Col>
                    </Row>
                    <Row className={"justify-content-center"}>
                        <Col md={3}>
                            <label>Password</label>
                            <FormControl className="mb-3" placeholder="Password" type="password" required
                                         value={this.state.password} onChange={this.handleChangePassword}/>
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
