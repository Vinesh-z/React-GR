import React, { Component } from 'react'
import apiService from '../../service/apiService'

import { Card, Container, Col, Row, Button, Pagination, Image } from 'react-bootstrap'
import './Profile.css'

import BlogCard from '../../components/BlogCard/BlogCard'
import { Link } from 'react-router-dom';
export default class Profile extends Component {
    state = { userId: "", user: {}, sameUser: false, blogCount: 0, following: false, gender: "male", blogs: [], startEllipses: false, endEllipses: false, active: 1, displayPages: [1], pages: 1, followersCount: 0, followingCount: 0 }
    componentDidMount() {
        this.setState({ userId: this.props.match.params.userId });
        this.getUser()
        this.followersCount(this.props.match.params.userId)
        this.followingCount(this.props.match.params.userId)
    }
    getUser = () => {
        apiService.getUser(this.props.match.params.userId).then(user => {
            this.setState({ user: user })
            this.blogPages(0, user._id)
        })
    }
    setPages = (count) => {
        let pages = ((count % 9) === 0) ? (count / 9) : ((count / 9) + 1);
        let displayPages = []
        for (let i = 1; i <= pages; i++) {
            displayPages.push(i)
        }
        this.setState({ pages: pages, displayPages: displayPages });
    }
    followersCount(userID) {
        apiService.getFollowerCount(userID).then(count => {
            this.setState({ followersCount: count })
        })
    }
    followingCount(userID) {
        apiService.getFollowingCount(userID).then(count => {
            this.setState({ followingCount: count })
        })
    }
    follow = () => {
        let follow = !this.state.following
        this.setState({ following: follow })
    }
    blogPages = (page, userId) => {
        apiService.blogsCountByAuthor(this.state.user._id).then(count => {
            this.setState({ blogCount: count })
            this.setPages(count)
        })
        apiService.getblogsByAuthor((page * 9), userId).then(blogs => {
            this.setState({ "blogs": blogs });
        })
    }
    pagination(item) {
        if (item > 0) {
            this.blogPages((Math.floor(item) - 1), this.state.user._id)
            let displayPages = []
            if (this.state.pages < 5) {
                for (let i = 1; i <= this.state.pages; i++) {
                    displayPages.push(i)
                }

                this.setState({ startEllipses: false })
            } else if (item <= 3) {
                for (let i = 1; i <= 5; i++) {
                    displayPages.push(i)
                }

                this.setState({ startEllipses: false })
                this.setState({ endEllipses: true })
            } else if (item > 2 && item < this.state.pages - 2) {
                for (let i = item - 2; i <= item + 2; i++) {
                    displayPages.push(i)
                }
                this.setState({ endEllipses: true })
                this.setState({ startEllipses: true })
            } else {
                for (let i = this.state.pages - 4; i <= this.state.pages; i++) {
                    displayPages.push(i)
                }
                this.setState({ endEllipses: false })
                this.setState({ startEllipses: true })
            }
            this.setState({ displayPages: displayPages })
            this.setState({ active: Math.floor(item) })
        }
    }
    render() {
        return (
            <Container>
                <div className="profileContainer">
                    <Card className="profileCard">
                        <Row>
                            <Col style={{ textAlign: "center" }}>
                                {
                                    (this.state.user.profile) ? <Image className="user-avatar" src={require('../../assets/' + this.state.user.profile + '.png')} roundedCircle /> : ""}</Col>
                            <Col>
                                <Card.Body>
                                    <div style={{ textAlign: "center" }} className='userName'>
                                        <p>{this.state.user.name}
                                            {(this.state.gender === "male") ? <i style={{ color: "#2196f3", marginLeft: "10px" }} className="fa fa-mars"></i> : ""}
                                            {(this.state.gender === "female") ? <i style={{ color: "#ec407a", marginLeft: "10px" }} className="fa fa-venus"></i> : ""}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: "center" }} className='emailId'>
                                        <p className='text-muted'>{this.state.user.emailID}</p>
                                    </div>
                                    <div style={{ marginBottom: "1rem", marginTop: "3rem" }}>
                                        <div style={{ padding: "0%" }}>
                                            <Row>
                                                <Col className="blogs" md={4} sm={4}>
                                                    <p className="blogCountHeading">Blogs</p>
                                                    <p className="blogCount text-muted">{this.state.blogCount}</p>
                                                </Col>
                                                <Col style={{ cursor: 'pointer' }} className="followers" md={4} sm={4}>
                                                    <Link style={{ textDecoration: "none" }} to={`../followers/${this.state.userId}`}>
                                                        <p className="followersHeading">Followers</p>
                                                        <p className="followersCount text-muted">{this.state.followersCount}</p></Link>
                                                </Col>
                                                <Col style={{ cursor: 'pointer' }} className="following" md={4} sm={4}>
                                                    <Link style={{ textDecoration: "none" }} to={`../following/${this.state.userId}`}>
                                                        <p className="followingHeading">Following</p>
                                                        <p className="followingCount text-muted">{this.state.followingCount}</p>
                                                    </Link>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                    {
                                        (!this.state.sameUser) ?
                                            (
                                                (!this.state.following) ?
                                                    <div style={{ textAlign: "center" }}>
                                                        <Button style={{ width: "7rem" }} size="sm" variant="outline-primary" type="button" onClick={() => { this.follow() }}>
                                                            <i style={{ color: "rgb(104, 104, 850)", marginRight: "5px" }} className={"fa fa-plus"}></i>
                                                Follow</Button></div> :
                                                    <div style={{ textAlign: "center" }}> <Button style={{ width: "7rem" }} size="sm" variant="primary" type="button" onClick={() => { this.follow() }}>
                                                        <i style={{ color: "#eee", marginRight: "5px" }} className={"fa fa-check"}></i>
                                                Following
                                            </Button></div>
                                            ) : ""
                                    }
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                    {
                        (this.state.pages > 0) ?
                            <div>
                                <Row>
                                    {this.state.blogs?.map((blog) => {
                                        return (
                                            <Col md={3} sm={6} key={blog._id} className="blogCard"> <Link style={{ textDecoration: "none" }} to={`../describe/${blog._id}`}> <BlogCard data={blog} /></Link></Col>
                                        )
                                    })
                                    }</Row> </div> : ""
                    }
                    {
                        (this.state.displayPages > 1) ?
                            <div style={{ marginLeft: "40%" }}>
                                <Pagination>
                                    <Pagination.First onClick={() => { this.pagination(1) }} />
                                    {
                                        (this.state.active > 1) ? <Pagination.Prev onClick={() => { this.pagination(this.state.active - 1) }} /> : ""
                                    }

                                    {
                                        this.state.displayPages.map((item) => {
                                            return (
                                                <Pagination.Item key={item} onClick={() => { this.pagination(item) }} active={item === this.state.active}>{item}</Pagination.Item>
                                            )
                                        })
                                    }
                                    {
                                        (this.state.active < this.state.pages) ? <Pagination.Next onClick={() => { this.pagination(this.state.active + 1) }} /> : ""
                                    }
                                    <Pagination.Last onClick={() => { this.pagination(this.state.pages) }} />
                                </Pagination>
                            </div>
                            : ""
                    }
                </div>
            </Container>
        )
    }
}
