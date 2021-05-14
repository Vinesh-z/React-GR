import React, { Component } from 'react'
import apiService from '../../service/apiService'
import { Container, Form, Button, Card, Row, Col, Modal } from 'react-bootstrap';
import * as moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { Link } from 'react-router-dom';
import './Description.css'
import { ToastContainer } from 'react-toastify';
import toastService from '../../service/toastService'
export default class Description extends Component {
    state = {};

    constructor(props) {
        super(props)
        this.state = { author: {}, created: '', comment: '', subComment: '', comments: [], ready: false, subComments: [], replies: [], liked: false, deleteConfirmation: false };
    }

    componentDidMount() {
        this.setState({ blogId: this.props.match.params.blogId });
        this.getBlog()
    }
    getComments = () => {
        let subComms = []
        let replies = []
        let blogComments = []
        apiService.getCommentByBlog(this.state.blogId).then(async comments => {
            if (comments) {
                await Promise.all(comments.map(async (comment) => {
                    comment.subComments = []
                    if (!comment.parentID) {
                        subComms.push(false)
                        replies.push(false)
                        comment.createdDate = moment(comment.createdDate).format('MMMM Do YYYY')
                        comments.forEach(com => {

                            if (com.parentID === comment._id) {
                                com.createdDate = moment(com.createdDate).format('MMMM Do YYYY')
                                comment.subComments.push(com)
                            }
                        });
                        blogComments.push(comment)
                    }
                    return comment;
                }));
            }
            this.setState({ comments: blogComments })
            this.setState({ subComments: subComms })
            this.setState({ replies: replies })
        })

    }
    getBlog = () => {
        apiService.getBlog(this.props.match.params.blogId).then(blog => {
            apiService.getUser(blog.userID).then(user => {
                if (user.likedBlogs) {
                    if (user.likedBlogs.includes(this.props.match.params.blogId)) {
                        this.setState({ liked: true })
                    }
                }
                if (!blog.likesCount) {
                    blog.likesCount = 0
                }
                this.setState({ blog: blog });
                this.setState({ author: user });
                this.setState({ created: moment(blog.createdDate).format('MMMM Do YYYY') })
                this.setState({ imageURL: "http://localhost:8000/" + blog.imageURL })
                this.getCategory()
                this.getComments()
            })

        })
    }

    getCategory = () => {
        apiService.getCategory(this.state.blog.categoryID).then(category => {
            this.setState({ category: category })

            this.setState({ ready: true })
        })
    }
    handleInputChange = event => {
        const target = event.target;
        this.setState({ comment: target.value });
    }
    handleReplyInput = event => {
        const target = event.target;
        this.setState({ subComment: target.value });
    }
    addComment = () => {
        const Comment = {
            "blogID": this.state.blogId, "content": this.state.comment.trim(), "user": {
                "_id": "5ed54d1e4e5707265c6f1024",
                "name": "vinesh"
            }
        };
        apiService.addComment(Comment).then(data => {
            this.getComments()
            this.setState({ comment: "" })
            toastService.createToast("Your comment added!!", "success");
        })

    }
    addReply = commentId => {
        const Comment = {
            "blogID": this.state.blogId, "parentID": commentId, "content": this.state.subComment.trim(), "user": {
                "_id": "5ed54d1e4e5707265c6f1024",
                "name": "vinesh"
            }
        };
        apiService.addComment(Comment).then(data => {
            this.getComments()
            toastService.createToast("Your reply added!!", "success");
            this.setState({ comment: "" })
        })
    }
    replyForm = i => {
        let replies = this.state.replies
        replies[i] = !replies[i]
        this.setState({ replies: replies })
    }
    replyDisplay = i => {
        let subComms = this.state.subComments
        subComms[i] = !subComms[i]
        this.setState({ subComments: subComms })
    }
    deleteComment = id => {
        apiService.deleteComment(id).then(data => {
            this.getComments()
            toastService.createToast("Comment deleted!!", "success");
        })
    }

