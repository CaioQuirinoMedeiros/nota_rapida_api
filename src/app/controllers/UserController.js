class UserController {
  async show(req, res) {
    const { user } = req;

    return res.status(200).send(user);
  }

  async update(req, res) {
    const { user } = req;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isUpdatesValid = updates.every(update =>
      allowedUpdates.includes(update)
    );

    if (!isUpdatesValid) {
      return res.status(400).send({ error: 'Invalid user inputs' });
    }

    try {
      updates.forEach(update => {
        user[update] = req.body[update];
      });

      await user.save();

      return res.status(200).send(user);
    } catch (err) {
      return res.status(400).send({ error: "Couldn't update the user" });
    }
  }

  async delete(req, res) {
    const { user } = req;

    try {
      await user.remove();

      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ error: "Couldn't delete user" });
    }
  }
}

export default new UserController();
