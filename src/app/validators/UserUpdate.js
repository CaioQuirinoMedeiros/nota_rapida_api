import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email('O email não é válido'),
      oldPassword: Yup.string().when('password', (password, field) =>
        password ? field.required('É necessário fornecer a senha atual') : field
      ),
      password: Yup.string().min(6, 'A senha deve ter no mínimo 6 dígitos'),
    });

    await schema.validate(req.body);
    return next();
  } catch (err) {
    return res.status(400).send({ error: err.message || 'Erro de validação' });
  }
};
