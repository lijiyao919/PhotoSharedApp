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
    this.state = {user:null, firstPhotoId:null};
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
    let user = undefined;
    let photoId = undefined;

    const p1 = axios.get(`/user/${this.props.match.params.userId}`).then((resp)=>{
      //console.log("user detail resp in mount: ", resp.data);
      user = resp.data;
    });
    const p2 = axios.get(`/photosOfUser/${this.props.match.params.userId}`).then((resp)=>{
      if(resp.data.length===0){
        photoId = undefined;
      }else{
        photoId = resp.data[0]._id;
      }
    });

    Promise.all([p1,p2]).then(()=>{
      //console.log("user: ", user);
      //console.log("photo id: ", photoId);
      this.setState({user:user, firstPhotoId:photoId})
    })
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
              {this.props.adv && this.state.firstPhotoId ?
               <Link to={`/photos/${this.state.user._id}/${this.state.firstPhotoId}`}>
                 {this.state.user.first_name}'s Photo Gallery
               </Link> :
               <Link to={`/photos/${this.state.user._id}`}>
                 {this.state.user.first_name}'s Photo Gallery
               </Link>}
            </Button>
          </CardActions>
        </Card>
    );
    }
    
  }
}

export default UserDetail;
