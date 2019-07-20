const Test = require("../models/Test")

class TestController {
  async store(req, res) {
    const { student, exam, answers } = req.body
    const test = new Test({ student, exam, answers })

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
    try {
      const tests = await Test.find()

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

      await test
        .populate("student", "name")
        .populate("exam", "name date")
        .execPopulate()

      console.log(test.markeds)
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
