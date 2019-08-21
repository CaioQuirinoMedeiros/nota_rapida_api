const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    category: { type: String, required: true },
    section: { type: String, default: null },
    subject: { type: String, default: null },
    language: { type: String, default: null },
    response: { type: String, default: null },
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 },
  },
  { toJSON: { virtuals: true } }
);

questionSchema.path('category').validate(async function(value) {
  const template = await this.parent().getTemplate();
  const categoriesNames = template.categories.map(category => category.name);

  return categoriesNames.includes(value);
});

questionSchema.path('section').validate(async function(value) {
  if (!value) return true;
  const template = await this.parent().getTemplate();
  return template.sections.includes(value);
});

questionSchema.path('subject').validate(async function(value) {
  if (!value) return true;
  const template = await this.parent().getTemplate();
  return template.subjects.includes(value);
});

questionSchema.path('language').validate(async function(value) {
  if (!value) return true;
  const template = await this.parent().getTemplate();
  return template.languages.includes(value);
});

questionSchema.virtual('value').get(function value() {
  const { parameter } = this.parent();

  return {
    correct: parameter * this.correct,
    incorrect: parameter * this.incorrect,
  };
});

questionSchema.methods.calculateCategoryValues = async function() {
  const template = await this.parent().getTemplate();
  const { correct, incorrect } = template.categories.find(
    category => category.name === this.category
  );

  this.correct = correct;
  this.incorrect = incorrect;

  return this;
};

questionSchema.pre('save', async function preSave(next) {
  await this.calculateCategoryValues();

  return next();
});

questionSchema.methods.toJSON = function() {
  const question = this.toObject({ virtuals: true });

  delete question.correct;
  delete question.incorrect;

  return question;
};

export default questionSchema;
