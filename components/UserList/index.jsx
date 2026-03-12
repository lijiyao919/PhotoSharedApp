import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Badge,
  Stack
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
      console.log("user list: ", usersInfo);
      this.setState({users:usersInfo});
    });
  }

  render() {
    if(!this.state.users){
      return <Typography>Loading...</Typography>;
    }
    console.log("return: ", JSON.stringify(this.state.users));
    return (
      <div> 
        <List component="nav">
          {this.state.users.map((user, index) => {
            return (
              <React.Fragment key={index}>
                <ListItem alignItems="center">
                  <ListItemText primary={<Link to={`/users/${user._id}`}>{user.first_name} {user.last_name}</Link>} />
                  <Stack direction="row" spacing={4}>
                    <Badge badgeContent={user.countPhotos} color="success" />
                    <Badge badgeContent={user.countComments} color="secondary" />
                  </Stack>
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
