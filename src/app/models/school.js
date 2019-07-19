const mongoose = require("mongoose")

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    }
  },
  { toJSON: { virtuals: true } }
)

schoolSchema.virtual("branches", {
  ref: "Branch",
  localField: "_id",
  foreignField: "school"
})

schoolSchema.virtual("tests", {
  ref: "Test",
  localField: "_id",
  foreignField: "school"
})

const School = mongoose.model("School", schoolSchema)

module.exports = School
