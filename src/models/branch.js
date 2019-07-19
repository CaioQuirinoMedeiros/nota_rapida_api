const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School"
  }
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
