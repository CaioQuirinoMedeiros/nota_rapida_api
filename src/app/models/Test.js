const mongoose = require("mongoose")
const Exam = require("./exam")

const answerSchema = new mongoose.Schema({
  number: Number,
  marked: {
    type: String,
    default: null
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam.questions"
  },
  grade: { type: Number, default: 0 }
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
    }
  }
)

testSchema.pre("save", async function(next) {
  const test = this

  const exam = await Exam.findById(test.exam).populate("template")

  await Promise.all(
    test.answers.map(async answer => {
      const question = await exam.questions.find(
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

        answer.grade =
          answer.marked === question.response ? type.correct : type.incorrect
      }
    })
  )

  const nota = test.answers.reduce((grade, answer) => grade + answer.grade, 0)
  test.grade = nota
})

const Test = mongoose.model("Test", testSchema)

module.exports = Test
