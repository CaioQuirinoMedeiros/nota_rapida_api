import mongoose from 'mongoose';

import './Question';

const answerSchema = new mongoose.Schema(
  {
    question: { type: Number, required: true },
    marked: { type: String, default: null },
    correct: { type: Boolean, default: null },
    invalid: { type: Boolean, default: null },
    score: { type: Number, default: 0 },
  },
  { toJSON: { virtuals: true } }
);

answerSchema.path('question').validate(async function(value) {
  let exam = await this.parent().getExam();
  exam = exam.toObject();

  const question = exam.questions.find(quest => quest.number === value);

  return !!question;
});

answerSchema.methods.findQuestion = async function() {
  const exam = await this.parent().getExam();
  const { language } = this.parent();

  const question = exam.questions.find(quest => {
    const matchNumber = quest.number === this.question;

    if (matchNumber) return quest.language ? quest.language === language : true;

    return false;
  });

  return question;
};

answerSchema.methods.correctQuestion = async function() {
  const question = await this.findQuestion();

  if (!question) {
    this.invalid = true;
    return this;
  }

  if (!question.response) {
    this.score = question.correct;
    return this;
  }

  if (!this.marked) return this;

  if (this.marked.includes('|')) {
    this.invalid = true;
    return this;
  }

  this.correct = this.marked === question.response;
  this.score = this.correct ? question.correct : question.incorrect;

  return this;
};

answerSchema.pre('save', async function() {
  await this.correctQuestion();
});

export default answerSchema;
