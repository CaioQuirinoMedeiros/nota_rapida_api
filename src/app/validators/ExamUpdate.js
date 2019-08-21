import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string(),
      date: Yup.date().typeError('A data não é válida'),
      parameter: Yup.number().typeError('O parâmetro deve ser um número'),
      questions: Yup.array(
        Yup.object()
          .shape({
            number: Yup.number()
              .typeError('O número da questão deve ser um número')
              .required('Forneça o número da questão'),
            category: Yup.string(
              'O tipo da questão deve ser um texto'
            ).required('Forneça o tipo da questão'),
            section: Yup.string('A seção deve ser um texto'),
            subject: Yup.string('A disciplina deve ser um texto'),
            language: Yup.string('A língua deve ser um texto'),
            response: Yup.string('A resposta deve ser um texto'),
          })
          .typeError('As questões precisam ser objetos')
      ),
    });

    await schema.validate(req.body);
    return next();
  } catch (err) {
    return res.status(400).send({ error: err.message || 'Erro de validação' });
  }
};
