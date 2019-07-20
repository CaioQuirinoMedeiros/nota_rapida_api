const Template = require("../models/Template")

class TemplateController {
  async store(req, res) {
    const { name, types } = req.body
    const template = new Template({ name, types })

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
    try {
      const templates = await Template.find()

      return res.status(200).send(templates)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar os modelos" })
    }
  }

  async show(req, res) {
    const { id } = req.params
    try {
      const template = await Template.findById(id)

      if (!template) {
        return res.status(404).send({ error: "MOdelo não encontrado" })
      }

      return res.status(200).send(template)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar os modelos" })
    }
  }
}

module.exports = new TemplateController()
