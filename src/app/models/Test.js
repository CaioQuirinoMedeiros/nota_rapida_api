const mongoose = require("mongoose")
const autopopulate = require("mongoose-autopopulate")

const answerSchema = new mongoose.Schema(
  {
    question: { type: Number, required: true },
    marked: { type: String, default: null },
    correct: { type: Boolean, default: null },
    invalid: { type: Boolean, default: null },
    score: { type: Number, default: 0 }
  },
  { toJSON: { virtuals: true } }
)

answerSchema.methods.findQuestion = async function() {
  const exam = await this.parent().getExam()
  const language = this.parent().language
  const question = exam.questions.find(question => {
    matchNumber = question.number === this.question

    return matchNumber
      ? question.language
        ? question.language === language
        : true
      : false
  })

  return question
}

answerSchema.path("question").validate(async function(value) {
  let exam = await this.parent().getExam()
  exam = exam.toObject()

  const question = exam.questions.find(question => question.number === value)

  return !!question
})

answerSchema.methods.correctQuestion = async function() {
  if (!this.marked) return this

  const question = await this.findQuestion()

  if (!question) {
    this.invalid = true
    return this
  }

  if (!question.response) {
    this.score === question.correct
    return this
  }

  if (this.marked.includes("|")) {
    this.invalid = true
    return this
  }

  this.correct = this.marked === question.response
  this.score = this.correct ? question.correct : question.incorrect

  return this
}

answerSchema.pre("save", async function() {
  await this.correctQuestion()
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
    language: { type: String, default: null },
    answers: { type: [answerSchema], required: true },
    grade: { type: Number, default: null }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    toJSON: { virtuals: true }
  }
)

testSchema.methods.getExam = async function() {
  await this.populate("exam").execPopulate()

  return this.exam
}

testSchema.pre("save", async function() {
  await this.calculateGrade()
})

testSchema.methods.calculateGrade = async function() {
  this.grade = this.answers.reduce((acc, answer) => acc + answer.score, 0)

  return this
}

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
