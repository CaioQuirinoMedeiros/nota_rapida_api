const mongoose = require('mongoose');

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

answerSchema.methods.findQuestion = async function findQuestion() {
  const exam = await this.parent().getExam();
  const { language } = this.parent();

  const question = exam.questions.find(quest => {
    const matchNumber = quest.number === this.question;

    if (matchNumber)
      return question.language ? question.language === language : true;

    return false;
  });

  return question;
};

answerSchema.path('question').validate(async function validateQuestion(value) {
  let exam = await this.parent().getExam();
  exam = exam.toObject();

  const question = exam.questions.find(quest => quest.number === value);

  return !!question;
});

answerSchema.methods.correctQuestion = async function correctQuestion() {
  if (!this.marked) return this;

  const question = await this.findQuestion();

  if (!question) {
    this.invalid = true;
    return this;
  }

  if (!question.response) {
    this.score = question.correct;
    return this;
  }

  if (this.marked.includes('|')) {
    this.invalid = true;
    return this;
  }

  this.correct = this.marked === question.response;
  this.score = this.correct ? question.correct : question.incorrect;

  return this;
};

answerSchema.pre('save', async function preSave() {
  await this.correctQuestion();
});

const testSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
    },
    language: { type: String, default: null },
    answers: { type: [answerSchema], required: true },
    grade: { type: Number, default: null },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: { virtuals: true },
  }
);

testSchema.methods.getExam = async function getExam() {
  await this.populate('exam').execPopulate();

  return this.exam;
};

testSchema.pre('save', async function preSave() {
  await this.calculateGrade();
});

testSchema.methods.calculateGrade = async function calculateGrade() {
  this.grade = this.answers.reduce((acc, answer) => acc + answer.score, 0);

  return this;
};

testSchema.virtual('markeds').get(function markeds() {
  const quantity = this.answers.filter(answer => answer.marked).length;
  const percentage = quantity / this.answers.length;

  return {
    quantity,
    percentage,
  };
});

testSchema.virtual('unmarkeds').get(function unmarkeds() {
  const quantity = this.answers.filter(answer => !answer.marked).length;
  const percentage = quantity / this.answers.length;

  return {
    quantity,
    percentage,
  };
});

testSchema.virtual('corrects').get(function corrects() {
  const quantity = this.answers.filter(answer => answer.correct).length;
  const percentage = quantity / this.markeds.quantity;

  return {
    quantity,
    percentage,
  };
});

testSchema.virtual('incorrects').get(function incorrects() {
  const quantity = this.answers.filter(
    answer => typeof answer.correct === 'boolean' && !answer.correct
  ).length;
  const percentage = quantity / this.markeds.quantity;

  return {
    quantity,
    percentage,
  };
});

testSchema.virtual('invalids').get(function invalids() {
  const quantity = this.answers.filter(answer => answer.invalid).length;
  const percentage = quantity / this.markeds.quantity;

  return {
    quantity,
    percentage,
  };
});

const Test = mongoose.model('Test', testSchema);

export default Test;
