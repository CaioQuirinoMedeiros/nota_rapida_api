const mongoose = require("mongoose")
const idvalidator = require("mongoose-id-validator")
const autopopulate = require("mongoose-autopopulate")

const studentSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    toJSON: { virtuals: true }
  }
)

studentSchema.virtual("tests", {
  ref: "Test",
  localField: "_id",
  foreignField: "student"
})

studentSchema.virtual("numTests", {
  ref: "Test",
  localField: "_id",
  foreignField: "student",
  count: true
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

studentSchema.methods.getBranch = async function() {
  await this.populate({ path: "team", populate: "branch" }).execPopulate()

  return this.team.branch
}

studentSchema.methods.updateUniqueRegistration = async function() {
  const branch = await this.getBranch()

  this.unique_registration = `${branch.id}.${this.registration}`

  return this
}

studentSchema.pre("save", async function(next) {
  await this.updateUniqueRegistration()
  return next()
})

studentSchema.plugin(idvalidator)

const Student = mongoose.model("Student", studentSchema)

module.exports = Student
