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
      return res.status(400).send({ error: 'Erro ao fazer login' });
    }
  }
}

export default new AuthController();
