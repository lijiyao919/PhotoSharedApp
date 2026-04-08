import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Badge,
  Stack
} from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
//import fetchModel from "../../lib/fetchModelData";
import axios from 'axios';

/**
 * Define UserList, a React component of CS142 Project 5.
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.refreshUsers();
  }

  render() {
    if(!this.props.users){
      return <Typography>Loading...</Typography>;
    }
    return (
      <div> 
        <List component="nav">
          {this.props.users.map((user, index) => {
            return (
              <React.Fragment key={index}>
                <ListItem alignItems="center">
                  <ListItemText primary={<Link to={`/users/${user._id}`}>{user.first_name} {user.last_name}</Link>} />
                  <Stack direction="row" spacing={4} sx={{display:"flex", alignItems:"center"}}>
                    <Badge badgeContent={user.countPhotos} color="success" />
                    <Link to={`/comments/${user._id}`}>
                      <Badge badgeContent={user.countComments} color="secondary" />
                    </Link>
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
