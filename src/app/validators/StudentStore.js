import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().required('O nome do aluno é obrigatório'),
      registration: Yup.string().required('A matrícula é obrigatória'),
      team: Yup.string().required('A turma é obrigatória'),
    });

    await schema.validate(req.body);
    return next();
  } catch (err) {
    return res.status(400).send({ error: err.message || 'Erro de validação' });
  }
};
