const Test = require("../models/Test")

class TestController {
  async store(req, res) {
    const { student, exam, answers, language } = req.body
    const test = new Test({ student, exam, answers, language })

    try {
      await test.save()

      return res.status(201).send(test)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível criar o cartão" })
    }
  }

  async index(req, res) {
    const { exam } = req.body
    const { user } = req

    try {
      await user.populate("exams").execPopulate()

      if (!user.exams.map(exam => exam.id).includes(exam)) {
        return res.status(403).send({ error: "Essa prova não é sua" })
      }

      const tests = await Test.find({ exam })

      if (!tests) {
        return res.status(404).send({ error: "" })
      }

      return res.status(200).send(tests)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar os cartões" })
    }
  }

  async show(req, res) {
    const { id } = req.params

    try {
      const test = await Test.findById(id)

      if (!test) {
        return res.status(404).send({ error: "Cartão não encontrada" })
      }

      await test.populate("student", "name").execPopulate()

      return res.status(200).send(test)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as provas" })
    }
  }
}

module.exports = new TestController()
