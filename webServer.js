/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the cs142 collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */
const session = require("express-session");
const multer = require("multer");
const processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const async = require("async");

const express = require("express");
const app = express();

const fs = require("fs");

// Load the Mongoose schema for User, Photo, and SchemaInfo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!
const cs142models = require("./modelData/photoApp.js").cs142models;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/cs142project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));
app.use(session({secret: "secretKey", resave: false, saveUninitialized: false}));
app.use(express.json());

app.use("/user/:id", checkId);
app.use("/photosOfUser/:id", checkId);
app.use("/count/photos/:id", checkId);
app.use("/count/comments/:id", checkId);
app.use("/commentsOfUser/:id", checkId);

function checkId(request, response, next){
  if(request.params.id==="list" || 
    mongoose.Types.ObjectId.isValid(request.params.id)){
    next();
  }else{
    response.status(400).send({ "error": "Invalid user id" });
    return;
  }
}

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 * 
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params
  // objects.
  //console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will
    // match it.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error. We pass it back to the browser with an
        // Internal Service Error (500) error code.
        console.error("Error in /user/info:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object -
        // This is also an internal error return.
        response.status(500).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      //console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    // In order to return the counts of all the collections we need to do an
    // async call to each collections. That is tricky to do so we use the async
    // package do the work. We put the collections into array and use async.each
    // to do each .count() query.
    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          const obj = {};
          for (let i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      }
    );
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400)
    // status.
    response.status(400).send("Bad param " + param);
  }
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", function (request, response) {
  User.find({}, '_id first_name last_name', (err, userList)=>{
    if (err) {
        // Query returned an error. We pass it back to the browser with an
        // Internal Service Error (500) error code.
        console.error("Error in /user/info:", err);
        response.status(500).send(JSON.stringify(err));
        return;
    }
    //console.log(userList);
    response.status(200).send(userList);
  });  
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", function (request, response) {
  const id = request.params.id;
  //const user = cs142models.userModel(id);
  User.find({_id: mongoose.Types.ObjectId(id)}, "-__v", function (err,user){
    //console.log("user: ", user);
    if (err) {
      console.error("Error in /user/info:", err);
      response.status(500).send(JSON.stringify(err));
      return;
    }
    if (user.length === 0) {
      console.log("User with _id:" + id + " not found.");
      response.status(400).send("Not found");
      return;
    }
    response.status(200).send(user[0]);
  });

  
});

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", function (request, response) {
  const id = request.params.id;
  const newPhotos = [];
  //console.log("user id: ", id);
  //const photos = cs142models.photoOfUserModel(id);
  Photo.find({user_id: mongoose.Types.ObjectId(id)}, "-__v", function (err, photos){
    if (photos.length === 0) {
      console.log("Photos for user with _id:" + id + " not found.");
      response.status(200).send([]);
      return;
    }
    async.each(photos, function (photo, outCallback){
      photo = photo.toObject();
      newPhotos.push(photo);
      async.each(photo.comments, function (commentObj, inCallback){
        User.find({_id: commentObj.user_id}, "_id first_name  last_name", function (err, user){
            commentObj.user = user[0];
            delete commentObj.user_id;
            //console.log("commentObj: ", commentObj);
            inCallback(err);
        });
      }, function(err) {
        //console.log("inner: ", photo.comments);
        outCallback(err); 
      });
    }, function(err) {
      response.status(200).send(newPhotos);
    });
  });
  
});

app.get("/count/photos/:id", function (request, response) {
  Photo.countDocuments({user_id: mongoose.Types.ObjectId(request.params.id)},function (err, counts){
    if(err){
      response.status(400).send({"err": "no exist the id."});
      return;
    }
    response.status(200).send({"length": counts});
  });
});

app.get("/count/comments/:id", function (request, response) {
  let count = 0;
  Photo.find({}, function (err, photos){
    if(err){
      response.status(500).send({"err": "Photo cleection err"});
      return;
    }
    photos.forEach(photo => {
      photo.comments.forEach(commentObj => {
        if(commentObj.user_id.equals(mongoose.Types.ObjectId(request.params.id))){
          count++;
        }
      });
    });
    //console.log("comment: ", count);
    response.status(200).send({"comment_count":count});
  });
});

app.get("/commentsOfUser/:id", function(request, response){
  Photo.find({}, function (err, photos){
    if(err){
      response.status(500).send({"err": "Photos list err"});
      console.log(err);
      return;
    }
    const commentObjs = [];
    
    photos.forEach(photo=>{
      photo = photo.toObject();
      photo.comments.forEach(commentObj=>{
        if(commentObj.user_id.toString()===request.params.id){
          commentObj.fileName = photo.file_name;
          commentObj.photoId = photo._id;
          commentObj.photoOwnerId = photo.user_id;
          commentObjs.push(commentObj);
        }
      });
    });
    //console.log(commentObjs);
    response.status(200).send(commentObjs);
    
  });
});

