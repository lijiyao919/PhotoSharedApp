import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Card, CardHeader, CardMedia, Stack } from "@mui/material";

import "./styles.css";
//import fetchModel from "../../lib/fetchModelData";
import axios from "axios";

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

/**
 * Define UserPhotos, a React component of CS142 Project 5.
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {photos:null, count:0};
    this.handleForwardClick = this.handleForwardClick.bind(this);
    this.handleBackwardClick = this.handleBackwardClick.bind(this);
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
      this.setState({photos:resp.data, count:0})
    });
  }

  handleForwardClick(){
    this.setState({photos:this.state.photos, count:this.state.count+1})
  }

  handleBackwardClick(){
    this.setState({photos:this.state.photos, count:this.state.count-1})
  }

  render() {
    if(!this.state.photos){
      return (
        <Typography variant="body1">Loading...</Typography>
      );
    }
    return (
      <>
        {this.props.adv? 
            <Card sx={{mb:"15px"}}>
              <CardHeader subheader={new Date(this.state.photos[this.state.count].date_time).toLocaleString()}/>
              <CardMedia
                component="img"
                sx={{width:"20vw", height:"20vw", objectFit:"cover", ml:"10px"}}
                image={`images/${this.state.photos[this.state.count].file_name}`}
                alt={this.state.photos[this.state.count].file_name}
              />
              <Stack sx={{mb:"10px"}}>
                {this.state.photos[this.state.count].comments && this.state.photos[this.state.count].comments.map((comment, index)=>{
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
                <ButtonGroup size="small" 
                    variant="text" 
                    aria-label="Basic button group"
                    sx={{ml:"600px"}}>
                  {this.state.count>0 && <Button onClick={this.handleBackwardClick}>Backward</Button>}
                  {this.state.count<this.state.photos.length-1 && <Button onClick={this.handleForwardClick}>Forward</Button>}  
                </ButtonGroup>
              </Stack>
            </Card>
        :
        this.state.photos.map((photo, index)=>{
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
