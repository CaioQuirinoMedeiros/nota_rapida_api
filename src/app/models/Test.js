const mongoose = require("mongoose")
const autopopulate = require("mongoose-autopopulate")
const Exam = require("./exam")

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam.questions",
      required: true
    },
    marked: {
      type: String,
      default: null
    },
    correct: { type: Boolean, default: null },
    invalid: { type: Boolean, default: null },
    score: { type: Number, default: 0 }
  },
  { toJSON: { virtuals: true } }
)

answerSchema.pre("save", async function() {
  const test = this.parent()
  const exam = await test.getExam()

  const question = exam.questions.id(this.question)

  if (!question) {
    throw new Error("Não existe essa questão na prova")
  }

  if (this.marked) {
    if (this.marked.includes("|")) {
      this.invalid = true
    } else {
      this.correct = this.marked === question.response
      this.score = this.correct
        ? question.value.correct
        : question.value.incorrect
    }
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
      ref: "Exam",
      autopopulate: true
    },
    answers: [answerSchema]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    toJSON: { virtuals: true }
  }
)

testSchema.plugin(autopopulate)

testSchema.methods.getExam = async function() {
  const exam = await Exam.findById(this.exam)

  return exam
}

testSchema.virtual("grade").get(function() {
  const grade = this.answers.reduce((acc, answer) => acc + answer.score, 0)

  return grade
})

testSchema.virtual("markeds").get(function() {
  const quantity = this.answers.filter(answer => answer.marked).length
  const percentage = quantity / this.answers.length

  return {
    quantity,
    percentage
  }
})

testSchema.virtual("unmarkeds").get(function() {
  const quantity = this.answers.filter(answer => !answer.marked).length
  const percentage = quantity / this.answers.length

  return {
    quantity,
    percentage
  }
})

testSchema.virtual("corrects").get(function() {
  const quantity = this.answers.filter(answer => answer.correct).length
  const percentage = quantity / this.markeds.quantity

  return {
    quantity,
    percentage
  }
})

testSchema.virtual("incorrects").get(function() {
  const quantity = this.answers.filter(
    answer => typeof answer.correct === "boolean" && !answer.correct
  ).length
  const percentage = quantity / this.markeds.quantity

  return {
    quantity,
    percentage
  }
})

testSchema.virtual("invalids").get(function() {
  const quantity = this.answers.filter(answer => answer.invalid).length
  const percentage = quantity / this.markeds.quantity

  return {
    quantity,
    percentage
  }
})

const Test = mongoose.model("Test", testSchema)

module.exports = Test
