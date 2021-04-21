
const express = require('express');
const registerModel = require('../models/RegisterModel');
const TaskModel = require('../models/TaskModel');
const { check, validationResult } = require("express-validator/check")
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { request, response } = require('express');
const refreshTokens = [];
const refreshTokenSecret = 'yourrefreshtokensecrethere';

app.post(
  "/register",
  [
    check("first_name", "Please Enter a Valid first name.")
      .not()
      .isEmpty(),
      check("last_name", "Please Enter a Valid last name.")
      .not()
      .isEmpty(),
    check("user_name", "Please enter a valid user name.").not()
    .isEmpty(),
    check("password", "Please enter a password at least 6 character").isLength({
      min: 6
    })
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const {
      first_name,
      last_name,
      user_name,
      password
    } = req.body;
    try {
      let user = await registerModel.findOne({
        user_name
      });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists"
        });
      }

      user = new registerModel({
        first_name,
        last_name,
        user_name,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "randomString", {
        expiresIn: 10000
      },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ data: user, token:token ,message:"User has been successfully created."});
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

app.post(
  "/login",
  [
    check("user_name", "Please enter a valid user name").not()
    .isEmpty(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { user_name, password } = req.body;
    try {
      let user = await registerModel.findOne({
        user_name
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist"
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !"
        });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ data: user, token:token ,message:"User is login successfully."});
        }
      );
      
      console.log("user",user);
      const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);
      console.log("refreshToken",refreshToken);  
      refreshTokens.push(refreshToken);
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

app.post('/logout', async (req, res) => {
  const { token } = req.body;
  res.send("Logout successfully.");
});

app.post('/createTask', async (req, res) => {

 const task = new TaskModel({
    user_id: req.body.user_id,
    task_name: req.body.task_name
  }).populate('user_id','first_name');
  task.save().then(data => {
    res.json({data:data,message:"Task has been successfully created."});
  }).catch(error => {
    res.json(error)
  }).catch(e => { console.log(e) })
})

app.post('/deleteTask/:id', async (req, res) => {
  try {
    const task = await TaskModel.findByIdAndDelete(req.params.id);
    
    if (!task) res.status(404).send("No item found")
    res.status(200).send({message:"Task is deleted."})
  } catch (err) {
    res.status(500).send(err)
  }
})

app.get('/getAlltask', async (req, res) => {
  const taskAll = await TaskModel.find({}).populate('user_id','first_name');

  try {
    res.send(taskAll);
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = app