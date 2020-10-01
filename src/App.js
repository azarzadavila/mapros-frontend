import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Container, FormControl, Row} from "react-bootstrap";
import {Cookies} from "react-cookie";


// const root_url = 'http://localhost:8000/';
const root_url = 'https://mapros.herokuapp.com/';

const cookies = new Cookies();

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
            throw new Error();
        }, networkError => {
            console.log(networkError.message);
        }).then(jsonResponse => {
            console.log(jsonResponse);
            cookies.set('token', jsonResponse.token);
        }).catch(error => {

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

async function checkAuth() {
    const token = cookies.get('token');
    if (token) {
        return await fetch(root_url + 'auth/check/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token: token})
        }).then(response => {
            return response.ok;
        }, networkError => {
            console.log(networkError.message);
        });
    }
    return false;
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            main: <div></div>
        };
        checkAuth().then(
            response => {
                if (response) {
                    console.log('positive response');
                    this.setState({main: <div>Already Connected</div>});
                } else {
                    console.log('negative response');
                    this.setState({main: <Login></Login>});
                }
            }
        );
    }

    render() {

        return <Container>{this.state.main}</Container>
    }
}

export default App;
