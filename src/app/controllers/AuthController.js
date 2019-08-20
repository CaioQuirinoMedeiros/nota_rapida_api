import User from '../models/User';

class AuthController {
  async register(req, res) {
    const { name, email, password } = req.body;

    try {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).send({ error: 'Usuário já existe' });
      }

      const user = await User.create({ name, email, password });

      const token = await user.generateJWT();

      return res.status(201).send({ user, token });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ error: 'Erro ao criar o cadastro' });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(404).send({ error: 'Usuário não encontrado' });
      }

      const passwordMatch = await user.checkPassword(password);

      if (!passwordMatch) {
        res.status(401).send({ error: 'Senha incorreta' });
      }

      const token = await user.generateJWT();

      return res.status(200).send({ user, token });
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 400)
        .send({ error: 'Erro ao fazer login' });
    }
  }

  async logout(req, res) {
    const { token, user } = req;

    try {
      user.tokens = user.tokens.filter(userToken => userToken.token !== token);

      await user.save();

      return res.status(200).send();
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 400)
        .send({ error: 'Não foi possível fazer logout' });
    }
  }

  async logoutAll(req, res) {
    const { user } = req;

    try {
      user.tokens = [];

      await user.save();

      return res.status(200).send();
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 400)
        .send({ error: 'Não foi possível fazer logout de todos os acessos' });
    }
  }
}

export default new AuthController();
