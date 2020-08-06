import React, { Component } from 'react'

import { ToastContainer } from 'react-toastify';
import toastService from '../../service/toastService'
import { Card, Form, Container, Col, Row, Button, Image } from 'react-bootstrap'
import './Register.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiService from '../../service/apiService'
import { Link } from 'react-router-dom';

export default class Register extends Component {
    state = {
        startDate: new Date(), avatar: 'default'
    };
    register = () => {
        const User = {
            "name": "teast1",
            "emailID": "test@gmail.com",
            "password": "123",
            "gender": "male",
            "profile":this.state.avatar,
            "dob": this.state.startDate
        }
        apiService.addUser(User).then(data => {
            console.log(data.status)
            if (data.status === 409) {
                toastService.createToast("User already exists", "error");
            } else if (data.status === 200) {
                toastService.createToast("Registration completed successfully!!", "success");
            } else {
                toastService.createToast("Some error occured, please try again later", "error");
            }
        })
    }
    avatarSelect = (avatar) => {
        this.setState({ avatar: avatar })
    }
    handleChange = date => {
        this.setState({
            startDate: date
        });
    };
    render() {

        const avatars = ['man1', 'man2', 'man3', 'man4', 'man5', 'man6', 'man7', 'woman1', 'woman2', 'woman3', 'woman4', 'default']

        return (
            <div >
                <Container>
                    <div className="registerContainer">
                        <h1 className="register">SIGN-UP</h1>
                        <Card>
                            <Card.Body>
                                <div style={{ textAlign: "center" }}>
                                    <Image className="avatar" src={require('../../assets/' + this.state.avatar + '.png')} roundedCircle />
                                </div>

                                <Form>
                                    <Form.Group controlId="register">
                                        <Form.Label style={{ marginTop: "2rem" }}>Name</Form.Label>
                                        <Form.Control size="sm" name="name" type="text" placeholder="Enter your name" onChange={this.handleInputChange} />

                                        <Form.Label style={{ marginTop: "2rem" }}>EmailId</Form.Label>
                                        <Form.Control size="sm" name="emailId" type="text" placeholder="Enter your emailId" onChange={this.handleInputChange} />

                                        <Form.Label style={{ marginTop: "2rem" }} >Password</Form.Label>
                                        <Form.Control size="sm" name="password" type="password" placeholder="Enter your password" onChange={this.handleInputChange} />
                                        <Row >
                                            <Col sm={6}>
                                                <Form.Label style={{ marginTop: "2.5rem", marginRight: "4rem" }}>DOB:</Form.Label>
                                                <DatePicker
                                                    selected={this.state.startDate}
                                                    onChange={this.handleChange}
                                                />
                                            </Col>

                                            <Col sm={6} style={{ marginTop: "2.5rem",float: "right" }}>
                                                <span style={{marginRight: "4rem" }} as="legend" >
                                                    Gender:
                                        </span>
                                                <span >
                                                    <Form.Check inline

                                                        type="radio"
                                                        label="Male"
                                                        name="formHorizontalRadios"
                                                        id="formHorizontalRadios1"
                                                    />
                                                    <Form.Check inline

                                                        type="radio"
                                                        label="Female"
                                                        name="formHorizontalRadios"
                                                        id="formHorizontalRadios2"
                                                    />
                                                    <Form.Check inline

                                                        type="radio"
                                                        label="Other"
                                                        name="formHorizontalRadios"
                                                        id="formHorizontalRadios3"
                                                    />
                                                </span>
                                            </Col>
                                        </Row>
                                    </Form.Group>

                                </Form>
                                <div className="avatar-list">
                                    {
                                        avatars.map((avatar) => {
                                            return (<Image onClick={() => { this.avatarSelect(avatar) }} className={`select-avatar ${this.state.avatar === avatar ? "selected-avatar" : ""}`} src={require('../../assets/' + avatar + '.png')} roundedCircle />)
                                        })
                                    }
                                </div>
                                <Button size="sm" className="mt-5" variant="dark" type="button" onClick={() => { this.register() }} block>
                                    Register
                </Button>
                                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                                    <small>
                                        <span>Already a member?</span>&nbsp;
                                        <Link to="/login"><span className="sign-up">Login</span></Link>
                                    </small></div>
                            </Card.Body>
                        </Card>
                    </div>
                </Container>
                <ToastContainer
                    autoClose={2000}
                ></ToastContainer>
            </div>
        )
    }
}
