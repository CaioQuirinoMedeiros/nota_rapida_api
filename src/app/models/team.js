const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { toJSON: { virtuals: true }, versionKey: false }
);

teamSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'team',
});

teamSchema.virtual('numStudents', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'team',
  count: true,
});

teamSchema.methods.customUpdate = async function(updates) {
  const updatesKeys = Object.keys(updates);
  const allowedUpdates = ['name', 'branch'];

  allowedUpdates.forEach(update => {
    if (updatesKeys.includes(update)) {
      this[update] = updates[update];
    }
  });

  await this.save();

  return this;
};

teamSchema.plugin(idvalidator);

const Team = mongoose.model('Team', teamSchema);

export default Team;
