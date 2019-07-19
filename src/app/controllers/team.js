const Team = require("../app/models/team");

class TeamController {
  async store(req, res) {
    const { name, branch } = req.body;
    const team = new Team({ name, branch });

    try {
      await team.save();

      return res.status(201).send(team);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 400)
        .send({ error: "Não foi possível criar a turma" });
    }
  }

  async index(req, res) {
    try {
      const teams = await Team.find();

      return res.status(200).send(teams);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as turmas" });
    }
  }
  async show(req, res) {
    const { id } = req.params;
    try {
      const team = await Team.findById(id);

      await team
        .populate({ path: "branch", populate: "school" })
        .execPopulate();

      return res.status(200).send(team);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 400)
        .send({ error: "Erro ao buscar as turmas" });
    }
  }
}

module.exports = new TeamController();
