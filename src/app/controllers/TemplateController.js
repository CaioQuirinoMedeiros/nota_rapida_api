const Template = require("../models/Template")

class TemplateController {
  async store(req, res) {
    const { name, sections, categories } = req.body
    const { user } = req

    const template = new Template({
      name,
      user: user._id,
      sections,
      categories
    })

    try {
      await template.save()

      return res.status(201).send(template)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível criar o modelol" })
    }
  }

  async index(req, res) {
    const { user } = req

    try {
      const templates = await Template.find({ user: user._id })

      return res.status(200).send(templates)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar os modelos" })
    }
  }

  async show(req, res) {
    const { id: _id } = req.params
    const { user } = req

    try {
      const template = await Template.findOne({ _id, user: user._id })

      if (!template) {
        return res.status(404).send({ error: "Modelo não encontrado" })
      }

      return res.status(200).send(template)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar os modelos" })
    }
  }

  async update(req, res) {
    const { id: _id } = req.params
    const { name } = req.body
    const { user } = req

    try {
      const template = await Template.findOneAndUpdate(
        { _id, user: user._id },
        { name },
        { new: true, runValidators: true }
      )

      if (!template) {
        return res.status(404).send({ error: "Modelo não encontrado" })
      }

      return res.status(200).send(template)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível editar o modelo" })
    }
  }

  async destroy(req, res) {
    const { id: _id } = req.params
    const { user } = req

    try {
      const template = await Template.findOneAndDelete({ _id, user: user._id })

      if (!template) {
        return res.status(404).send({ error: "Modelo não encontrado" })
      }

      return res.status(200).send()
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível deletar o modelo" })
    }
  }
}

module.exports = new TemplateController()
