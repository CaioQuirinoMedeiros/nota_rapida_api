const Team = require("../models/Team")
const Branch = require("../models/Branch")

class TeamController {
  async store(req, res) {
    const { name, branch } = req.body
    const team = new Team({ name, branch })

    try {
      await team.save()

      return res.status(201).send(team)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível criar a turma" })
    }
  }

  async index(req, res) {
    const { school } = req.body
    try {
      const branches = await Branch.find({ school })
      console.log(branches)
      const teams = await Team.find({ branch: { $in: branches } })

      return res.status(200).send(teams)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as turmas" })
    }
  }

  async show(req, res) {
    const { id } = req.params
    try {
      const team = await Team.findById(id)

      if (!team) {
        return res.status(404).send({ error: "Turma não encontrada" })
      }

      await team.populate({ path: "branch", populate: "school" }).execPopulate()

      return res.status(200).send(team)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as turmas" })
    }
  }

  async update(req, res) {
    const { id } = req.params
    const { name } = req.body

    try {
      const team = await Team.findByIdAndUpdate(id, { name }, { new: true })

      if (!team) {
        return res.status(404).send({ error: "Turma não encontrada" })
      }

      return res.status(200).send(team)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível editar a turma" })
    }
  }

  async destroy(req, res) {
    const { id } = req.params

    try {
      const team = await Team.findByIdAndDelete(id)

      if (!team) {
        return res.status(404).send({ error: "Turma não encontrada" })
      }

      return res.status(200).send()
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível deletar a turma" })
    }
  }
}

module.exports = new TeamController()
