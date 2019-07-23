const mongoose = require("mongoose")
const autopopulate = require("mongoose-autopopulate")

const questionSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Template.sections" },
    category: {
      category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template.categories",
        required: true
      },
      name: String,
      correct: Number,
      incorrect: Number
    },
    response: { type: String, default: null }
  },
  { toJSON: { virtuals: true } }
)

questionSchema.pre("save", async function() {
  await this.updateCategory()
})

questionSchema.methods.updateCategory = async function() {
  const exam = await this.parent()
    .populate("template")
    .execPopulate()

  const { name, correct, incorrect } = exam.template.categories.id(
    this.category.category_id
  )

  this.category = { ...this.category, name, correct, incorrect }

  return this
}

questionSchema.virtual("value").get(function() {
  const { parameter } = this.parent()
  const { correct, incorrect } = this.category

  return {
    correct: correct * parameter,
    incorrect: incorrect * parameter
  }
})

questionSchema.virtual("percentages").get(function() {
  const exam = this.parent()

  console.log(exam)

  return "oi"
})

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date
    },
    parameter: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true
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

examSchema.virtual("numQuestions").get(function() {
  if (!this.questions) return

  return this.questions.length
})

examSchema.virtual("tests", {
  ref: "Test",
  localField: "_id",
  foreignField: "exam"
})

examSchema.virtual("numTests", {
  ref: "Test",
  localField: "_id",
  foreignField: "exam",
  count: true,
  autopopulate: true
})

examSchema.virtual("maximumGrade").get(function() {
  if (!this.questions || !this.questions.length) return null

  return this.questions.reduce(
    (acc, question) => acc + question.value.correct,
    0
  )
})

examSchema.virtual("minimumGrade").get(function() {
  if (!this.questions || !this.questions.length) return null

  return this.questions.reduce(
    (acc, question) => acc + question.value.incorrect,
    0
  )
})

examSchema.virtual("mean").get(function() {
  if (!this.tests || !this.tests.length) return null

  return (
    this.tests.reduce((acc, test) => acc + test.grade, 0) / this.tests.length
  )
})

examSchema.pre("save", async function(next) {
  if (this.parameter) return next()

  const sumCorrects = this.questions.reduce(
    (acc, question) => acc + question.category.correct,
    0
  )

  this.parameter = 100 / sumCorrects

  return next()
})

examSchema.post("save", async function() {
  await this.populate("template", "name")

  return this
})

examSchema.methods.customUpdate = async function(updates) {
  const updatesKeys = Object.keys(updates)
  const allowedUpdates = ["name", "date", "parameter", "questions"]
  const isUpdatesValid = updatesKeys.every(update =>
    allowedUpdates.includes(update)
  )

  if (!isUpdatesValid) {
    throw new Error("Parâmetros incorretos para editar a prova")
  }

  updatesKeys.forEach(update => (this[update] = updates[update]))

  await this.save()

  return this
}

examSchema.plugin(autopopulate)

const Exam = mongoose.model("Exam", examSchema)

module.exports = Exam
