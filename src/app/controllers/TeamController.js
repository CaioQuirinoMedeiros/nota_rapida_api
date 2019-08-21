import Team from '../models/Team';
import Branch from '../models/Branch';

class TeamController {
  async store(req, res) {
    const { name, branch } = req.body;

    try {
      const branchExists = await Branch.findOne({
        _id: branch,
        user: req.user,
      });

      if (!branchExists) {
        return res.status(404).send({ error: 'Unidade não encontrada' });
      }

      const team = await Team.create({
        name,
        branch,
        user: req.user,
      });

      return res.status(201).send(team);
    } catch (err) {
      return res.status(400).send({ error: 'Não foi possível criar a turma' });
    }
  }

  async index(req, res) {
    const { name, branch_id } = req.query;

    try {
      const query = Team.find({ user: req.user });

      if (branch_id) {
        query.find({ branch: branch_id });
      }

      if (name) {
        query.find({ name: { $regex: name, $options: 'i' } });
      }

      const teams = await query.populate('numStudents').exec();

      return res.status(200).send(teams);
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar as turmas' });
    }
  }

  async show(req, res) {
    const { id: _id } = req.params;

    try {
      const team = await Team.findOne({ _id, user: req.user })
        .populate('students', 'name registration')
        .populate('numStudents');

      if (!team) {
        return res.status(404).send({ error: 'Turma não encontrada' });
      }

      return res.status(200).send(team);
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar as turmas' });
    }
  }

  async update(req, res) {
    const { id: _id } = req.params;
    const { branch } = req.body;

    try {
      const team = await Team.findOne({ _id, user: req.user });

      if (!team) {
        return res.status(404).send({ error: 'Turma não encontrada' });
      }

      if (branch) {
        const branchExists = await Branch.findOne({
          _id: branch,
          user: req.user,
        });

        if (!branchExists) {
          return res.status(404).send({ error: 'Unidade não encontrada' });
        }
      }

      await team.customUpdate(req.body);

      return res.status(200).send(team);
    } catch (err) {
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
      return res
        .status(400)
        .send({ error: 'Não foi possível deletar a turma' });
    }
  }
}

export default new TeamController();
