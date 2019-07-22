const Exam = require("../models/exam")

class ExamController {
  async store(req, res) {
    const { name, date, parameter, template, questions } = req.body
    const { user } = req

    const exam = new Exam({
      name,
      date,
      parameter,
      user,
      template,
      questions
    })

    try {
      await exam.save()

      return res.status(201).send(exam)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível criar a prova" })
    }
  }

  async index(req, res) {
    try {
      const exams = await Exam.find()

      return res.status(200).send(exams)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as provas" })
    }
  }

  async show(req, res) {
    const { id } = req.params
    try {
      const exam = await Exam.findById(id)

      if (!exam) {
        return res.status(404).send({ error: "Prova não encontrada" })
      }

      await exam
        .populate("user", "name")
        .populate("template", "name")
        .populate("tests")
        .populate("numTests")
        .execPopulate()

      return res.status(200).send(exam)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as provas" })
    }
  }
}

module.exports = new ExamController()
