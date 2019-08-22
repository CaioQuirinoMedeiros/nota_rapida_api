import Test from '../models/Test';
import Exam from '../models/Exam';
import Student from '../models/Student';

class TestController {
  async store(req, res) {
    const { student, exam, answers, language } = req.body;
    try {
      const examExists = await Exam.findOne({ _id: exam, user: req.user });

      if (!examExists) {
        return res.status(404).send({ error: 'Prova não encontrada' });
      }

      const template = await examExists.getTemplate();

      if (!template.languages.includes(language)) {
        return res
          .status(404)
          .send({ error: 'Não existe essa opção de língua' });
      }

      const studentExists = await Student.findOne({
        _id: student,
        user: req.user,
      });

      if (!studentExists) {
        return res.status(404).send({ error: 'Aluno não encontrado' });
      }

      const test = await Test.create({
        student,
        exam,
        answers,
        language,
      });

      return res.status(201).send(test);
    } catch (err) {
      return res.status(400).send({ error: 'Não foi possível criar o cartão' });
    }
  }

  async index(req, res) {
    const { exam } = req.body;

    try {
      const examExists = await Exam.findOne({ _id: exam, user: req.user });

      if (!examExists) {
        return res.status(404).send({ error: 'Prova não encontrada' });
      }

      const tests = await Test.find({ exam });

      return res.status(200).send(tests);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ error: 'Erro ao buscar os cartões' });
    }
  }

  async show(req, res) {
    const { id: _id } = req.params;

    try {
      const user = await req.user.populate('exams').execPopulate();

      const test = await Test.findOne({ _id, exam: { $in: user.exams } });

      if (!test) {
        return res.status(404).send({ error: 'Cartão não encontrada' });
      }

      await test.populate('student', 'name').execPopulate();

      return res.status(200).send(test);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 400)
        .send({ error: 'Erro ao buscar as provas' });
    }
  }
}

export default new TestController();
