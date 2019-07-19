const express = require("express");
const router = new express.Router();
const Team = require("../models/team");
const auth = require("../middleware/auth");

router.post("/teams", auth, async (req, res) => {
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
});

router.get("/teams", async (req, res) => {
  try {
    const teams = await Team.find();

    return res.status(200).send(teams);
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 400)
      .send({ error: "Erro ao buscar as turmas" });
  }
});

router.get("/teams/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const team = await Team.findById(id);

    await team.populate({ path: "branch", populate: "school" }).execPopulate();

    return res.status(200).send(team);
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 400)
      .send({ error: "Erro ao buscar as turmas" });
  }
});

module.exports = router;
