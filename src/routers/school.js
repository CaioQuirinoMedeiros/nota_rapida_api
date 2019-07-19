const express = require("express");
const router = new express.Router();
const School = require("../models/school");
const auth = require("../middleware/auth");

router.post("/schools", auth, async (req, res) => {
  const { name } = req.body;
  const school = new School({ name });

  try {
    await school.save();

    return res.status(201).send(school);
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 400)
      .send({ error: "Não foi possível criar o colégio" });
  }
});

router.get("/schools", async (req, res) => {
  try {
    const schools = await School.find();

    return res.status(200).send(schools);
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 400)
      .send({ error: "Erro ao buscar os colégios" });
  }
});

router.get("/schools/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const school = await School.findById(id);

    await school.populate("branches").execPopulate();

    return res.status(200).send(school);
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 400)
      .send({ error: "Erro ao buscar as unidades" });
  }
});

module.exports = router;
