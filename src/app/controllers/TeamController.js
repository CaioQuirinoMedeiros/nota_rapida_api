const Team = require("../models/Team")

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
    const { user } = req

    try {
      await user.populate("branches").execPopulate()
      const teams = await Team.find({ branch: { $in: user.branches } })

      return res.status(200).send(teams)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as turmas" })
    }
  }

  async show(req, res) {
    const { id: _id } = req.params
    const { user } = req

    try {
      await user.populate("branches").execPopulate()
      const team = await Team.findOne({ _id, branch: { $in: user.branches } })
        .populate("branch", "name")
        .populate("students", "name registration")

      if (!team) {
        return res.status(404).send({ error: "Turma não encontrada" })
      }

      return res.status(200).send(team)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as turmas" })
    }
  }

  async update(req, res) {
    const { id: _id } = req.params
    const { name } = req.body
    const { user } = req

    try {
      await user.populate("branches").execPopulate()
      const team = await Team.findOneAndUpdate(
        { _id, branch: { $in: user.branches } },
        { name },
        { new: true, runValidators: true }
      )

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
    const { id: _id } = req.params
    const { user } = req

    try {
      await user.populate("branches").execPopulate()
      const team = await Team.findOneAndDelete({
        _id,
        branch: { $in: user.branches }
      })

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
