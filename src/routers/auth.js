const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

router.post("/register", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    const token = await user.generateAuthToken();

    return res.status(201).send({ user, token });
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 400)
      .send({ error: "Não foi possível criar o cadastro" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);

    const token = await user.generateAuthToken();

    return res.status(200).send({ user, token });
  } catch (err) {
    console.log(err);
    return res.status(err.status || 400).send({ error: "Erro ao fazer login" });
  }
});

router.post("/logout", auth, async (req, res) => {
  const { token: activeToken, user } = req;

  try {
    user.tokens = user.tokens.filter(token => token.token !== activeToken);

    await user.save();

    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 400)
      .send({ error: "Não foi possível fazer logout" });
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  const { user } = req;

  try {
    user.tokens = [];

    await user.save();

    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 400)
      .send({ error: "Não foi possível fazer logout de todos os acessos" });
  }
});

module.exports = router;
