import React from "react";
import axios from "axios";

import { Box, Typography, Card, CardHeader, CardMedia, Stack, IconButton, Badge } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

class FavorsList extends React.Component{
  constructor(props){
    super(props);
    this.state = {favors:[]};
  }

  componentDidMount(){
    axios.get("/favorsList").then(resp=>{
      //console.log(resp.data);
      this.setState({favors:resp.data});
    });
  }

  handleDelete(photo_id) {
    const user_id = this.props.match.params.userId;
    axios.delete(`/favorsOfPhoto/${photo_id}`, {}).then(
      resp => {
        axios.get(`/favorsList`).then((resp)=>{
          this.setState({favors:resp.data});
        });
      }
    ).catch(
      err => console.log(err)
    );
  }

  renderAllFavors() {
    return (
      <>
        {this.state.favors.map((favor, index)=>{
          return (
            <Card sx={{mb:"15px"}} key={index}>
              <Stack direction={"row"} justifyContent="space-between">
                <CardHeader subheader={new Date(favor.date_time).toLocaleString()}/>
                <IconButton 
                  onClick={()=>this.handleDelete(favor._id)}
                  size="small" 
                  sx={{mr:"10px", mt:"10px"}}>
                      <DeleteForeverIcon />
                </IconButton>
              </Stack>
              <CardMedia
                component="img"
                sx={{width:"20vw", height:"20vw", objectFit:"cover", ml:"10px"}}
                image={`images/${favor.file_name}`}
                alt={favor.file_name}
              />
            </Card>
          );
        })}
      </>
    );
  }

  render() {
    if(!this.state.favors){
      return (
        <Typography variant="body1">Loading...</Typography>
      );
    }
    return (
      <>
        {this.renderAllFavors()}
      </>
    );
  }

}

export default FavorsList;