const mongoose = require("mongoose")
const idvalidator = require("mongoose-id-validator")
const autopopulate = require("mongoose-autopopulate")

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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  }
})

studentSchema.virtual("tests", {
  ref: "Test",
  localField: "_id",
  foreignField: "student"
})

studentSchema.virtual("numTests", {
  ref: "Test",
  localField: "_id",
  foreignField: "student",
  count: true,
  autopopulate: true
})

studentSchema.methods.customUpdate = async function(updates) {
  const updatesKeys = Object.keys(updates)
  const allowedUpdates = ["name", "registration", "team"]
  const isUpdatesValid = updatesKeys.every(update =>
    allowedUpdates.includes(update)
  )

  if (!isUpdatesValid) {
    throw new Error("Parâmetros incorretos para editar o aluno")
  }

  updatesKeys.forEach(update => (this[update] = updates[update]))

  await this.save()

  return this
}

studentSchema.pre("save", async function(next) {
  await this.populate("team").execPopulate()

  this.unique_registration = `${this.team.branch.toString()}.${
    this.registration
  }`

  return next()
})

studentSchema.methods.toJSON = function() {
  const student = this.toObject({ virtuals: true })

  delete student.user

  return student
}

studentSchema.plugin(autopopulate)
studentSchema.plugin(idvalidator)

const Student = mongoose.model("Student", studentSchema)

module.exports = Student
