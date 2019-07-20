const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  category: String,
  response: String
})

const examSchema = new mongoose.Schema(
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
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true
    },
    date: {
      type: Date
    },
    questions: [questionSchema]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    toJSON: { virtuals: true }
  }
)

examSchema.virtual("tests", {
  ref: "Test",
  localField: "_id",
  foreignField: "exam"
})

examSchema.virtual("numTests", {
  ref: "Test",
  localField: "_id",
  foreignField: "exam",
  count: true
})

const Exam = mongoose.model("Exam", examSchema)

module.exports = Exam
