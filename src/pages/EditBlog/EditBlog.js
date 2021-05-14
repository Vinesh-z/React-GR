import React, { Component } from 'react'
import { Form, Button, Dropdown, Container } from 'react-bootstrap'
import apiService from '../../service/apiService'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';
import '../AddBlog/AddBlog.css'
import { ToastContainer } from 'react-toastify';
import toastService from '../../service/toastService'
import * as readingTime from 'reading-time';
export default class EditBlog extends Component {
    constructor(props) {
        super(props)
        this.state = { selectedFile: null, blogName: '', content: '', editorHtml: '', theme: 'snow', file: true, coverImage: '', category: { id: '', categoryName: 'Category' } };
        this.handleChange = this.handleChange.bind(this)
    }
    componentDidMount() {
        this.setState({ blogId: this.props.match.params.blogId });
        this.getBlog()
        this.getCategories();
    }

    getBlog = () => {
        apiService.getBlog(this.props.match.params.blogId).then(blog => {
            apiService.getUser(blog.userID).then(user => {
                this.setState({ blog: blog });
                this.setState({ blogName: blog.blogName });
                this.setState({ content: blog.content });
                this.setState({ coverImage: blog.imageURL });
                this.setState({ imageURL: "http://localhost:8000/" + blog.imageURL })
                this.getCategory()
            })
        })
    }

    getCategory = () => {
        apiService.getCategory(this.state.blog.categoryID).then(category => {
            this.setState({ category: category })

            this.setState({ ready: true })
        })
    }

    getCategories = () => {
        apiService.getCategories().then(data => {
            this.setState({ categories: data })
        })
    }
    modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
        clipboard: {
            matchVisual: false,
        }
    }
    formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ]
    handleInputChange = event => {
        const target = event.target;
        this.setState({ blogName: target.value });
    }
    handleChange = value => {
        this.setState({ content: value })
    }

    categorySelect = (category) => {
        this.setState({ category: { id: category._id, categoryName: category.categoryName } })
    }

    editBlog = () => {
        const Blog = { blogName: this.state.blogName, content: this.state.content, readTime: readingTime(this.state.content).text, imageURL: this.state.coverImage, categoryID: this.state.category.id };
        apiService.editBlog(Blog, this.state.blogId).then(data => {
            console.log(data.status);
            if (data.status === 200) {
                toastService.createToast("Blog changes saved successfully!!", "success");
                this.props.history.push('../describe/' + this.state.blogId);
            }
            else
                toastService.createToast("Something went wrong, please try again later", "error");
        });

    }

    onFileChange = event => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
                this.setState({ imageURL: reader.result });
            };
            this.setState({ selectedFile: event.target.files[0] });
            this.setState({ file: true });
        }
    };

    onFileUpload = () => {
        if (this.state.selectedFile) {
            const formData = new FormData();
            formData.append(
                "myFile",
                this.state.selectedFile,
                this.state.selectedFile.name
            );
            apiService.uploadFile(formData).then(data => {
                this.setState({ "coverImage": data });
                toastService.createToast(this.state.selectedFile.name + " uploaded successfully!!", "success");
            });
        } else {
            this.setState({ file: false });
        }
    };

    fileData = () => {

        if (this.state.selectedFile) {

            return (
                <div>
                    <p style={{ color: 'blue' }}>File Name: {this.state.selectedFile.name}</p>
                </div>
            );
        } else {
            return (
                <div>
                    <p style={{ color: 'blue' }}>Choose cover image</p>
                </div>
            );
        }
    };

    render() {
        const isEnabled = this.state.blogName.trim().length > 0 && this.state.content.trim().length > 0 && this.state.category.categoryName !== "Category";
        return (
            <div style={{ marginLeft: "6rem", marginRight: "2rem" }}>
                <ToastContainer
                    autoClose={2000}
                ></ToastContainer>
                <Container>
                    {this.state.ready ? (
                        <div>
                            <img className="display-image mt-4" src={this.state.imageURL} alt="cover-img"></img>
                            <Form className="mt-3">
                                <Form.Group controlId="blogName">
                                    <Form.Label>Blog Name</Form.Label>
                                    <Form.Control name="blogName" type="text" value={this.state.blogName} placeholder="Enter Blog name" onChange={this.handleInputChange} />
                                </Form.Group>
                            </Form>
                            <div className="quillEditor">
                                <ReactQuill value={this.state.content}
                                    style={{ height: "100%" }}
                                    placeholder='Compose your blog'
                                    theme={this.state.theme}
                                    modules={this.modules}
                                    formats={this.formats}
                                    onChange={this.handleChange} />
                            </div>

                            <div className="fileInput">
                                <div>
                                    <Form>
                                        <Form.File onChange={this.onFileChange}
                                            id="custom-file"
                                            label="Select image file"
                                            custom
                                            style={{ width: "15rem", marginTop: "2rem", marginRight: "6rem" }}

                                        />
                                        <Button size="sm" variant="primary" onClick={this.onFileUpload}>
                                            Upload!
                        </Button>
                                        <Dropdown style={{ width: "10rem", marginTop: "2rem" }} className="categoryDropdown">
                                            <Dropdown.Toggle size="sm" style={{ width: "100%" }}
                                                variant="secondary" id="dropdown-basic">
                                                {this.state.category.categoryName}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu alignRight className="dropdownMenu">
                                                {
                                                    (this.state.categories) ? this.state.categories.map((category) => {
                                                        return (
                                                            <Dropdown.Item key={category._id} onClick={() => { this.categorySelect(category) }}>{category.categoryName}</Dropdown.Item>
                                                        )
                                                    }) : ""}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Form>


                                </div>
                                {this.fileData()}
                            </div>
                            <Button disabled={!isEnabled} size="sm" variant="success" type="button" onClick={this.editBlog} block>
                                Save
                </Button>
                        </div>) : (<p>No Blog Found </p>)
                    }
                </Container>
            </div>
        )
    }
}
