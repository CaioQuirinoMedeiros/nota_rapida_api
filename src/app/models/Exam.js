const mongoose = require("mongoose")
const Template = require("./Template")
const autopopulte = require("mongoose-autopopulate")

const questionSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Exam.sections" },
    category: {
      category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam.categories",
        required: true
      },
      name: String,
      correct: Number,
      incorrect: Number
    },
    response: String
  },
  { toJSON: { virtuals: true } }
)

questionSchema.pre("save", async function() {
  const exam = this.parent()
  const template = await exam.getTemplate()
  const { name, correct, incorrect } = template.categories.id(
    this.category.category_id
  )

  this.category = { ...this.category, name, correct, incorrect }
})

questionSchema.virtual("value").get(function() {
  const { parameter } = this.parent()
  const { category } = this

  return {
    correct: category.correct * parameter,
    incorrect: category.incorrect * parameter
  }
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
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true,
      autopopulate: true
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

examSchema.plugin(autopopulte)

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

examSchema.methods.getTemplate = async function() {
  const template = await Template.findById(this.template)

  return template
}

examSchema.pre("save", async function(next) {
  if (this.parameter) return next()

  const sumCorrects = this.questions.reduce(
    (acc, question) => acc + question.category.correct,
    0
  )

  this.parameter = 100 / sumCorrects
})

const Exam = mongoose.model("Exam", examSchema)

module.exports = Exam
