const mongoose = require("mongoose")
const School = require("./School")

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true
    }
  },
  { toJSON: { virtuals: true } }
)

branchSchema
  .path("school")
  .validate(async value => await School.findById(value))

branchSchema.virtual("teams", {
  ref: "Team",
  localField: "_id",
  foreignField: "branch"
})

const Branch = mongoose.model("Branch", branchSchema)

module.exports = Branch
