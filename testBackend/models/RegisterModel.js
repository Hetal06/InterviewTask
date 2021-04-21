
const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  user_name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  }
});

const Register = mongoose.model("Register", RegisterSchema);
module.exports = Register;