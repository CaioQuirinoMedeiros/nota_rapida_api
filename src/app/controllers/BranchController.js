const Branch = require("../models/Branch")

class BranchController {
  async store(req, res) {
    const { name } = req.body
    const { user } = req

    try {
      const branch = new Branch({ name, user: user._id })

      await branch.save()

      return res.status(201).send(branch)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível criar a unidade" })
    }
  }

  async index(req, res) {
    const { user } = req

    try {
      await user.populate("branches").execPopulate()

      return res.status(200).send(user.branches)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as unidades" })
    }
  }

  async show(req, res) {
    const { id: _id } = req.params
    const { user } = req
    try {
      const branch = await Branch.findOne({ _id, user: user._id })
        .populate("user", "name")
        .populate("teams")

      if (!branch) {
        return res.status(404).send({ error: "Unidade não encontrada" })
      }

      return res.status(200).send(branch)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as unidades" })
    }
  }

  async update(req, res) {
    const { id: _id } = req.params
    const { name } = req.body
    const { user } = req

    try {
      const branch = await Branch.findOneAndUpdate(
        { _id, user: user._id },
        { name },
        { new: true, runValidators: true }
      )

      if (!branch) {
        return res.status(404).send({ error: "Unidade não encontrada" })
      }

      return res.status(200).send(branch)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível editar a unidade" })
    }
  }

  async destroy(req, res) {
    const { id: _id } = req.params
    const { user } = req

    try {
      const branch = await Branch.findOneAndDelete({ _id, user: user._id })

      if (!branch) {
        return res.status(404).send({ error: "Unidade não encontrada" })
      }

      return res.status(200).send()
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível deletar a unidade" })
    }
  }
}

module.exports = new BranchController()
