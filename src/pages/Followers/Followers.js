import React, { Component } from 'react'
import apiService from '../../service/apiService'
import { Container } from 'react-bootstrap';
import './Followers.css'
import UserCard from '../../components/UserCard/UserCard';
export default class Followers extends Component {
    state = { users: [], author:{} };
    componentDidMount() {
        this.setState({ authorId: this.props.match.params.authorId });
        apiService.getUser(this.props.match.params.authorId).then(user=> {
            this.setState({author:user});
        })
        apiService.findFollowers(this.props.match.params.authorId).then(users => {
            this.setState({ users: users });
        })
    }
    render() {
        return (
            <Container>
                <div className="followersTitle"> {this.state.author.name}'s followers </div>
                <div>
                    {
                        (this.state.users) ? this.state.users.map((user) => {
                            return (
                                <UserCard data={user}></UserCard>
                            )
                        }):<div style={{ marginTop: "20%" }} className="blogHeading">No Followers For {this.state.author.name}</div>
                    }
                </div>
            </Container>
        )
    }
}
