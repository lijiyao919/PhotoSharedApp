import { TextField, Box, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import React from "react";
import axios from "axios";
import "./styles.css";

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username:"",
                  passwd:"",
                  regWin:false,
                  username_reg:"",
                  passwd_reg:"",
                  confirm_reg:"",
                  confirm_err:"",
                  firstname_reg:"",
                  lastname_reg:"",
                  location_reg:"",
                  occupation_reg:"",
                  description_reg:"",
                };
    this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
    this.handleOpenRegWin = this.handleOpenRegWin.bind(this);
    this.handleCloseRegWin = this.handleCloseRegWin.bind(this);
  }

  handleOpenRegWin(){
    this.setState({regWin:true});
  }

  handleCloseRegWin(){
    this.setState({regWin:false,
                  username_reg:"",
                  passwd_reg:"",
                  confirm_reg:"",
                  confirm_err:"",
                  firstname_reg:"",
                  lastname_reg:"",
                  location_reg:"",
                  occupation_reg:"",
                  description_reg:"",
                });
  }

  handleSubmitLogin(e){
    e.preventDefault();
    axios.post(`/admin/login`, {login_name:this.state.username, 
      password:this.state.passwd}).then(
        (resp) => {
          console.log("after login: ", resp.data);
          this.props.setLogin(true);
        }
    ).catch(
      err=>{console.log(err);}
    );
  }

  handleInputUserNameInReg = (e)=>{
    this.setState({username_reg: e.target.value});
  };

  handleInputPasswordInReg = (e)=>{
    this.setState({passwd_reg: e.target.value});
  }

  handleConfirmedPasswordInReg = (e)=>{
    this.setState({confirm_reg: e.target.value});
  }

  handleInputFirstNameInReg = (e)=>{
    this.setState({firstname_reg: e.target.value});
  };

  handleInputLastNameInReg = (e)=>{
    this.setState({lastname_reg: e.target.value});
  };

  handleInputLocationInReg = (e)=>{
    this.setState({location_reg: e.target.value});
  };

  handleInputOccupationInReg = (e)=>{
    this.setState({occupation_reg: e.target.value});
  };

  handleInputDescriptionInReg = (e)=>{
    this.setState({description_reg: e.target.value});
  };

  handleRegSubmit = (e)=>{
    e.preventDefault();
    if(this.state.passwd_reg !== this.state.confirm_reg){
      console.log("passwd not equal");
      this.setState({confirm_err:"confirmed password not match"});
      return;
    }
    axios.post("/user", {first_name: this.state.firstname_reg,
               last_name: this.state.lastname_reg,
               login_name: this.state.username_reg,
               password: this.state.passwd_reg,
               location: this.state.location_reg,
               description: this.state.description_reg,
               occupation: this.state.occupation_reg,
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
          <Box component="form" onSubmit={this.handleSubmitLogin} className="js-login-container">
            <TextField
              required 
              type="text"
              label="Username"
              placeholder="Enter your username"
              defaultValue={this.state.username}
              onChange={(e) => {this.setState({username: e.target.value})}}
              sx={{width:"250px"}}>
            </TextField>
            <TextField
              required
              type="password"
              label="Password"
              placeholder="Enter your password"
              defaultChecked={this.state.passwd}
              onChange={(e) => {this.setState({passwd: e.target.value})}}
              sx={{width:"250px", ml:"20px"}}>
            </TextField>
            <Button
              type="submit"
              variant="contained"
              sx={{width:"100px", ml:"20px"}}>
              Login
            </Button>
          </Box>
          <Button onClick={this.handleOpenRegWin}>Register Me</Button>
        </Stack>
        <Dialog
          open={this.state.regWin}
          onClose={this.handleCloseRegwin}
          disableRestoreFocus
          PaperProps={{ sx: { width: "400px" } }}
        >
          <DialogTitle>User Registration</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={(e)=>this.handleRegSubmit(e)} id="subscription-form">
              <TextField
                required
                label="Username"
                size="small"
                defaultValue={this.state.username_reg}
                onChange={this.handleInputUserNameInReg}
                sx={{width:"300px",mt:"10px", ml:"15px"}}
              />
              <TextField
                required
                type="password"
                label="Password"
                size="small"
                defaultValue={this.state.passwd_reg}
                onChange={this.handleInputPasswordInReg}
                sx={{width:"300px",mt:"10px", ml:"15px"}}
              />
              <TextField
                required
                type="password"
                label="Confirmed Password"
                size="small"
                defaultValue={this.state.confirm_reg}
                onChange={this.handleConfirmedPasswordInReg}
                sx={{width:"300px",mt:"10px", ml:"15px"}}
                error={Boolean(this.state.confirm_err)}
                helperText={this.state.confirm_err}
              />
              <TextField
                required
                label="First Name"
                size="small"
                defaultValue={this.state.firstname_reg}
                onChange={this.handleInputFirstNameInReg}
                sx={{width:"300px",mt:"10px", ml:"15px"}}
              />
              <TextField
                required
                label="Last Name"
                size="small"
                defaultValue={this.state.lastname_reg}
                onChange={this.handleInputLastNameInReg}
                sx={{width:"300px",mt:"10px", ml:"15px"}}
              />
              <TextField
                label="Location"
                size="small"
                defaultValue={this.state.location_reg}
                onChange={this.handleInputLocationInReg}
                sx={{width:"300px",mt:"10px", ml:"15px"}}
              />
              <TextField
                label="Occupation"
                size="small"
                defaultValue={this.state.occupation_reg}
                onChange={this.handleInputOccupationInReg}
                sx={{width:"300px",mt:"10px", ml:"15px"}}
              />
              <TextField
                label="Description"
                size="small"
                defaultValue={this.state.description_reg}
                onChange={this.handleInputDescriptionInReg}
                sx={{width:"300px",mt:"10px", ml:"15px"}}
              />
            </Box>
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