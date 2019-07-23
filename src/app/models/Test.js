const mongoose = require("mongoose")
const autopopulate = require("mongoose-autopopulate")

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
  const test = await this.parent()
    .populate("exam")
    .execPopulate()

  const question = test.exam.questions.id(this.question)

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
      ref: "Exam"
    },
    answers: [answerSchema],
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

testSchema.plugin(autopopulate)

const Test = mongoose.model("Test", testSchema)

module.exports = Test
