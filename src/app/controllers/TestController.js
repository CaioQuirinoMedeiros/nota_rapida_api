const Test = require("../models/test")

class TestController {
  async store(req, res) {
    const { name, school, date, questions } = req.body
    const test = new Test({ name, school, date, questions })

    try {
      await test.save()

      return res.status(201).send(test)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível criar a prova" })
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
        .send({ error: "Erro ao buscar as provas" })
    }
  }
  async show(req, res) {
    const { id } = req.params
    try {
      const test = await Test.findById(id)

      if (!test) {
        return res.status(404).send({ error: "Prova não encontrada" })
      }

      await test.populate("school").execPopulate()

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
