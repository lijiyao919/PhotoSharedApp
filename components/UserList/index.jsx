import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

import "./styles.css";
//import fetchModel from "../../lib/fetchModelData";
import axios from 'axios';

/**
 * Define UserList, a React component of CS142 Project 5.
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state={users:null};
  }

  componentDidMount() {
    // fetchModel("/user/list").then((resp)=>{
    //   this.setState({users:JSON.parse(resp)})
    // });
    axios.get("/user/list").then((resp)=>{
      //console.log("user list resp: ", resp.data);
      this.setState({users:resp.data})
    });
  }

  render() {
    if(!this.state.users){
      return <Typography>Loading...</Typography>;
    }
    return (
      <div> 
        <List component="nav">
          {this.state.users.map((user, index) => {
            return (
              <React.Fragment key={index}>
                <ListItem alignItems="center">
                  <ListItemAvatar>
                    <Avatar>{user.first_name[0]}{user.last_name[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Link to={`/users/${user._id}`}>{user.first_name} {user.last_name}</Link>} />
                </ListItem>
                <Divider />
              </React.Fragment>
            );
          })}
        </List>
      </div>
    );
  }
}

export default UserList;
