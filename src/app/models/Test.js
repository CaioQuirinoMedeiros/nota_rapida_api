import mongoose from 'mongoose';

import answerSchema from './Answer';

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

testSchema.path('language').validate(async function() {
  const exam = await this.getExam();
  const template = await exam.getTemplate();

  return template.languages.includes(this.language);
});

testSchema.methods.getExam = async function() {
  await this.populate('exam').execPopulate();

  return this.exam;
};

testSchema.pre('save', async function() {
  await this.calculateGrade();
});

testSchema.methods.calculateGrade = async function() {
  this.grade = this.answers.reduce((acc, answer) => acc + answer.score, 0);

  return this;
};

testSchema.virtual('markeds').get(function() {
  const quantity = this.answers.filter(answer => answer.marked).length;
  const percentage = quantity / this.answers.length;

  return {
    quantity,
    percentage,
  };
});

testSchema.virtual('unmarkeds').get(function() {
  const quantity = this.answers.filter(answer => !answer.marked).length;
  const percentage = quantity / this.answers.length;

  return {
    quantity,
    percentage,
  };
});

testSchema.virtual('corrects').get(function() {
  const quantity = this.answers.filter(answer => answer.correct).length;
  const percentage = quantity / this.markeds.quantity;

  return {
    quantity,
    percentage,
  };
});

testSchema.virtual('incorrects').get(function() {
  const quantity = this.answers.filter(
    answer => typeof answer.correct === 'boolean' && !answer.correct
  ).length;
  const percentage = quantity / this.markeds.quantity;

  return {
    quantity,
    percentage,
  };
});

testSchema.virtual('invalids').get(function() {
  const quantity = this.answers.filter(answer => answer.invalid).length;
  const percentage = quantity / this.markeds.quantity;

  return {
    quantity,
    percentage,
  };
});

const Test = mongoose.model('Test', testSchema);

export default Test;
