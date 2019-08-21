import Student from '../models/Student';
import Team from '../models/Team';

class StudentController {
  async store(req, res) {
    const { name, registration, team } = req.body;
    const { user } = req;

    try {
      const teamExists = await Team.findOne({ _id: team, user: req.user._id });

      if (!teamExists) {
        return res.status(404).send({ error: 'Turma não encontrada' });
      }

      const student = await Student.create({
        name,
        registration,
        team,
        user: user._id,
      });

      return res.status(201).send(student);
    } catch (err) {
      return res.status(400).send({ error: 'Não foi possível criar o aluno' });
    }
  }

  async index(req, res) {
    const { search } = req.query;
    const { teams } = req.body;

    try {
      const query = Student.find({ user: req.user });

      if (search) {
        query.find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { registration: { $regex: search, $options: 'i' } },
          ],
        });
      }

      if (teams) {
        query.find({ team: { $in: teams } });
      }

      const students = await query.populate('numTests').exec();

      return res.status(200).send(students);
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar os alunos' });
    }
  }

  async show(req, res) {
    const { id: _id } = req.params;

    try {
      const student = await Student.findOne({ _id, user: req.user })
        .populate('team', 'name')
        .populate('tests');

      if (!student) {
        return res.status(404).send({ error: 'Aluno não encontrado' });
      }

      return res.status(200).send(student);
    } catch (err) {
      return res.status(400).send({ error: 'Não foi possível buscar o aluno' });
    }
  }

  async update(req, res) {
    const { id: _id } = req.params;
    const { team } = req.body;

    try {
      const student = await Student.findOne({ _id, user: req.user });

      if (!student) {
        return res.status(404).send({ error: 'Aluno não encontrado' });
      }

      if (team) {
        const teamExists = await Team.findOne({
          _id: team,
          user: req.user._id,
        });

        if (!teamExists) {
          return res.status(404).send({ error: 'Turma não encontrada' });
        }
      }

      await student.customUpdate(req.body);

      return res.status(200).send(student);
    } catch (err) {
      return res.status(400).send({ error: 'Não foi possível editar o aluno' });
    }
  }

  async destroy(req, res) {
    const { id: _id } = req.params;

    try {
      const student = await Student.findOneAndDelete({ _id, user: req.user });

      if (!student) {
        return res.status(404).send({ error: 'Aluno não encontrado' });
      }

      return res.status(200).send();
    } catch (err) {
      return res
        .status(400)
        .send({ error: 'Não foi possível deletar o aluno' });
    }
  }
}

export default new StudentController();
