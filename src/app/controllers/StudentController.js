const Student = require("../models/Student");

class StudentController {
  async store(req, res) {
    const { name, registration, team } = req.body;
    const student = new Student({ name, registration, team });
    try {
      await student.save();

      return res.status(201).send(student);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível criar o aluno" });
    }
  }

  async index(req, res) {
    try {
      const students = await Student.find().populate("team");

      return res.status(200).send(students);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar os alunos" });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const student = await Student.findById(id);

      await student
        .populate({
          path: "team",
          populate: { path: "branch", populate: "school" }
        })
        .execPopulate();

      return res.status(200).send(student);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível buscar o aluno" });
    }
  }
}

module.exports = new StudentController();
