import mongoose from 'mongoose';

import questionSchema from './Question';

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: new Date(),
    },
    parameter: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    questions: { type: [questionSchema], required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: { virtuals: true },
  }
);

examSchema.virtual('tests', {
  ref: 'Test',
  localField: '_id',
  foreignField: 'exam',
});

examSchema.virtual('numTests', {
  ref: 'Test',
  localField: '_id',
  foreignField: 'exam',
  count: true,
});

examSchema.methods.getTemplate = async function() {
  await this.populate('template').execPopulate();

  return this.template;
};

examSchema.virtual('numQuestions').get(function() {
  return this.questions ? null : this.questions.length;
});

examSchema.virtual('maximumGrade').get(function maximumGrade() {
  return this.questions.reduce(
    (acc, question) => acc + question.value.correct,
    0
  );
});

examSchema.virtual('minimumGrade').get(function minimumGrade() {
  return this.questions.reduce(
    (acc, question) => acc + question.value.incorrect,
    0
  );
});

examSchema.virtual('mean').get(function mean() {
  if (!this.tests || !this.tests.length) return null;

  return (
    this.tests.reduce((acc, test) => acc + test.grade, 0) / this.tests.length
  );
});

examSchema.methods.calculateParameter = async function() {
  const sumCorrects = this.questions.reduce(
    (acc, question) => acc + question.correct,
    0
  );

  this.parameter = 100 / sumCorrects;

  return this;
};

examSchema.pre('save', async function(next) {
  if (!this.parameter) await this.calculateParameter();

  return next();
});

examSchema.methods.customUpdate = async function customUpdate(updates) {
  const updatesKeys = Object.keys(updates);
  const allowedUpdates = ['name', 'date', 'parameter', 'questions'];

  allowedUpdates.forEach(update => {
    if (updatesKeys.includes(update)) {
      this[update] = updates[update];
    }
  });

  await this.save();

  return this;
};

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
