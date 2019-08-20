const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  correct: {
    type: Number,
    required: true,
  },
  incorrect: {
    type: Number,
    required: true,
  },
});

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  categories: [categorySchema],
  sections: { type: [String], default: undefined },
  subjects: { type: [String], default: undefined },
  languages: { type: [String], default: undefined },
});

templateSchema.methods.customUpdate = async function customUpdate(updates) {
  const updatesKeys = Object.keys(updates);
  const allowedUpdates = [
    'name',
    'categories',
    'sections',
    'languages',
    'subjects',
  ];
  const isUpdatesValid = updatesKeys.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isUpdatesValid) {
    throw new Error('Parâmetros incorretos para editar o aluno');
  }

  updatesKeys.forEach(update => {
    this[update] = updates[update];
  });

  await this.save();

  return this;
};

templateSchema.plugin(idvalidator);

const Template = mongoose.model('Template', templateSchema);

export default Template;
