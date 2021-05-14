import React from 'react'
import { Form, Button,Container, Dropdown } from 'react-bootstrap'
import apiService from '../../service/apiService'
import ReactQuill from 'react-quill';
import { Jumbotron } from '../../components/Jumbotron/Jumbotron'
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';
import './AddBlog.css'
import { ToastContainer } from 'react-toastify';
import toastService from '../../service/toastService'
import { Link } from 'react-router-dom';
import * as readingTime from 'reading-time';
export default class AddBlog extends React.Component {

    constructor(props) {
        super(props)
        this.state = { selectedFile: null, blogName: '', content: '', editorHtml: '', theme: 'snow', file: true, coverImage: '', category: { id: '', categoryName: 'Category' } };
        this.handleChange = this.handleChange.bind(this)
    }
    componentDidMount() {
        this.getCategories();
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
        this.setState({ blogName: target.value.trim() });
    }
    handleChange = value => {
        this.setState({ content: value.trim() })
    }

    categorySelect = (category) => {
        this.setState({ category: { id: category._id, categoryName: category.categoryName } })
    }

    addBlog = () => {
        toastService.createToast("Blog added successfully!!", "success");
        const Blog = { "blogName": this.state.blogName, "content": this.state.content, "readTime": readingTime(this.state.content).text, "imageURL": this.state.coverImage, categoryID: this.state.category.id, "authorID": "5ee5306dc5273250d32e0467" };
        apiService.addBlog(Blog).then(data => {
        });

    }

    onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] });
        this.setState({ file: true });
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
                <Container>
                    <Jumbotron className="jumbo" />
                    <ToastContainer
                        autoClose={2000}
                    ></ToastContainer>
                    <Form>
                        <Form.Group controlId="blogName">
                            <Form.Label>Blog Name</Form.Label>
                            <Form.Control name="blogName" type="text" placeholder="Enter Blog name" onChange={this.handleInputChange} />
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
                    <Link to="/">
                        <Button disabled={!isEnabled} size="sm" variant="success" type="button" onClick={this.addBlog} block>
                            Submit
                </Button>
                    </Link>
                </Container>
            </div>
        )
    }
}
