const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');
const autopopulate = require('mongoose-autopopulate');

const categorySchema = new mongoose.Schema(
  {
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
  },
  { versionKey: false }
);

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    categories: [{ type: categorySchema, autopopulate: true }],
    sections: { type: [String], default: undefined },
    subjects: { type: [String], default: undefined },
    languages: { type: [String], default: undefined },
  },
  { versionKey: false }
);

templateSchema.methods.customUpdate = async function(updates) {
  const updatesKeys = Object.keys(updates);
  const allowedUpdates = [
    'name',
    'categories',
    'sections',
    'languages',
    'subjects',
  ];

  allowedUpdates.forEach(update => {
    if (updatesKeys.includes(update)) {
      this[update] = updates[update];
    }
  });

  await this.save();

  return this;
};

templateSchema.plugin(idvalidator);
templateSchema.plugin(autopopulate);

const Template = mongoose.model('Template', templateSchema);

export default Template;
