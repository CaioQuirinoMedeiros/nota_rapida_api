import Exam from '../models/Exam';
import Template from '../models/Template';

class ExamController {
  async store(req, res) {
    const { name, date, parameter, template, questions } = req.body;

    try {
      const templateExists = await Template.findOne({
        _id: template,
        user: req.user,
      });

      if (!templateExists) {
        return res.status(404).send({ error: 'Modelo não encontrado' });
      }

      const exam = await Exam.create({
        user: req.user,
        name,
        date,
        parameter,
        template,
        questions,
      });

      await exam
        .populate('template', 'name')
        .populate('user', 'name')
        .execPopulate();

      return res.status(201).send(exam);
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao criar a prova' });
    }
  }

  async index(req, res) {
    try {
      const exams = await Exam.find({ user: req.user }).populate('numTests');

      return res.status(200).send(exams);
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar as provas' });
    }
  }

  async show(req, res) {
    const { id: _id } = req.params;

    try {
      const exam = await Exam.findOne({ _id, user: req.user }).populate(
        'tests'
      );

      if (!exam) {
        return res.status(404).send({ error: 'Prova não encontrada' });
      }

      await exam
        .populate('template', 'name')
        .populate('tests')
        .execPopulate();

      return res.status(200).send(exam);
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao buscar a prova' });
    }
  }

  async update(req, res) {
    const { id: _id } = req.params;

    try {
      const exam = await Exam.findOne({ _id, user: req.user });

      if (!exam) {
        return res.status(404).send({ error: 'Prova não encontrada' });
      }

      await exam.customUpdate(req.body);

      await exam.populate('tests').execPopulate();

      return res.status(200).send(exam);
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao editar a prova' });
    }
  }

  async destroy(req, res) {
    const { id: _id } = req.params;

    try {
      const exam = await Exam.findOneAndDelete({ _id, user: req.user });

      if (!exam) {
        return res.status(404).send({ error: 'Prova não encontrada' });
      }

      return res.status(200).send();
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao deletar a prova' });
    }
  }
}

export default new ExamController();
