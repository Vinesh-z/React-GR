import React, { Component } from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom';
export default class Sidebar extends Component {
    state = {
        flag: false, menuItems: [
            {
                title: 'Home',
                route: '/',
                icon: 'home'
            },
            {
                title: 'Add Blog',
                route: '/addBlog',
                icon: 'plus'
            },
            {
                title: 'Profile',
                route: '/profile/5ee5306dc5273250d32e0467',
                icon: 'user'
            },
            {
                title: 'Contact',
                route: '/contact',
                icon: 'phone'
            },
            {
                title: 'About',
                route: '/about',
                icon: 'info-circle'
            }
        ]
    }

    onClickHandler = () => { this.setState({ flag: !this.state.flag }); };
    render() {
        const classes = [this.state.flag ? "side-wrap" : "side-wrap side-collapse"].join("");
        return (
            <div className={classes}>
                <div className="sidebar">
                    <ul>
                        <li className="toggle-button"><a onClick={this.onClickHandler}>
                            <span className="icon"><i className="fa fa-bars"></i></span>
                            <span className="title">Menu</span>
                        </a></li>
                        {
                            this.state.menuItems.map((item) => {
                                return (
                                    <li className="menu-list"  key={item.title}>
                                        <Link to={item.route}>
                                            <a className="menu-link" onClick={this.onClickHandler}>
                                                <div className="row">
                                                    <div className="col-md-2 p-2 pl-3">
                                                        <span className="icon"><i className={"fa fa-" + item.icon}></i></span>
                                                    </div>
                                                    <div className="col-md-10 pt-2 pl-3">
                                                        <span className="title">{item.title}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    </li>);
                            })}
                    </ul >
                </div >
            </div >
        )
    }
}
