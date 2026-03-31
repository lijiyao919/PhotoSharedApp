import React from "react";
import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import { withRouter } from "react-router-dom";

import "./styles.css";
//import fetchModel from "../../lib/fetchModelData";
import axios from "axios";

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from "@mui/material/FormControlLabel";

/**
 * Define TopBar, a React component of CS142 Project 5.
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type:null, ver:null, user:null};
    // fetchModel("/test/info").then((resp)=>{
    //   const data = JSON.parse(resp);
    //   this.setState({
    //     type: this.props.location.pathname.split('/')[1],
    //     ver: data.__v,
    //     user:null
    //   });
    // });
    axios.get("/test/info").then((resp)=>{
      const data = resp.data;
      this.setState({
        type: this.props.location.pathname.split('/')[1],
        ver: data.__v,
        user:null
      });
    });
    this.handleClickCheckedBox=this.handleClickCheckedBox.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount(){
    const path = this.props.location.pathname.split('/');
    if(path.length===3){
      // fetchModel(`/user/${path[2]}`).then((resp)=>{
      //   //console.log("topbar: ", resp);
      //   this.setState({type: path[1],
      //                 ver: this.state.ver,
      //                 user: JSON.parse(resp)});
      // });
      axios.get(`/user/${path[2]}`).then((resp)=>{
        //console.log("topbar: ", resp);
        this.setState({type: path[1],
                      ver: this.state.ver,
                      user: resp.data});
      });
      //console.log("finish mount");
    }
  }

  handleLogout(){
    axios.post("/admin/logout").then(resp=>{
      if(resp.status===400){
        console.log("failt to logout");
      }else{
        console.log("logout successfully");
        this.props.setLogin(false);
      }
    });
  }

  componentDidUpdate(preProps){
    //console.log("pre loc: ", preProps.location.pathname);
    //console.log("after loc: ", this.props.location.pathname);
    if(preProps.location.pathname !== this.props.location.pathname){
      // fetchModel(`/user/${this.props.location.pathname.split('/')[2]}`).then((resp)=>{
      //   this.setState({type: this.props.location.pathname.split('/')[1],
      //                  ver: this.state.ver,
      //                  user: JSON.parse(resp)});
      // });
      if(this.props.isLogin){
        axios(`/user/${this.props.location.pathname.split('/')[2]}`).then((resp)=>{
          this.setState({type: this.props.location.pathname.split('/')[1],
                        ver: this.state.ver,
                        user: resp.data});
        });
      }
      else{
        this.setState({type:null, user:null});
      }
    }
  }

  handleClickCheckedBox(event) {
    this.props.setAdv(event.target.checked);
  }

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar className="js-top-bar">
          <Typography variant="h5" color="inherit">
            {!this.props.isLogin ? 
              <span>Please Login</span>:
              <Stack direction="row" spacing={2} alignItems="center">
                <span>Hello {this.props.firstName}</span>
                <Button size="small" sx={{ color: "white" }} onClick={this.handleLogout}>
                  Logout
                </Button>
              </Stack>
            }
            <FormControlLabel sx={{display:"block"}}
              control={<Checkbox sx={{ color: "white", '&.Mui-checked': { color: "white" } }} 
                        size="small"/>} 
              label="Advanced Feature"
              onChange={this.handleClickCheckedBox}
            />
          </Typography>
          {(this.props.isLogin && this.state.type && this.state.user) ?
            (<Typography variant="h5" color="inherit">
                {this.state.type==="photos"?"Photos of ":""} 
                {this.state.user.first_name} {" "}
                {this.state.user.last_name}
            </Typography>) 
            : (<Typography variant="body2" color="inherit">
                ver: {this.state.ver}
               </Typography>)
          }
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(TopBar);
