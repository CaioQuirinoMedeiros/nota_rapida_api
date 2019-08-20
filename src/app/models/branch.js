import mongoose from 'mongoose';
import idvalidator from 'mongoose-id-validator';

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { toJSON: { virtuals: true }, versionKey: false }
);

branchSchema.virtual('teams', {
  ref: 'Team',
  localField: '_id',
  foreignField: 'branch',
});

branchSchema.virtual('numTeams', {
  ref: 'Team',
  localField: '_id',
  foreignField: 'branch',
  count: true,
});

branchSchema.plugin(idvalidator);

const Branch = mongoose.model('Branch', branchSchema);

export default Branch;
