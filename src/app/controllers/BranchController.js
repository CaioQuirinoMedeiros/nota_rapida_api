const Branch = require("../models/Branch")
const School = require("../models/School")

class BranchController {
  async store(req, res) {
    const { name, school } = req.body

    try {
      const branch = new Branch({ name, school })

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
    const { school: id } = req.body

    try {
      const school = await School.findById(id).populate("branches")

      if (!school) {
        return res.status(404).send({ error: "Colégio não encontrado" })
      }

      return res.status(200).send(school.branches)
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
        .populate("school")
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
    const { id } = req.params
    const { name } = req.body

    try {
      const branch = await Branch.findByIdAndUpdate(id, { name }, { new: true })

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
    const { id } = req.params

    try {
      const branch = await Branch.findByIdAndDelete(id)

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
