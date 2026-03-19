import React from "react";
import { Link } from "react-router-dom";
import { Typography, Card, Avatar, Box} from "@mui/material";
import axios from "axios";

class UserComments extends React.Component{
  constructor(props){
    super(props);
    this.state = {comments:null};
  }

  componentDidMount(){
    axios.get(`/commentsOfUser/${this.props.match.params.userId}`).then(resp=>{
      this.setState({comments:resp.data});
    });
  }

  componentDidUpdate(preProps){
    if(preProps.match.params.userId!=this.props.match.params.userId){
      axios.get(`/commentsOfUser/${this.props.match.params.userId}`).then((resp)=>{
        this.setState({comments:resp.data});
      });
    }   
  }

  render() {
    if(!this.state.comments){
      return <Typography>Loading...</Typography>
    }
    return (
      <>
        {this.state.comments.map((comment, index)=>{
          return (
            <Link to={`/photos/${comment.photoOwnerId}/${comment.photoId}`} style={{textDecoration: "none" }}>
              <Card sx={{display:"flex", mb:"15px"}} key={index}>
                <Avatar
                  src={`images/${comment.fileName}`}
                  variant="square"
                  sx={{ width: 80, height: 80,"& img": {
                            objectFit: "cover"
                          }
                      }}
                />
                <Box sx={{ml:"15px"}} key={index}>  
                  <Typography variant="body1">
                    {comment.comment}
                  </Typography>
                  <Typography variant="body2">
                    {(new Date(comment.date_time)).toLocaleString()}  
                  </Typography>  
                </Box>
              </Card>
            </Link>
          );
        })}
      </>
    );}
}

export default UserComments;