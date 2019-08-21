import Template from '../models/Template';

class TemplateController {
  async store(req, res) {
    const { name, sections, categories, subjects, languages } = req.body;

    try {
      const template = await Template.create({
        user: req.user,
        name,
        categories,
        sections,
        subjects,
        languages,
      });

      return res.status(201).send(template);
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao criar o modelo' });
    }
  }

  async index(req, res) {
    try {
      const templates = await Template.find({ user: req.user });

      return res.status(200).send(templates);
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar os modelos' });
    }
  }

  async show(req, res) {
    const { id: _id } = req.params;

    try {
      const template = await Template.findOne({ _id, user: req.user });

      if (!template) {
        return res.status(404).send({ error: 'Modelo não encontrado' });
      }

      return res.status(200).send(template);
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar o modelo' });
    }
  }

  async update(req, res) {
    const { id: _id } = req.params;

    try {
      const template = await Template.findOne({ _id, user: req.user });

      if (!template) {
        return res.status(404).send({ error: 'Modelo não encontrado' });
      }

      await template.customUpdate(req.body);

      return res.status(200).send(template);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ error: 'Erro ao editar o modelo' });
    }
  }

  async destroy(req, res) {
    const { id: _id } = req.params;

    try {
      const template = await Template.findOneAndDelete({ _id, user: req.user });

      if (!template) {
        return res.status(404).send({ error: 'Modelo não encontrado' });
      }

      return res.status(200).send();
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao deletar o modelo' });
    }
  }
}

export default new TemplateController();
