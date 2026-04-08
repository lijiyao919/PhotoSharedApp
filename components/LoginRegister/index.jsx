import { TextField, Box, Button } from "@mui/material";
import React from "react";
import axios from "axios";
import "./styles.css";

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username:""};
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(e){
    e.preventDefault();
    axios.post(`/admin/login`, {login_name:this.state.username}).then(
      (resp) => {
        console.log("after login: ", resp.data);
        this.props.setLogin(true);
      }
    );
  }

  render(){
    return (
      <Box component="form" onSubmit={this.handleLogin} className="js-login-container">
        <TextField type="text"
          label="Username"
          placeholder="Enter your username"
          value={this.state.username}
          onChange={(e) => {this.setState({username: e.target.value})}}
          sx={{width:"250px"}}>
        </TextField>
        <Button
          type="submit"
          variant="contained"
          sx={{width:"100px", ml:"20px"}}>
          Login
        </Button>
      </Box>
    );
  }
}

export default LoginRegister;