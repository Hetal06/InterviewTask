
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TaskSchema = new mongoose.Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'Register' },
  task_name: {
    type: String,
    required: true
  },
});

const TaskTable = mongoose.model("Task", TaskSchema);
module.exports = TaskTable;