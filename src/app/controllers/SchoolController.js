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
        console.log("OPA")
        return res.status(404).send({ error: "Colégio não encontrado" })
      }

      await school
        .populate("branches")
        .populate("exams", "name date")
        .execPopulate()

      return res.status(200).send(school)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar o colégio" })
    }
  }

  async update(req, res) {
    const { id } = req.params
    const { name } = req.body

    try {
      const school = await School.findByIdAndUpdate(id, { name }, { new: true })

      return res.status(200).send(school)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível editar a escola" })
    }
  }

  async destroy(req, res) {
    const { id } = req.params

    try {
      await School.findByIdAndDelete(id)

      return res.status(200).send()
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível deletar o colégio" })
    }
  }
}

module.exports = new SchoolController()
