import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import './BlogCard.css'
import '../../service/apiService'
import * as moment from 'moment';
import apiService from '../../service/apiService';
export default class BlogCard extends Component {
    state = {}
    componentDidMount() {
        apiService.getCategory(this.props.data.categoryID).then(category => {
            this.setState({ category: category })
            this.setState({ created: moment(this.props.data.createdDate).format('MMMM Do YYYY') })
        })
    }
    kFormatter(labelValue) {
        // Nine Zeroes for Billions
        return Math.abs(Number(labelValue)) >= 1.0e+9

            ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
            // Six Zeroes for Millions 
            : Math.abs(Number(labelValue)) >= 1.0e+6

                ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
                // Three Zeroes for Thousands
                : Math.abs(Number(labelValue)) >= 1.0e+3

                    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

                    : Math.abs(Number(labelValue));
    }

    render() {
        const imageUrl = "http://localhost:8000/" + this.props.data.imageURL;
        return (
            <div>
                <Card className="uniqueBlog">
                    <div style={{ width: "100%", position: "absolute", zIndex: "3" }}>
                        <div className="likes-display">
                            <i style={{ color: "#eee" }} className={"fa fa-thumbs-up"}></i>
                            <p>{
                                (this.props.data.likesCount) ? <span style={{ fontSize: "0.75rem" }}> {this.kFormatter(this.props.data.likesCount)} </span> : 0
                            }</p>
                        </div>
                    </div>
                    <Card.Img className="cover-image" variant="top" src={imageUrl} />

                    <Card.Body className="cardBody p-0">
                    
                            <p className="categoryName pt-4 pb-1">{this.state.category ? this.state.category.categoryName : ""}</p>
                            <Card.Title className="cardTitle">{(this.props.data.blogName.length > 50 ? this.props.data.blogName.substring(0, 50) + "..." : this.props.data.blogName.substring(0, 50))}</Card.Title>
                            <div className="bottomContent">
                            <p className="created">Published On: {this.state.created}</p>
                            <p className="read-time text-muted">{this.props.data.readTime}</p>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}
