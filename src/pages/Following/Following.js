import React, { Component } from 'react'
import apiService from '../../service/apiService'
import { Container } from 'react-bootstrap';
import './Following.css'
import UserCard from '../../components/UserCard/UserCard';
export default class Following extends Component {
    state = { users: [], author:{} };
    componentDidMount() {
        this.setState({ userId: this.props.match.params.userId });
        apiService.getUser(this.props.match.params.userId).then(user=> {
            this.setState({author:user});
        })
        apiService.findFollowing(this.props.match.params.userId).then(users => {
            this.setState({ users: users });
        })
    }
    render() {
        return (
            <Container>
                <div className="followingTitle"> {this.state.author.name} is following </div>
                <div>
                    {
                        (this.state.users) ? this.state.users.map((user) => {
                            return (
                                <UserCard data={user}></UserCard>
                            )
                        }):<div style={{ marginTop: "20%" }} className="blogHeading">{this.state.author.name} hasn't followed anyone</div>
                    }
                </div>
            </Container>
        )
    }
}
