import React, { Component } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import BlogCard from '../../components/BlogCard/BlogCard'
import apiService from '../../service/apiService'
import { Link } from 'react-router-dom';
import './MyBlogs.css'

export default class MyBlogs extends Component {
    state = {}
    componentDidMount() {
        this.getBlogs();
    }
    getBlogs = () => {
        apiService.getblogsByAuthor("5ed54d1e4e5707265c6f1024").then(data => {
            this.setState({ "blogs": data });
            console.log(data)
        });
    }
    render() {
        return (
            <div>
                <Container>

                    {
                        (this.state.blogs) ?
                            <div>
                                <div className="blogHeading">My Blogs</div>
                                <Row>
                                    {this.state.blogs.map((blog) => {
                                        return (
                                            <Col md={3} sm={6} key={blog._id} className="blogCard"> <Link to={`describe/${blog._id}`}> <BlogCard data={blog} /></Link></Col>

                                        )
                                    })
                                    }</Row> </div> : <div style={{marginTop:"20%"}} className="blogHeading">You haven't composed a blog yet</div>
                    }
                </Container>
            </div>
        )
    }
}
