import React from "react";
import axios from "axios";

import { Box, Typography, Card, CardHeader, CardMedia, Stack, IconButton, Badge, Button } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

class FavorsList extends React.Component{
  constructor(props){
    super(props);
    this.state = {favors:[], openWin: false, pic_name: null};
    this.handleCloseWin = this.handleCloseWin.bind(this);
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

  handlePicDetail(){
    return(
      <Dialog
        open={this.state.openWin}
        onClose={this.handleCloseWin}
        disableRestoreFocus
        maxWidth={false}
        PaperProps={{ sx: { width: "600px" } }}
      >
        <DialogContent>
          <CardMedia
              component="img"
              sx={{width:"300px", height:"300px", objectFit:"cover", ml:"50px"}}
              image={`images/${this.state.pic_name}`}
              alt={this.state.pic_name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseWin}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleOpenWin(event, file_name){
    this.setState({openWin: true, pic_name: file_name});
  }

  handleCloseWin(){
    this.setState({openWin: false, pic_name: null});
  }

  renderAllFavors() {
    return (
      <>
        {this.state.favors.map((favor, index)=>{
          return (
            <Card sx={{width: "25%", height: "8%", mb:"3%"}} key={index}>
              <IconButton 
                onClick={()=>this.handleDelete(favor._id)} 
                sx={{mr:"2px", mt:"2px"}}>
                    <DeleteForeverIcon sx={{ fontSize: "20px" }} />
              </IconButton>  
              <Stack direction={"row"} justifyContent="space-around">
                <IconButton onClick={(e)=>this.handleOpenWin(e, favor.file_name)}>
                  <CardMedia
                    component="img"
                    sx={{width:"40px", height:"40px", objectFit:"cover"}}
                    image={`images/${favor.file_name}`}
                    alt={favor.file_name}
                  />
                </IconButton>
                <CardHeader 
                  subheader={new Date(favor.date_time).toLocaleString()} 
                  subheaderTypographyProps={{
                    sx: {
                      fontSize: "15px",
                    },
                  }}
                />
              </Stack>
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
        {this.state.pic_name && this.handlePicDetail()}
      </>
    );
  }

}

export default FavorsList;