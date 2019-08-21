import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string(),
      categories: Yup.array(
        Yup.object()
          .shape({
            name: Yup.string().required('Forneça o nome do tipo de questão'),
            correct: Yup.number()
              .typeError(
                'O peso do acerto do tipo de questão deve ser um número'
              )
              .required('Forneça o peso do acerto do tipo de questão'),
            incorrect: Yup.number()
              .typeError('O peso do erro do tipo de questão deve ser um número')
              .required('Forneça o peso do erro do tipo de questão'),
          })
          .typeError('O tipo de questão deve ser um objeto')
      ).typeError('Os tipos de questões deve ser um array'),
      sections: Yup.array(Yup.string('A seção deve ser um texto')).typeError(
        'As seções deve ser um array'
      ),
      subjects: Yup.array(
        Yup.string('A disciplina deve ser um texto')
      ).typeError('As disciplinas deve ser um array'),
      languages: Yup.array(Yup.string('A língua deve ser um texto')).typeError(
        'As opções línguas estrangeiras deve ser um array'
      ),
    });

    await schema.validate(req.body);
    return next();
  } catch (err) {
    return res.status(400).send({ error: err.message || 'Erro de validação' });
  }
};
