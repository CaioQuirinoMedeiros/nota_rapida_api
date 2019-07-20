const mongoose = require("mongoose")
const Exam = require("./exam")

const answerSchema = new mongoose.Schema(
  {
    number: Number,
    marked: {
      type: String,
      default: null
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam.questions"
    },
    correct: { type: Boolean, default: null },
    score: { type: Number, default: 0 }
  },
  { toJSON: { virtuals: true } }
)

answerSchema.post("save", async function() {
  const answer = this
  const exam = await Exam.findById(answer.parent().exam).populate("template")

  const question = exam.questions.find(
    question => question.number === answer.number
  )

  if (!question) {
    throw new Error("Não existe essa questão na prova")
  }

  answer.question = question._id

  if (answer.marked) {
    const type = await exam.template.types.find(
      type => type.name === question.category
    )

    answer.correct = answer.marked === question.response
    answer.score = answer.correct ? type.correct : type.incorrect
  }
})

const testSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam"
    },
    answers: [answerSchema],
    grade: Number
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    toJSON: { virtuals: true }
  }
)

testSchema.virtual("markeds").get(function() {
  return this.answers.filter(answer => answer.marked).length
})

testSchema.virtual("unmarkeds").get(function() {
  return this.answers.filter(answer => !answer.marked).length
})

testSchema.virtual("corrects").get(function() {
  return this.answers.filter(answer => answer.correct).length
})

testSchema.virtual("incorrects").get(function() {
  return this.answers.filter(
    answer => typeof answer.correct === "boolean" && !answer.correct
  ).length
})

const Test = mongoose.model("Test", testSchema)

module.exports = Test
