const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  registration: {
    type: String,
    required: true,
    trim: true
  },
  unique_registration: {
    type: String,
    unique: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  }
})

studentSchema.pre("save", async function(next) {
  const student = this

  student.unique_registration = `${student.team.toString()}.${
    student.registration
  }`

  return next()
})

const Student = mongoose.model("Student", studentSchema)

module.exports = Student
