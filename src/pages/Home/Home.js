import React, { Component } from 'react'
import './Home.css'
import { Col, Container, Row, Pagination, Card } from 'react-bootstrap'
import BlogCard from '../../components/BlogCard/BlogCard'
import apiService from '../../service/apiService'
import { Link } from 'react-router-dom';
export default class Home extends Component {
    state = { startEllipses: false, endEllipses: false, active: 1, displayPages: [1], pages: 1, category: "All", categoryID: "All", searchKey: "" };
    componentDidMount() {
        this.getBlogCount("All");
        this.getCategories();
    }
    blogPages = (page, catID) => {
        apiService.pagination((page * 9), catID).then(blogs => {
            this.setState({ "blogs": blogs });
        })
    }
    setPages = (count) => {
        let pages = ((count % 9) === 0) ? (count / 9) : ((count / 9) + 1);
        let displayPages = []
        for (let i = 1; i <= pages; i++) {
            displayPages.push(i)
        }
        this.setState({ "pages": pages, displayPages: displayPages });
    }
    getBlogCount = (catID) => {
        apiService.blogsCount(catID).then(count => {
            this.setPages(count)
            this.blogPages(0, catID)
        })
    }
    getCategories = () => {
        apiService.getCategories().then(data => {
            let cats = []
            cats = data
            cats.unshift({ _id: "1", categoryName: "All" })
            this.setState({ categories: cats })
        })
    }
    blogByCategory = (cat) => {
        if (cat.categoryName === "All") {
            this.getBlogCount("All")
            this.setState({ "category": "All", categoryID: "All" });
        } else {
            this.getBlogCount(cat._id)
            apiService.pagination(0, cat._id).then(data => {
                this.setState({ "blogs": data, "category": cat.categoryName, categoryID: cat._id });
            });
        }
    }
    pagination(item) {
        if (item > 0) {
            this.blogPages((Math.floor(item) - 1), this.state.categoryID)
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
    handleChange = event => {
        const target = event.target;
        this.setState({ "searchKey": target.value.trim() })
        if (event.key === 'Enter') {
            this.search()
        }
    }
    search = () => {
        console.log("Search " + this.state.searchKey)
        apiService.blogSearch(this.state.searchKey).then(data => {
            let category = this.state.searchKey
            console.log(category)
            this.setState({ "blogs": data, category: category, pages: 0 });
        })
    }
    render() {
        return (
            <div>
                <Container>
                    <div className="searchBox">
                        <input className="searchInput" type="text" name="search" placeholder="Search" onKeyDown={this.handleChange}></input>
                        <button className="searchButton" href="#">
                            <i onClick={this.search} className="material-icons">
                                <i className={"fa fa-search"}></i>
                            </i>
                        </button>
                    </div>
                    <div style={{ marginTop: "8%" }} className="wrapper-container">
                        {
                            (this.state.categories) ? this.state.categories.map((cat) => {
                                return (
                                    <Card onClick={() => { this.blogByCategory(cat) }} className="badge">
                                        <div style={{ width: "100%", position: "absolute", top: 50, zIndex: "3" }}>
                                            <p className="category-name">{cat.categoryName}</p>
                                        </div>
                                        <Card.Img className="cat-image" variant="top" src={require('../../assets/' +  cat.categoryName.toLowerCase() + '.jpg')} />
                                    </Card>
                                )
                            }) : ""
                        }
                    </div>
                    {
                        (this.state.category !== "All") ? <div className="blogHeading">{this.state.category}</div> : ""
                    }

                    {
                        (this.state.blogs) ?
                            <Row> {
                                this.state.blogs.map((blog) => {
                                    return (
                                        <Col md={3} sm={6} key={blog._id} className="blogCard"> <Link style={{ textDecoration: "none" }} to={`describe/${blog._id}`}> <BlogCard data={blog} /></Link></Col>
                                    )
                                })
                            }</Row> : <div style={{ marginTop: "20%" }} className="blogHeading">No blogs found in {this.state.category}</div>
                    }

                    {
                        (this.state.pages > 0) ?
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
                </Container >
            </div>
        )
    }
}
