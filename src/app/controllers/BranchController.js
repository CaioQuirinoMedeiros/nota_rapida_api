const Branch = require("../models/Branch")

class BranchController {
  async store(req, res) {
    const { name, school } = req.body
    const branch = new Branch({ name, school })

    try {
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
    try {
      const branches = await Branch.find()

      return res.status(200).send(branches)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as unidades" })
    }
  }

  async show(req, res) {
    const { id } = req.params
    try {
      const branch = await Branch.findById(id)

      if (!branch) {
        return res.status(404).send({ error: "Unidade não encontrada" })
      }

      await branch.populate("school").execPopulate()

      return res.status(200).send(branch)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as unidades" })
    }
  }
}

module.exports = new BranchController()
