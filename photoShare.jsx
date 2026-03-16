import React from "react";
import ReactDOM from "react-dom";
import { Grid, Typography, Paper } from "@mui/material";
import { HashRouter, Route, Switch } from "react-router-dom";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state={adv:false};
    this.setAdv = this.setAdv.bind(this);
  }

  setAdv = function (val) {
    //console.log("val: ", val);
    this.setState({adv:val});
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar setAdv={this.setAdv}/>
            </Grid>
            <div className="cs142-main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="cs142-main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="cs142-main-grid-item">
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => (
                      <>
                      <Typography variant="body1">
                        Welcome to your photosharing app! 
                      </Typography>
                      </>
                    )}
                  />
                  <Route
                    path="/users/:userId"
                    render={(props) => <UserDetail {...props} adv={this.state.adv}/>}
                  />
                  <Route
                    path="/photos/:userId/:photoId?"
                    render={(props) => <UserPhotos {...props} adv={this.state.adv}/>}
                  />
                  <Route
                    path="/comments/:userId"
                    render={(props) => <UserComments {...props}/>}
                  />
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    );
  }
}

ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
