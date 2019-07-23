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
    const { user } = req
    try {
      const exams = await Exam.find({ user: user._id }).populate("tests")

      return res.status(200).send(exams)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as provas" })
    }
  }

  async show(req, res) {
    const { id: _id } = req.params
    const { user } = req

    try {
      const exam = await Exam.findOne({ _id, user: user._id })

      if (!exam) {
        return res.status(404).send({ error: "Prova não encontrada" })
      }

      await exam
        .populate("template", "name")
        .populate("tests")
        .execPopulate()

      return res.status(200).send(exam)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar a prova" })
    }
  }

  async update(req, res) {
    const { id: _id } = req.params
    const updates = req.body
    const { user } = req

    try {
      const exam = await Exam.findOne({ _id, user: user._id })

      if (!exam) {
        return res.status(404).send({ error: "Prova não encontrada" })
      }

      await exam.customUpdate(updates)

      await exam.populate("tests").execPopulate()

      return res.status(200).send(exam)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao editar a prova" })
    }
  }

  async destroy(req, res) {
    const { id: _id } = req.params
    const { user } = req

    try {
      const exam = await Exam.findOneAndDelete({ _id, user: user._id })

      if (!exam) {
        return res.status(404).send({ error: "Prova não encontrada" })
      }

      return res.status(200).send()
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao deletar a prova" })
    }
  }
}

module.exports = new ExamController()
