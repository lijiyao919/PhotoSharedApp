import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Card, CardHeader, CardMedia, Stack } from "@mui/material";

import "./styles.css";
//import fetchModel from "../../lib/fetchModelData";
import axios from "axios";

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

/**
 * Define UserPhotos, a React component of CS142 Project 5.
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {photos:null, index:0, openCommentWin:false, commentText:'', commentPhotoId:null};
    this.handleForwardClick = this.handleForwardClick.bind(this);
    this.handleBackwardClick = this.handleBackwardClick.bind(this);
    //this.handleOpenCommentWin = this.handleOpenCommentWin.bind(this);
    this.handleClose = this.handleClose.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
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
      //console.log("photo resp: ", resp.data);
      this.setState({photos:resp.data, 
                     index:resp.data.findIndex(
                       photo=>photo._id===this.props.match.params.photoId
                     )});
    });
  }

  componentDidUpdate(preProps, preState) {
    // this.setState({
    //   photos:window.cs142models.photoOfUserModel(this.props.match.params.userId),
    // })
    // fetchModel(`/photosOfUser/${this.props.match.params.userId}`).then((resp)=>{
    //   //console.log("photo resp: ", resp);
    //   this.setState({photos:JSON.parse(resp)})
    // });
    
    if(preProps.match.params.userId!=this.props.match.params.userId || 
       preProps.match.params.photoId!=this.props.match.params.photoId ||
       (preState.openCommentWin===true && this.state.openCommentWin===false)){
        axios.get(`/photosOfUser/${this.props.match.params.userId}`).then((resp)=>{
          //console.log("photo resp: ", resp.data);
          this.setState({photos:resp.data, 
                        index:resp.data.findIndex(
                          photo=>photo._id===this.props.match.params.photoId
                        )});
        });
        //console.log("pre props: ", preProps);
        //console.log("current props: ", this.props);
    }

    if (!preProps.adv && this.props.adv) {
      const { photos } = this.state;
      const { userId } = this.props.match.params;
      if (photos.length === 0) return;
      this.setState({ index: 0 });
      this.props.history.push(`/photos/${userId}/${photos[0]._id}`);
    }

    if (preProps.adv && !this.props.adv) {
      const { userId } = this.props.match.params;
      this.props.history.push(`/photos/${userId}`);
    }
  }

  handleForwardClick(){
    //this.setState({photos:this.state.photos, index:this.state.index+1})
    const photoId = this.state.photos[this.state.index+1]._id;
    this.props.history.push(`/photos/${this.props.match.params.userId}/${photoId}`);
  }

  handleBackwardClick(){
    //this.setState({photos:this.state.photos, index:this.state.index-1})
    const photoId = this.state.photos[this.state.index-1]._id;
    this.props.history.push(`/photos/${this.props.match.params.userId}/${photoId}`);
  }

  handleOpenCommentWin(photo_id){
    this.setState({openCommentWin:true, commentPhotoId:photo_id});
  }

  handleClose(){
    this.setState({openCommentWin:false});
  }

  handleInputComment(event){
    this.setState({commentText: event.target.value});
  }

  handleSubmit(event){
    event.preventDefault();
    //console.log("comment: ", this.state.commentText);
    axios.post(`/commentsOfPhoto/${this.state.commentPhotoId}`, {comment:this.state.commentText}).then(resp=>{
      this.setState({openCommentWin:false});
    });  
  }

  renderPhotoOneByOne(){
    return (
      <Card sx={{mb:"15px"}}>
        <Stack direction={"row"} justifyContent="space-between">
          <CardHeader subheader={new Date(this.state.photos[this.state.index].date_time).toLocaleString()}/>
          <Button variant="contained" 
                size="small" 
                sx={{mr:"10px", mt:"10px"}} 
                onClick={()=>this.handleOpenCommentWin(photo._id)}>
                  Add Comment
          </Button>
        </Stack>
        <CardMedia
          component="img"
          sx={{width:"20vw", height:"20vw", objectFit:"cover", ml:"10px"}}
          image={`images/${this.state.photos[this.state.index].file_name}`}
          alt={this.state.photos[this.state.index].file_name}
        />
        <Stack sx={{mb:"10px"}}>
          {this.state.photos[this.state.index].comments && this.state.photos[this.state.index].comments.map((comment, index)=>{
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
            {this.state.index>0 && <Button onClick={this.handleBackwardClick}>Backward</Button>}
            {this.state.index<this.state.photos.length-1 && <Button onClick={this.handleForwardClick}>Forward</Button>}  
          </ButtonGroup>
        </Stack>
      </Card>
    );
  }

  renderAllPhotos() {
    return (
      <>
        {this.state.photos.map((photo, index)=>{
          return (
            <Card sx={{mb:"15px"}} key={index}>
              <Stack direction={"row"} justifyContent="space-between">
                <CardHeader subheader={new Date(photo.date_time).toLocaleString()}/>
                <Button variant="contained"
                     onClick={()=>this.handleOpenCommentWin(photo._id)}
                     size="small" 
                     sx={{mr:"10px", mt:"10px"}}>
                      Add Comment
                </Button>
              </Stack>
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

  render() {
    if(!this.state.photos){
      return (
        <Typography variant="body1">Loading...</Typography>
      );
    }
    return (
      <>
        {this.props.match.params.photoId? 
          this.renderPhotoOneByOne()      
        :
          this.renderAllPhotos()
        }
        <Dialog open={this.state.openCommentWin} onClose={this.handleClose} disableRestoreFocus>
          <DialogTitle>Let Your Voice heard</DialogTitle>
          <DialogContent>
            <form onSubmit={(e)=>this.handleSubmit(e)} id="subscription-form">
              <TextField
                id="comment"
                name="comment"
                multiline
                rows={4}
                fullWidth
                margin="dense"
                placeholder="Write your comment here..."
                onChange={(e)=>this.handleInputComment(e)}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button type="submit" form="subscription-form">
              Submit
            </Button>
            <Button onClick={this.handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </>   
    );
  }
}

export default UserPhotos;
