const mongoose = require("mongoose")
const idvalidator = require("mongoose-id-validator")
const autopopulate = require("mongoose-autopopulate")

const teamSchema = new mongoose.Schema(
  {
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
  },
  { toJSON: { virtuals: true } }
)

teamSchema.virtual("students", {
  ref: "Student",
  localField: "_id",
  foreignField: "team"
})

teamSchema.virtual("numStudents", {
  ref: "Student",
  localField: "_id",
  foreignField: "team",
  count: true,
  autopopulate: true
})

teamSchema.plugin(autopopulate)
teamSchema.plugin(idvalidator)

const Team = mongoose.model("Team", teamSchema)

module.exports = Team
