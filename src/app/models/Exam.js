const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
  number: Number,
  category: {
    type: String,
    enum: ["A", "B", "C", "D"]
  },
  value: Number,
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
    date: {
      type: Date
    },
    questions: [questionSchema]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
)

const Exam = mongoose.model("Exam", examSchema)

module.exports = Exam
