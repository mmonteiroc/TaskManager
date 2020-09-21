const express = require("express");
const app = express();

const { mongoose } = require("./db/mongoose");

const bodyParser = require("body-parser");

/* MIDDLEWARE  */

// Load middleware
app.use(bodyParser.json());

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");


  next();
});

// Load mongoose models

const { List, Task } = require("./db/models");
/**
 * Routes handlers
 */

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get("/lists", (req, res) => {
  // Return array of all the lists in the database
  List.find({}).then((lists) => {
    res.send(lists);
  });
});

/**
 * POST /lists
 * Purpose: Add new List
 */
app.post("/lists", (req, res) => {
  // Create new List and return the new List document back (includes the ID)
  // The list information will be past via JSON REQ BODY

  let title = req.body.title;
  let newList = new List({
    title,
  });
  newList.save().then((listDoc) => {
    // the full list document is returned (incl. id)
    res.send(listDoc);
  });
});

/**
 * PATCH /lists
 * Purpose: Update List
 */
app.patch("/lists/:id", (req, res) => {
  // We want to update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
  List.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.sendStatus(200);
  });
});

/**
 * DELETE /lists
 * Purpose: Delete List
 */
app.delete("/lists/:id", (req, res) => {
  // delete specified list
  List.findOneAndRemove({ _id: req.params.id }).then((removedListDoc) => {
    res.send(removedListDoc);
  });
});

/**
 * GET /lists/:listId/tasks
 * Purpose: Get tasks from one specific list
 */
app.get("/lists/:listId/tasks", (req, res) => {
  // return tasks of the list

  Task.find({
    _listId: req.params.listId,
  }).then((tasks) => {
    res.send(tasks);
  });
});

app.get("/lists/:listId/tasks/:taskId", (req, res) => {
  // return tasks of the list

  Task.findOne({
    _id: req.params.taskId,
    _listId: req.params.listId,
  }).then((task) => {
    res.send(task);
  });
});


/**
 * Post /lists/:listId/tasks
 * Purpose: add task to one specific list
 */
app.post("/lists/:listId/tasks", (req, res) => {
  // create new task

  let newTask = new Task({
    title: req.body.title,
    _listId: req.params.listId,
  });
  newTask.save().then((task) => {
    res.send(task);
  });
});

/**
 *
 * Patch /lists/:listId/tasks/:taskId
 * Purpose: modify task to one specific list
 */
app.patch("/lists/:listId/tasks/:taskId", (req, res) => {
  // create new task

  Task.findOneAndUpdate(
    {
      _id: req.params.taskId,
      _listId: req.params.listId,
    },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({
      message: "Updated successfully"
    });
  });
});

/**
 *
 * Delete /lists/:listId/tasks/:taskId
 * Purpose: delete task to one specific list
 */
app.delete("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findByIdAndRemove({
    _id: req.params.taskId,
    _listId: req.params._listId
  }).then(removed=>{
    res.send(removed)
  })
});



app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
