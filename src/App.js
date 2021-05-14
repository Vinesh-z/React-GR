import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home/Home';
import { About } from './pages/About/About';
import { Contact } from './pages/Contact/Contact';
import { NoMatch } from './pages/NoMatch';
import { Layout } from './components/Layout/Layout';
import { NavigationBar } from './components/NavigationBar/NavigationBar';
import AddBlog from './pages/AddBlog/AddBlog';
import Sidebar from './components/Sidebar/Sidebar';
import Description from './pages/Description/Description';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import MyBlogs from './pages/MyBlogs/MyBlogs';
import Profile from './pages/Profile/Profile';
import Followers from './pages/Followers/Followers';
import Following from './pages/Following/Following';
import EditBlog from './pages/EditBlog/EditBlog';


class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          {(localStorage.getItem('token')) ? <Sidebar /> : ""}
          <NavigationBar />
          <Layout>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/edit/:blogId" component={EditBlog} />
              <Route exact path="/about" component={About} />
              <Route exact path="/contact" component={Contact} />
              <Route exact path="/profile/:userId" component={Profile} />
              <Route exact path="/addBlog" component={AddBlog} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/myBlogs" component={MyBlogs} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/describe/:blogId" component={Description} />
              <Route exact path="/followers/:authorId" component={Followers} />
              <Route exact path="/following/:userId" component={Following} />
              <Route component={NoMatch} />
            </Switch>
          </Layout>
        </React.Fragment>
      </Router>
    )
  }
}

export default App;
