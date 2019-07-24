const Student = require("../models/Student")

class StudentController {
  async store(req, res) {
    const { name, registration, team } = req.body
    const { user } = req

    try {
      const student = new Student({ name, registration, team, user: user._id })

      await student.save()

      return res.status(201).send(student)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível criar o aluno" })
    }
  }

  async index(req, res) {
    const { user } = req

    try {
      const students = await Student.find({ user }).populate({
        path: "team",
        select: "name",
        populate: { path: "branch", select: "name" }
      })

      return res.status(200).send(students)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar os alunos" })
    }
  }

  async show(req, res) {
    const { id: _id } = req.params
    const { user } = req

    try {
      const student = await Student.findOne({ _id, user: user._id })
        .populate({
          path: "team",
          select: "name",
          populate: { path: "branch", select: "name" }
        })
        .populate("tests")

      if (!student) {
        return res.status(404).send({ error: "Aluno não encontrado" })
      }

      return res.status(200).send(student)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível buscar o aluno" })
    }
  }

  async update(req, res) {
    const { id: _id } = req.params
    const { user } = req
    const updates = req.body

    try {
      const student = await Student.findOne({ _id, user: user._id })

      if (!student) {
        return res.status(404).send({ error: "Aluno não encontrado" })
      }

      await student.customUpdate(updates)

      return res.status(200).send(student)
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível editar o aluno" })
    }
  }

  async destroy(req, res) {
    const { id: _id } = req.params
    const { user } = req

    try {
      const student = await Student.findOneAndDelete({ _id, user: user._id })

      if (!student) {
        return res.status(404).send({ error: "Aluno não encontrado" })
      }

      return res.status(200).send()
    } catch (err) {
      console.log(err)
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível deletar o aluno" })
    }
  }
}

module.exports = new StudentController()