app.post("/commentsOfPhoto/:photo_id", function(request, response){
  const photo_id = request.params.photo_id;
  const comment = request.body.comment;
  const user_id = request.session.userId;
  if(!user_id){
    response.status(400).send({err:"no login for post comments"});
    return;
  }
  Photo.find({_id:mongoose.Types.ObjectId(photo_id)}, function(err, photos){
    if(err){
      response.status(400).send({err:"err in photo search"});
      return;
    }
    if(photos.length===0){
      response.status(400).send({err:"photo not found"});
      return;
    }
    photos[0].comments.push({comment: comment,
                user_id:user_id,
                date_time:(new Date()).toISOString().replace("Z", "+00:00")
    });
    photos[0].save(function(err){
      if(err){
        return response.status(400).send({err:err.message});
      }
      response.status(200).send("done");
    });
  });
});


app.post("/photos/new", function(request, response){
  processFormBody(request, response, function (err) {
    if (err || !request.file) {
        response.status(400).send({err: "err in form body process."});
        return;
    }

    const user_id = request.session.userId;
    if(!user_id){
      response.status(400).send({err:"no login for post comments"});
      return;
    }

    // request.file has the following properties of interest:
    //   fieldname    - Should be 'uploadedphoto' since that is what we sent
    //   originalname - The name of the file the user uploaded
    //   mimetype     - The mimetype of the image (e.g., 'image/jpeg',
    //                  'image/png')
    //   buffer       - A node Buffer containing the contents of the file
    //   size         - The size of the file in bytes

    // XXX - Do some validation here.

    // We need to create the file in the directory "images" under an unique name.
    // We make the original file name unique by adding a unique prefix with a
    // timestamp.
    const timestamp = new Date().valueOf();
    const filename = 'U' +  String(timestamp) + request.file.originalname;

    fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
      // XXX - Once you have the file written into your images directory under the
      // name filename you can create the Photo object in the database
      if(err){
        response.status(400).send({err:"fail to write photo into disk"});
      }
      Photo.create({
        file_name:filename,
        date_time:(new Date()).toISOString().replace("Z", "+00:00"),
        user_id:request.session.userId,
        comments: Array(),
        __v:0
      }).then(function (objUser){
        response.status(200).send(`Obj has been written into DB ${objUser}`);
      }).catch(function (err){
        console.error("Error create user", err);
      });
    });
  });
});

app.post("/user", function(request, response) {
  if(!request.body){
    return response.status(404).send("no login name provided.");
  }

  User.find({login_name: request.body.login_name}, function(err, users){
    if (err) {
      return response.status(500).send(err);
    }
    
    if(users.length>0){
      return response.status(400).send({error: "Username has already been existed."});
    }
    
    User.create({first_name: request.body.first_name,
               last_name: request.body.last_name,
               login_name: request.body.login_name,
               password: request.body.password,
               location: request.body.location,
               description: request.body.description,
               occupation: request.body.occupation,
    }).then(userObj=>{
      return response.status(200).send(userObj+" has been saved into DB");
    }).catch(err=>{
      return response.status(400).send({err: err});
    });
  });
});


app.post("/admin/login", function(request, response){
  if(!request.body || !request.body.login_name){
    return response.status(404).send("login name is null.");
  }

  User.find({login_name: request.body.login_name}, function(err, users){
    if (err) {
      return response.status(500).send(err);
    }

    if (users.length === 0 || users[0].password != request.body.password) {
      return response.status(401).send({error:"Invalid username or password"});
    }

    request.session.userId = users[0]._id;
    request.session.first_name = users[0].first_name;
    console.log("user's session has been created.");

    response.status(200).json({"_id":users[0]._id});
  });
});

app.post("/admin/logout", function(request, response){
  if(!request.session.userId){
    response.status(400).send("the user hasn't login");
    return;
  }
  request.session.destroy(function (err) {
    if(err){
      response.status(400).send("fail to destroy user's session");
    }else{
      response.status(200).send("success to destroy user's session");
    }
  });
});

app.get("/admin/me", function(request, response){
  //console.log(request.headers);
  //console.log("session: ", request.session);
  if(!request.session.userId){
    return response.status(200).send({"_id":null, "first_name":null});
  }else{
    return response.status(200).send({"_id":request.session.userId, "first_name":request.session.first_name});
  }
});

const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});
