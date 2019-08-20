import User from '../models/User';

class UserController {
  async show(req, res) {
    const { user } = req;

    return res.status(200).send(user);
  }

  async update(req, res) {
    const { email, password, oldPassword } = req.body;
    const { user } = req;

    try {
      if (email && email !== user.email) {
        const userExists = await User.findByEmail(email);

        if (userExists) {
          return res.status(400).send({ error: 'Usuário já existe' });
        }
      }

      if (password) {
        if (!oldPassword) {
          return res.status(401).send({ error: 'Forneça sua senha atual' });
        }

        const passwordMatch = await user.checkPassword(oldPassword);

        if (!passwordMatch) {
          return res.status(401).send({ error: 'Senha incorreta' });
        }
      }

      await user.customUpdate(req.body);

      return res.status(200).send(user);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ error: 'Erro ao editar usuário' });
    }
  }

  async delete(req, res) {
    const { user } = req;

    try {
      await user.remove();

      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ error: 'Erro ao deletar usuário' });
    }
  }
}

export default new UserController();
