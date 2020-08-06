import React, { Component } from 'react'
import { Col, Row, Card, Button, Image } from 'react-bootstrap';
import './UserCard.css'
import { Link } from 'react-router-dom';
export default class UserCard extends Component {
    state = { user: {} }
    componentDidMount() {
        console.log(this.props.data);
        this.setState({ user: this.props.data })
    }
    render() {
        return (
            <div>
                {
                    (this.state.user) ?
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={3} sm={3}>
                                        <Image className="userCard-avatar" src={require('../../assets/' + this.props.data.profile + '.png')} roundedCircle />
                                    </Col>
                                    <Col md={3} sm={3}>
                                        <div className="userCard-name">{this.state.user.name}</div>
                                    </Col>
                                    <Col md={3} sm={3}>
                                        <div className="userCard-email">{this.state.user.emailID}</div>
                                    </Col>
                                    <Col md={3} sm={3} style={{ textAlign: 'right' }}>
                                        <Link style={{ textDecoration: "none" }} to={`../profile/${this.state.user._id}`}> <Button style={{ width: "7rem" }} size="sm" variant="primary" type="button">
                                            <i style={{ color: "#eee", marginRight: "5px" }} className={"fa fa-eye"}></i>
                                                View</Button></Link>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card> : ""
                }
            </div>
        )
    }
}
