const mongoose = require("mongoose")
const idvalidator = require("mongoose-id-validator")
const autopopulate = require("mongoose-autopopulate")

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { toJSON: { virtuals: true } }
)

branchSchema.virtual("teams", {
  ref: "Team",
  localField: "_id",
  foreignField: "branch"
})

branchSchema.virtual("numTeams", {
  ref: "Team",
  localField: "_id",
  foreignField: "branch",
  count: true,
  autopopulate: true
})

branchSchema.plugin(autopopulate)
branchSchema.plugin(idvalidator)

const Branch = mongoose.model("Branch", branchSchema)

module.exports = Branch
