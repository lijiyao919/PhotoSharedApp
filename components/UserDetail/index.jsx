import React from "react";
import { Link } from "react-router-dom";
import { Typography, Card, CardActions, CardContent, Button, Stack, Box} from "@mui/material";

import "./styles.css";
//import fetchModel from "../../lib/fetchModelData";
import axios from "axios";


/**
 * Define UserDetail, a React component of CS142 Project 5.
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user:null};
  }

  // getUser(){
  //   return window.cs142models.userModel(this.props.match.params.userId);
  // }

  componentDidMount() {
    //this.setState({user:this.getUser()});
    //fetchModel(`/user/${this.props.match.params.userId}`).then((resp)=>{
      //console.log("user detail resp in mount: ", resp);
      //this.setState({user:JSON.parse(resp)});
    //});
    axios.get(`/user/${this.props.match.params.userId}`).then((resp)=>{
      //console.log("user detail resp in mount: ", resp.data);
      this.setState({user:resp.data});
    });
  }

  componentDidUpdate(preProps){
    if(preProps.match.params.userId!=this.props.match.params.userId){
      //fetchModel(`/user/${this.props.match.params.userId}`).then((resp)=>{
        //console.log("user detail resp: ", resp);
        //this.setState({user:JSON.parse(resp)});
      //});
      axios.get(`/user/${this.props.match.params.userId}`).then((resp)=>{
        //console.log("user detail resp in mount: ", resp.data);
        this.setState({user:resp.data});
      });
    }   
  }

  render() {
    if(!this.state.user) {
      return <Typography>Loading...</Typography>
    }
    else{
      return (
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {this.state.user.first_name} {this.state.user.last_name}'s Details:
            </Typography>
            <Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {`Location: ${this.state.user.location}`}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {`Description: ${this.state.user.description}`}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {`Occupation: ${this.state.user.occupation}`}
                </Typography>
            </Stack>
          </CardContent>
          <CardActions>
            <Button size="small">
              <Link to={`/photos/${this.state.user._id}`}>{this.state.user.first_name}'s Photo Gallery</Link>
            </Button>
          </CardActions>
        </Card>
    );
    }
    
  }
}

export default UserDetail;