    handleClose = () => {
        this.setState({ deleteConfirmation: false });
    }

    handleDelete = () => {
        this.setState({ deleteConfirmation: true });
    }

    handleEdit = () => {
        this.props.history.push('../edit/' + this.state.blogId);
    }
    deleteBlog = () => {
        this.setState({ deleteConfirmation: false });
        apiService.deleteBlog(this.state.blogId).then(data => {
            toastService.createToast("Blog deleted successfully!!", "success");
            this.props.history.push('../home');
        })
    }

    like = () => {
        apiService.likeBlog("5ed54d1e4e5707265c6f1024", this.state.blog._id).then(data => {
            let blog = this.state.blog
            if (this.state.liked) {
                blog.likesCount = blog.likesCount - 1
            } else {
                blog.likesCount = blog.likesCount + 1
            }
            let like = this.state.liked
            this.setState({ liked: !like })
            this.setState({ blog: blog })
        })
    }
    render() {
        const isEnabled = this.state.comment.trim().length > 0
        return (
            <div style={{ marginLeft: "6rem", marginRight: "2rem" }}>
            <Container>
                <div>
                    <ToastContainer
                        autoClose={2000}
                    ></ToastContainer>
                    {this.state.ready ? (
                        <div className="blogDetails">
                            <h1 className="blogName">{this.state.blog.blogName}
                                <Button style={{ marginLeft: "1rem" }} size="sm" variant="primary" type="button" onClick={this.handleEdit}>
                                    <i style={{ color: "white" }} className={"fa fa-pencil"}></i>
                                </Button>
                                <Button style={{ marginLeft: "1rem" }} size="sm" variant="danger" type="button" onClick={this.handleDelete}>
                                    <i style={{ color: "white" }} className={"fa fa-trash"}></i>
                                </Button>
                            </h1>
                            <div>
                                <small className="catName">{this.state.category.categoryName}</small>
                                <img className="display-image" src={this.state.imageURL} alt="cover-img"></img>
                                <small className="authorName">By <Link to={`../profile/${this.state.author._id}`}><span style={{ color: "#343a40", cursor: "pointer" }}>{this.state.author.name} </span></Link>| Published on: {this.state.created} | {this.state.blog.readTime}</small>
                                <hr></hr>
                                <ReactQuill
                                    className="content"
                                    value={this.state.blog.content}
                                    readOnly={true}
                                    theme={"bubble"}
                                />
                                <hr></hr>
                            </div>
                            <div className="likes">
                                <span>
                                    <i style={{ color: "rgb(84, 104, 850)", marginRight: "5px" }} className={"fa fa-thumbs-up"}></i>LIKES: &nbsp;
                                {
                                        (this.state.blog.likesCount) ? <span>{this.state.blog.likesCount} </span> : 0
                                    }
                                    {
                                        (!this.state.liked) ?
                                            <Button style={{ float: "right", marginRight: "0.5rem", width: "7rem" }} size="sm" variant="outline-dark" type="button" onClick={() => { this.like() }}>
                                                <i style={{ color: "rgb(104, 104, 850)", marginRight: "5px" }} className={"fa fa-thumbs-up"}></i>

                                    Like
                                    </Button> :
                                            <Button style={{ float: "right", marginRight: "0.5rem", width: "7rem" }} size="sm" variant="dark" type="button" onClick={() => { this.like() }}>
                                                <i style={{ color: "#eee", marginRight: "5px" }} className={"fa fa-thumbs-up"}></i>

                                    Liked
                                    </Button>}
                                </span>

                            </div>
                            {
                                (this.state.comments.length > 0) ?
                                    (<h3 className="commentHeading">Comments</h3>) : ""}
                            {
                                (this.state.comments) ? this.state.comments.map((comment, index) => {
                                    return (
                                        <Card className="comment-card" key={comment._id}
                                            bg={'light'}
                                            text={'black'}
                                            style={{ width: '100%' }}
                                        >
                                            <Card.Header>
                                                <Row>
                                                    <Col className="author" md={6} sm={6}>{comment.user.name}</Col>
                                                    <Col className="time" md={6} sm={6}>{comment.createdDate}<Button onClick={() => { this.deleteComment(comment._id) }} style={{ marginLeft: "1rem" }} size="sm" variant="danger" type="button">
                                                        <i style={{ color: "white" }} className={"fa fa-trash"}></i>
                                                    </Button></Col>
                                                </Row>
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Text className="comment">
                                                    {comment.content}
                                                </Card.Text>

                                                <div>
                                                    {
                                                        (this.state.replies[index]) ? (
                                                            <Form>
                                                                <Form.Group controlId="replyForm">
                                                                    <Form.Control name="reply" type="text" value={this.state.subComment} placeholder="Add a public reply..." onChange={this.handleReplyInput} />
                                                                    <Button style={{ float: "left", margin: "0.5rem" }} size="sm" variant="danger" type="button" onClick={() => { this.replyForm(index) }} >
                                                                        Cancel
                                                        </Button>
                                                                    <Button style={{ float: "left", margin: "0.5rem" }} size="sm" variant="secondary" type="button" onClick={() => { this.addReply(comment._id) }} >
                                                                        Reply
                                                        </Button>
                                                                </Form.Group>
                                                            </Form>
                                                        ) : (<span style={{ float: "left", margin: "0.2rem", color: "blue" }} className="replyDisplay" onClick={() => { this.replyForm(index) }}><i style={{ color: "rgb(95, 95, 219)" }} className={"fa fa-comments-o"}></i> Reply</span>)}
                                                </div>
                                                <div className="replies">
                                                    {(comment.subComments.length > 0) ?
                                                        (
                                                            (!this.state.subComments[index]) ?
                                                                (<span className="replyDisplay" onClick={() => { this.replyDisplay(index) }}><i style={{ color: "rgb(95, 95, 219)" }} className={"fa fa-arrow-down"}></i> show replies</span>) :
                                                                (<span className="replyDisplay" onClick={() => { this.replyDisplay(index) }}><i style={{ color: "rgb(95, 95, 219)" }} className={"fa fa-arrow-up"}></i> hide replies</span>)
                                                        ) : ""}
                                                </div>
                                                {
                                                    (this.state.subComments[index] && comment.subComments.length > 0) ? (
                                                        comment.subComments.map((subComment) => {
                                                            return (
                                                                <Card className="comment-card" key={subComment._id}
                                                                    bg={'light'}
                                                                    text={'black'}
                                                                    style={{ width: '100%' }}
                                                                >
                                                                    <Card.Header>
                                                                        <Row>
                                                                            <Col className="author" md={6} sm={6}>{subComment.user.name}</Col>
                                                                            <Col className="time" md={6} sm={6}>{subComment.createdDate}
                                                                                <Button onClick={() => { this.deleteComment(subComment._id) }} style={{ marginLeft: "1rem" }} size="sm" variant="danger" type="button">
                                                                                    <i style={{ color: "white" }} className={"fa fa-trash"}></i>
                                                                                </Button></Col>
                                                                        </Row>
                                                                    </Card.Header>
                                                                    <Card.Body>
                                                                        <Card.Text className="comment">
                                                                            {subComment.content}
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>)
                                                        })) : ""}
                                            </Card.Body>
                                        </Card>)
                                }) : ""
                            }
                            <h3 className="commentHeading">Add Comment</h3>
                            <Form>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Control placeholder="Add a public comment..." value={this.state.comment} onChange={this.handleInputChange} as="textarea" rows="3" />
                                </Form.Group>
                            </Form>
                            <Button style={{ marginBottom: "2rem" }} disabled={!isEnabled} size="sm" variant="success" type="button" onClick={this.addComment} block>
                                Submit
                            </Button>
                        </div>
                    ) : (<p>No Blog Found </p>)}
                </div>
                <Modal show={this.state.deleteConfirmation} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Blog?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>The blog will be permenantly deleted, are you sure to delete?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.deleteBlog}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container >
            </div>
        )
    }
}
