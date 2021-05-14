import React, { Component } from 'react'

import { Card, Form, Container, Col, Row, Button } from 'react-bootstrap'
import './Login.css'
import { ToastContainer } from 'react-toastify';
import { GoogleLogin } from 'react-google-login';
import toastService from '../../service/toastService'
import { Link } from 'react-router-dom';
import apiService from '../../service/apiService'
import blog from '../../assets/blog.jpg'
export default class Login extends Component {
    state = { emailId: "", password: "" }
    login = () => {
        let User = { "emailID": this.state.emailId, "password": this.state.password }
        apiService.login(User).then(data => {
            (data === "error") ? toastService.createToast("EmailId or password is incorrect ", "error") : toastService.createToast("Sign-in successful!!", "success")
            if (data !== "error") {
                localStorage.setItem('token', data);
            }
        })
    }
    responseGoogle(authResponse) {
        console.log(authResponse)
    }
    handleInputChange = (event) => {

        (event.target.id === "emailId") ? this.setState({ emailId: event.target.value }) : this.setState({ password: event.target.value })
    }
    render() {
        return (
            <Container>
                <div className="formContainer">
                    <h1 className="login">LOGIN</h1>
                    <Card>
                        <Row>
                            <Col><img className="loginForm" src={blog} alt='loginImg'></img></Col>
                            <Col>
                                <Card.Body>
                                    <div style={{ textAlign: "center" }} className='social-login mb-2'>
                                        <GoogleLogin
                                            clientId='111141310075-2ikrbjvf7fea49uqc3t73c7678vg0uhm.apps.googleusercontent.com'
                                            buttonText='Sign in with Google'
                                            onSuccess={this.responseGoogle.bind(this)}
                                            onFailure={this.responseGoogle.bind(this)}
                                            cookiePolicy={'single_host_origin'}
                                        />

                                        <p style={{ marginTop: "2rem" }}> OR </p>
                                    </div>
                                    <Form>
                                        <Form.Group >
                                            <Form.Label style={{ marginTop: "2rem" }} >EmailId</Form.Label>
                                            <Form.Control size="sm" id="emailId" name="emailId" type="text" placeholder="Enter your emailId" onChange={this.handleInputChange} />

                                            <Form.Label style={{ marginTop: "4rem" }} >Password</Form.Label>
                                            <Form.Control size="sm" id="password" name="password" type="password" placeholder="Enter your password" onChange={this.handleInputChange} />
                                        </Form.Group>
                                    </Form>
                                    <Button size="sm" className="mt-5" variant="dark" type="button" onClick={() => { this.login() }} block>
                                        Login
                </Button>
                                    <ToastContainer
                                        autoClose={2000}
                                    ></ToastContainer>
                                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                                        <small>
                                            <span>New User?</span>&nbsp;
                                    <Link to="/register"><span className="sign-up">Sign-Up</span></Link>
                                        </small></div>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </Container>
        )
    }
}
