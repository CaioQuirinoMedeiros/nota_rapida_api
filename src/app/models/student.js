/* eslint-disable no-use-before-define */
import mongoose from 'mongoose';
import idvalidator from 'mongoose-id-validator';
import Branch from './Branch';
import Team from './Team';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    registration: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: { virtuals: true },
  }
);

studentSchema.virtual('tests', {
  ref: 'Test',
  localField: '_id',
  foreignField: 'student',
});

studentSchema.virtual('numTests', {
  ref: 'Test',
  localField: '_id',
  foreignField: 'student',
  count: true,
});

studentSchema.path('registration').validate(async function(value) {
  const team = await Team.findById(this.team);
  const branch = await Branch.findById(team.branch).populate('teams');

  const studentExists = await Student.findOne({
    registration: value,
    team: { $in: branch.teams },
  });

  if (studentExists) {
    return studentExists.id === this.id;
  }

  return true;
});

studentSchema.methods.customUpdate = async function customUpdate(updates) {
  const updatesKeys = Object.keys(updates);
  const allowedUpdates = ['name', 'registration', 'team'];

  allowedUpdates.forEach(update => {
    if (updatesKeys.includes(update)) {
      this[update] = updates[update];
    }
  });

  await this.save();

  return this;
};

studentSchema.methods.getBranch = async function() {
  await this.populate({ path: 'team', populate: 'branch' }).execPopulate();

  return this.team.branch;
};

studentSchema.plugin(idvalidator);

const Student = mongoose.model('Student', studentSchema);

export default Student;
