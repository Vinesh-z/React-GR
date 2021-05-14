import React from 'react'
import {  Navbar } from 'react-bootstrap';
import styled from 'styled-components';
import icon from '../../assets/icon.png'
const Styles = styled.div`
.navbar {
    background-color: #222;
    margin-bottom : 0;
}
.navbar-brand {
    
  }
.navbar-brand, .navbar-nav .nav-link {
    color: #bbb;
    padding-left: 5rem;
    &:hover {
        color: white
    }
}
`;

export const NavigationBar = () => (
    <div>
        
        <Styles>
            <Navbar expand="lg">
                <Navbar.Brand href="/"><img style={{height:"2rem",width:"2rem"}} className="bloggoIcon" alt={icon} src={icon}></img>  BlogGO</Navbar.Brand>
            </Navbar>
        </Styles>
    </div>
)