const express = require("express");
const router = new express.Router();
const Branch = require("../models/branch");
const auth = require("../middleware/auth");

router.post("/branches", auth, async (req, res) => {
  const { name, school } = req.body;
  const branch = new Branch({ name, school });

  try {
    await branch.save();

    return res.status(201).send(branch);
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 400)
      .send({ error: "Não foi possível criar a unidade" });
  }
});

router.get("/branches", async (req, res) => {
  try {
    const branches = await Branch.find();

    return res.status(200).send(branches);
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 400)
      .send({ error: "Erro ao buscar as unidades" });
  }
});

router.get("/branches/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const branch = await Branch.findById(id);

    await branch.populate("school").execPopulate();

    return res.status(200).send(branch);
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 400)
      .send({ error: "Erro ao buscar as unidades" });
  }
});

module.exports = router;
