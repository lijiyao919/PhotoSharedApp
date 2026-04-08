import React from "react";
import ReactDOM from "react-dom";
import { Redirect } from "react-router-dom";
import { Grid, Typography, Paper } from "@mui/material";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";
import LoginRegister from "./components/LoginRegister";
import axios from "axios";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state={adv:false, userIsLogin:false, userFirstName:null, users:null};
    this.setAdv = this.setAdv.bind(this);
    this.setUserIsLogin = this.setUserIsLogin.bind(this);
    this.refreshUsers = this.refreshUsers.bind(this);
  }

  setAdv = function (val) {
    //console.log("val: ", val);
    this.setState({adv:val});
  }

  setUserIsLogin = function (val) {
    //console.log("val: ", val);
    this.setState({userIsLogin:val});
  }

  refreshUsers(){
    axios.get("/user/list").then((users)=>{
      //console.log("user list 1: ", users.data);
      const p = [];
      users.data.forEach(user=>{
        const p1 = axios.get("/count/photos/"+user._id).then(resp=>{
          user.countPhotos = resp.data.length;
          //console.log("user: ", user);
        });
        const p2 = axios.get("/count/comments/"+user._id).then(resp=>{
          user.countComments = resp.data.comment_count;
        });
        p.push(p1);
        p.push(p2);
      });
      return Promise.all(p).then(()=>users.data);  
    }).then(usersInfo=>{
      this.setState({users:usersInfo});
    });
  }

  componentDidMount(){
    axios.get("/admin/me", {
      withCredentials: true
    }).then((resp)=>{
      if(resp.data._id){
        console.log("User's first name: ", resp.data.first_name);
        this.setState({userIsLogin:true, userFirstName:resp.data.first_name});
      }else{
        console.log("no login!");
        this.setState({userIsLogin:false, userFirstName:null});
      }
    }).catch((err)=>{
      console.log("Error: ", err.message); 
    });
  }

  componentDidUpdate(prevProps, prevState){
    if(!prevState.userIsLogin && this.state.userIsLogin){
      console.log("In photoShare, I am updating after login....");
      axios.get("/admin/me", {
        withCredentials: true
      }).then((resp)=>{
        this.setState({userIsLogin:true, userFirstName:resp.data.first_name});
        this.props.history.push(`/users/${resp.data._id}`);
      }).catch((err)=>{
        console.log("Error: ", err.message); 
      });
    }
  }

  componentWillUnmount(){
    console.log("I am unmount in PhotoShare comp");
  }

  render() {
    //console.log("login state: ", this.state.userIsLogin);
    //console.log("first name: ", this.state.userFirstName);
    return (
      <>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar setAdv={this.setAdv} setLogin={this.setUserIsLogin} refreshUsers = {this.refreshUsers} isLogin={this.state.userIsLogin} firstName={this.state.userFirstName}/>
            </Grid>
            <div className="cs142-main-topbar-buffer" />
            {this.state.userIsLogin && (
              <Grid item sm={3}>
                <Paper className="cs142-main-grid-item">
                  <UserList refreshUsers = {this.refreshUsers} users={this.state.users}/>
                </Paper>
              </Grid>)}
            <Grid item sm={this.state.userIsLogin? 9: 12}>
              <Paper className="cs142-main-grid-item">
                <Switch>
                  <Route
                      path="/login-register"
                      render={(props) => <LoginRegister {...props} setLogin={this.setUserIsLogin}/>}
                  />
                  {this.state.userIsLogin?
                    <Route
                      exact
                      path="/"
                      render={() => (
                        <>
                          <Typography variant="body1">
                            Welcome to your photosharing app! 
                          </Typography>
                        </>
                      )}
                    /> :
                    <Redirect path="/" to="/login-register" />
                  }
                  {this.state.userIsLogin?
                    <Route
                      path="/users/:userId"
                      render={(props) => <UserDetail {...props} adv={this.state.adv}/>}
                    /> :
                    <Redirect path="/users/:userId" to="/login-register" />
                  }
                  {this.state.userIsLogin?
                    <Route
                      path="/photos/:userId/:photoId?"
                      render={(props) => <UserPhotos {...props} refreshUsers = {this.refreshUsers} adv={this.state.adv}/>}
                    /> :
                    <Redirect path="/users/:userId/:photoId?" to="/login-register" />
                  }
                  {this.state.userIsLogin?
                    <Route
                      path="/comments/:userId"
                      render={(props) => <UserComments {...props}/>}
                    />:
                    <Redirect path="/comments/:userId" to="/login-register" />
                  }
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}

const PhotoShareWithRouter = withRouter(PhotoShare);

ReactDOM.render(
  <HashRouter>
    <PhotoShareWithRouter />
  </HashRouter>,
  document.getElementById("photoshareapp")
);
//ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
