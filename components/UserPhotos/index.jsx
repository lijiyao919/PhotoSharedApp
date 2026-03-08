import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Card, CardHeader, CardMedia, Stack } from "@mui/material";

import "./styles.css";
//import fetchModel from "../../lib/fetchModelData";
import axios from "axios";
/**
 * Define UserPhotos, a React component of CS142 Project 5.
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {photos:null}
  }

  componentDidMount() {
    // this.setState({
    //   photos:window.cs142models.photoOfUserModel(this.props.match.params.userId),
    // })
    // fetchModel(`/photosOfUser/${this.props.match.params.userId}`).then((resp)=>{
    //   //console.log("photo resp: ", resp);
    //   this.setState({photos:JSON.parse(resp)})
    // });
    axios.get(`/photosOfUser/${this.props.match.params.userId}`).then((resp)=>{
      //console.log("photo resp: ", resp);
      this.setState({photos:resp.data})
    });
  }

  render() {
    if(!this.state.photos){
      return (
        <Typography variant="body1">Loading...</Typography>
      );
    }
    return (
      <>
        {this.state.photos.map((photo, index)=>{
          return (
            <Card sx={{mb:"15px"}} key={index}>
              <CardHeader subheader={new Date(photo.date_time).toLocaleString()}/>
              <CardMedia
                component="img"
                sx={{width:"20vw", height:"20vw", objectFit:"cover", ml:"10px"}}
                image={`images/${photo.file_name}`}
                alt={photo.file_name}
              />
              <Stack sx={{mb:"10px"}}>
                {photo.comments && photo.comments.map((comment, index)=>{
                  if(comment){
                    return (
                      <Box sx={{ml:"15px"}} key={index}>  
                        <Typography variant="body1">
                          <Link to={`/users/${comment.user._id}`}>{comment.user.first_name} {comment.user.last_name}</Link> {": "}
                          {comment.comment}
                        </Typography>
                        <Typography variant="body2">
                          {(new Date(comment.date_time)).toLocaleString()}  
                        </Typography>  
                      </Box>
                    );
                  }
                })}
              </Stack>
            </Card>
          );
        })}
      </>    
    );
  }
}

export default UserPhotos;
