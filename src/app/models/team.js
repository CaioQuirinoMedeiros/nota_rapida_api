const mongoose = require("mongoose")
const Branch = require("./Branch")

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true
  }
})

teamSchema.path("branch").validate(async value => await Branch.findById(value))

teamSchema.virtual("students", {
  ref: "Student",
  localField: "_id",
  foreignField: "team"
})

const Team = mongoose.model("Team", teamSchema)

module.exports = Team
