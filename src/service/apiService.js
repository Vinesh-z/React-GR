import { Component } from 'react'
import axios from 'axios';

//Interceptor
const authAxios = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI1ZWQ1NGQxZTRlNTcwNzI2NWM2ZjEwMjQiLCJ1c2VybmFtZSI6InZpbmVzaCIsImVtYWlsSUQiOiJ2aW5lc2hAZ21haWwuY29tIiwiZXhwIjoxNTkxOTcyMzU4fQ.rEgoLJM_BPwPzvLgm9mSmZ35Qvx3FA_qjvJTzvPHOvA"
    }
});
export default class apiService extends Component {

    //Blog apis
    static addBlog(blog) {
        return new Promise((resolve, reject) => {
            axios.post(`http://localhost:8000/blog`, blog)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    resolve(res.data);
                })
        })
    }
    static uploadFile(file) {
        return new Promise((resolve, reject) => {
            axios.post(`http://localhost:8000/upload`, file)
                .then(res => {
                    resolve(res.data);
                })
        })
    }

    static getBlogs() {

        return new Promise((resolve, reject) => {
            authAxios.get(`/blogs`)
                .then(res => {
                    resolve(res.data);
                })
        })
    }

    static getBlog(id) {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/blog/` + id)
                .then(res => {
                    resolve(res.data)
                })
        })
    }
    static likeBlog(userId, blogId) {
        return new Promise((resolve, reject) => {
            axios.post(`http://localhost:8000/like/` + userId + '/' + blogId)
                .then(res => {
                    resolve(res.data)
                })
        })
    }

    //Category apis
    static getCategories() {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/cats`)
                .then(res => {
                    res.data.sort((a, b) => (a.categoryName > b.categoryName) ? 1 : -1)
                    resolve(res.data)
                })
        })
    }

    static getCategory(id) {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/cat/` + id)
                .then(res => {
                    resolve(res.data)
                })
        })
    }

    static pagination(skipCount, catID) {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/blogPagination/` + catID + '/' + skipCount)
                .then(res => {
                    resolve(res.data)
                })
        })
    }
    static blogSearch(key) {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/blog/search/` + key)
                .then(res => {
                    resolve(res.data)
                })
        })
    }
    static blogsCount(catID) {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/blog/count/` + catID)
                .then(res => {
                    resolve(res.data)
                })
        })
    }
    static blogsCountByAuthor(userId) {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/blog/authorBlogsCount/` + userId)
                .then(res => {
                    resolve(res.data)
                })
        })
    }
    static getblogsByAuthor(skipCount, userId) {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/blogByAuthor/` + userId + '/' + skipCount)
                .then(res => {
                    resolve(res.data)
                })
        })
    }

    //Comment apis
    static addComment(comment) {
        return new Promise((resolve, reject) => {
            axios.post(`http://localhost:8000/comment`, comment)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    resolve(res.data)
                })
        })
    }
    static getCommentByBlog(id) {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/comment/` + id)
                .then(res => {
                    resolve(res.data)
                })
        })
    }
    static deleteComment(id) {
        return new Promise((resolve, reject) => {
            axios.delete(`http://localhost:8000/comment/` + id)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    resolve(res.data)
                })
        })
    }


    //User apis
    static addUser(user) {
        return new Promise((resolve, reject) => {
            axios.post(`http://localhost:8000/user`, user)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    resolve(res)
                })
        })
    }

    static getUser(id) {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/user/` + id)
                .then(res => {
                    resolve(res.data)
                })
        })
    }
    static login(user) {
        return new Promise((resolve, reject) => {
            axios.post(`http://localhost:8000/login`, user)
                .then(res => {
                    resolve(res.data)
                })
        })
    }

    //Follower apis
    static follow(follow) {
        return new Promise((resolve, reject) => {
            axios.post(`http://localhost:8000/follow`, follow)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    resolve(res)
                })
        })
    }

    static getFollowerCount(authorID) {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/followersCount/` + authorID)
                .then(res => {
                    resolve(res.data)
                })
        })
    }
    static getFollowingCount(userID) {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/followingCount/` + userID)
                .then(res => {
                    resolve(res.data)
                })
        })
    }
    static findFollowers(authorID) {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/findFollowers/` + authorID)
                .then(res => {
                    resolve(res.data)
                })
        })
    }
    static findFollowing(userID) {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:8000/findFollowing/` + userID)
                .then(res => {
                    resolve(res.data)
                })
        })
    }
}
