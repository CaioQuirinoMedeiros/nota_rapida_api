import Branch from '../models/Branch';

class BranchController {
  async store(req, res) {
    const { name } = req.body;

    try {
      const branch = await Branch.create({ name, user: req.user });

      return res.status(201).send(branch);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ error: 'Erro ao criar a unidade' });
    }
  }

  async index(req, res) {
    try {
      const branches = await Branch.find({ user: req.user }).populate(
        'numTeams'
      );

      return res.status(200).send(branches);
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar as unidades' });
    }
  }

  async show(req, res) {
    const { id: _id } = req.params;

    try {
      const branch = await Branch.findOne({ _id, user: req.user })
        .populate('teams')
        .populate('numTeams');

      if (!branch) {
        return res.status(404).send({ error: 'Unidade não encontrada' });
      }

      return res.status(200).send(branch);
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar as unidades' });
    }
  }

  async update(req, res) {
    const { id: _id } = req.params;
    const { name } = req.body;

    try {
      const branch = await Branch.findOneAndUpdate(
        { _id, user: req.user },
        { name },
        { new: true, runValidators: true }
      );

      if (!branch) {
        return res.status(404).send({ error: 'Unidade não encontrada' });
      }

      return res.status(200).send(branch);
    } catch (err) {
      return res
        .status(400)
        .send({ error: 'Não foi possível editar a unidade' });
    }
  }

  async destroy(req, res) {
    const { id: _id } = req.params;

    try {
      const branch = await Branch.findOneAndDelete({ _id, user: req.user });

      if (!branch) {
        return res.status(404).send({ error: 'Unidade não encontrada' });
      }

      return res.status(200).send(branch);
    } catch (err) {
      return res
        .status(400)
        .send({ error: 'Não foi possível deletar a unidade' });
    }
  }
}

export default new BranchController();
