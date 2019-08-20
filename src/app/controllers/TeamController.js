import Team from '../models/Team';
import Branch from '../models/Branch';

class TeamController {
  async store(req, res) {
    const { name, branch_id } = req.body;

    try {
      const branch = await Branch.findOne({
        _id: branch_id,
        user: req.user._id,
      });

      if (!branch) {
        return res.status(404).send({ error: 'Unidade não encontrada' });
      }

      const team = await Team.create({
        name,
        branch: branch_id,
        user: req.user._id,
      });

      return res.status(201).send(team);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ error: 'Não foi possível criar a turma' });
    }
  }

  async index(req, res) {
    try {
      const teams = await Team.find({ user: req.user._id });

      return res.status(200).send(teams);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ error: 'Erro ao buscar as turmas' });
    }
  }

  async show(req, res) {
    const { id: _id } = req.params;

    try {
      const team = await Team.findOne({ _id, user: req.user._id }).populate(
        'students',
        'name registration'
      );

      if (!team) {
        return res.status(404).send({ error: 'Turma não encontrada' });
      }

      return res.status(200).send(team);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ error: 'Erro ao buscar as turmas' });
    }
  }

  async update(req, res) {
    const { id: _id } = req.params;
    const { name, branch_id } = req.body;

    try {
      const team = await Team.findOneAndUpdate(
        { _id, user: req.user._id },
        { name, branch: branch_id },
        { new: true, runValidators: true }
      );

      if (!team) {
        return res.status(404).send({ error: 'Turma não encontrada' });
      }

      return res.status(200).send(team);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ error: 'Não foi possível editar a turma' });
    }
  }

  async destroy(req, res) {
    const { id: _id } = req.params;

    try {
      const team = await Team.findOneAndDelete({ _id, user: req.user._id });

      if (!team) {
        return res.status(404).send({ error: 'Turma não encontrada' });
      }

      return res.status(200).send(team);
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .send({ error: 'Não foi possível deletar a turma' });
    }
  }
}

export default new TeamController();
