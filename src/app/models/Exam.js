const mongoose = require("mongoose")
const autopopulate = require("mongoose-autopopulate")

const questionSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    category: { type: String, required: true },
    section: { type: String, default: null },
    subject: { type: String, default: null },
    language: { type: String, default: null },
    response: { type: String, default: null },
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 }
  },
  { toJSON: { virtuals: true } }
)

questionSchema.path("category").validate(async function(value) {
  const template = await this.parent().getTemplate()
  const categoriesNames = template.categories.map(category => category.name)

  return categoriesNames.includes(value)
})

questionSchema.path("section").validate(async function(value) {
  if (!value) return true
  const template = await this.parent().getTemplate()
  return template.sections.includes(value)
})

questionSchema.path("subject").validate(async function(value) {
  if (!value) return true
  const template = await this.parent().getTemplate()
  return template.subjects.includes(value)
})

questionSchema.path("language").validate(async function(value) {
  if (!value) return true
  const template = await this.parent().getTemplate()
  return template.languages.includes(value)
})

questionSchema.methods.calculateCorrectValue = async function() {
  const template = await this.parent().getTemplate()
  const { correct, incorrect } = template.categories.find(
    category => category.name === this.category
  )

  this.correct = correct
  this.incorrect = incorrect

  return this
}

questionSchema.pre("save", async function(next) {
  await this.calculateCorrectValue()

  return next()
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

examSchema.methods.getTemplate = async function() {
  await this.populate("template").execPopulate()

  return this.template
}

examSchema.virtual("numQuestions").get(function() {
  if (!this.questions) return

  return this.questions.length
})

examSchema.virtual("tests", {
  ref: "Test",
  localField: "_id",
  foreignField: "exam",
  autopopulate: true
})

examSchema.virtual("numTests", {
  ref: "Test",
  localField: "_id",
  foreignField: "exam",
  count: true,
  autopopulate: true
})

// examSchema.virtual("maximumGrade").get(function() {
//   if (!this.questions || !this.questions.length) return null

//   return this.questions.reduce(
//     (acc, question) => acc + question.value.correct,
//     0
//   )
// })

// examSchema.virtual("minimumGrade").get(function() {
//   if (!this.questions || !this.questions.length) return null

//   return this.questions.reduce(
//     (acc, question) => acc + question.value.incorrect,
//     0
//   )
// })

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
