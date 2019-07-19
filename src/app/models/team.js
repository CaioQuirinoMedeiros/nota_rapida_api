const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch"
  }
})

const Team = mongoose.model("Team", teamSchema)

module.exports = Team
