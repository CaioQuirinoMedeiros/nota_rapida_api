const School = require("../models/School")

class SchoolController {
  async store(req, res) {
    const { name } = req.body
    const school = new School({ name })

    try {
      await school.save()

      return res.status(201).send(school)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível criar o colégio" })
    }
  }

  async index(req, res) {
    try {
      const schools = await School.find()

      return res.status(200).send(schools)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar os colégios" })
    }
  }
  async show(req, res) {
    const { id } = req.params
    try {
      const school = await School.findById(id)

      if (!school) {
        return res.status(404).send({ error: "Colégio não encontrado" })
      }

      await school.populate("branches").execPopulate()

      return res.status(200).send(school)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as unidades" })
    }
  }
}

module.exports = new SchoolController()
