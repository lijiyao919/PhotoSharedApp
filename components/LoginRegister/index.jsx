import { TextField, Box, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import React from "react";
import axios from "axios";
import "./styles.css";

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username:"", 
                  regWin:false, 
                  firstname:"",
                  lastname:"",
                  location:"",
                  occupation:"",
                  description:""
                };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleOpenRegWin = this.handleOpenRegWin.bind(this);
    this.handleCloseRegWin = this.handleCloseRegWin.bind(this);
  }

  handleOpenRegWin(){
    this.setState({regWin:true});
  }

  handleCloseRegWin(){
    this.setState({regWin:false});
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

  handleInputUserName = (e)=>{
    this.setState({username:e.target.value});
  };

  handleInputFirstName = (e)=>{
    this.setState({firstname:e.target.value});
  };

  handleInputLastName = (e)=>{
    this.setState({lastname:e.target.value});
  };

  handleInputLocation = (e)=>{
    this.setState({location:e.target.value});
  };

  handleInputOccupation = (e)=>{
    this.setState({occupation:e.target.value});
  };

  handleInputDescription = (e)=>{
    this.setState({description:e.target.value});
  };

  handleRegSubmit = (e)=>{
    e.preventDefault();
    console.log("ln: ", this.state.lastname);
    axios.post("/user", {first_name: this.state.firstname,
               last_name: this.state.lastname,
               login_name: this.state.username,
               location: this.state.location,
               description: this.state.description,
               occupation: this.state.occupation,
    }).then(resp=>{
      console.log("after reg: ", resp.data);
      this.handleCloseRegWin();
    }).catch(err=>{
      console.log("reg err: ", err);
    });
  };

  render(){
    return (
      <>
        <Stack justifyContent="center">
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
          <Button onClick={this.handleOpenRegWin}>Register</Button>
        </Stack>
        <Dialog
          open={this.state.regWin}
          onClose={this.handleCloseRegwin}
          disableRestoreFocus
          PaperProps={{ sx: { width: "400px" } }}
        >
          <DialogTitle>User Registration</DialogTitle>
          <DialogContent>
            <form onSubmit={(e)=>this.handleRegSubmit(e)} id="subscription-form">
              <TextField
                label="Username"
                defaultValue=""
                size="small"
                onChange={this.handleInputUserName}
                sx={{width:"300px",mt:"10px", ml:"15px"}}
              />
              <TextField
                label="First Name"
                defaultValue=""
                size="small"
                onChange={this.handleInputFirstName}
                sx={{width:"300px",mt:"10px", ml:"15px"}}
              />
              <TextField
                label="Last Name"
                defaultValue=""
                size="small"
                onChange={this.handleInputLastName}
                sx={{width:"300px",mt:"10px", ml:"15px"}}
              />
              <TextField
                label="Location"
                defaultValue=""
                size="small"
                onChange={this.handleInputLocation}
                sx={{width:"300px",mt:"10px", ml:"15px"}}
              />
              <TextField
                label="Occupation"
                defaultValue=""
                size="small"
                onChange={this.handleInputOccupation}
                sx={{width:"300px",mt:"10px", ml:"15px"}}
              />
              <TextField
                label="Description"
                defaultValue=""
                size="small"
                onChange={this.handleInputDescription}
                sx={{width:"300px",mt:"10px", ml:"15px"}}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button type="submit" form="subscription-form">
              Submit
            </Button>
            <Button onClick={this.handleCloseRegWin}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default LoginRegister;