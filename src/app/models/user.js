import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true }
);

userSchema.virtual('branches', {
  ref: 'Branch',
  localField: '_id',
  foreignField: 'user',
});

userSchema.virtual('templates', {
  ref: 'Template',
  localField: '_id',
  foreignField: 'user',
});

userSchema.virtual('exams', {
  ref: 'Exam',
  localField: '_id',
  foreignField: 'user',
});

userSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 8);

  return next();
});

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = async function() {
  const token = jwt.sign({ id: this.id }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });

  return token;
};

userSchema.methods.customUpdate = async function customUpdate(updates) {
  const updatesKeys = Object.keys(updates);
  const allowedUpdates = ['name', 'email', 'password'];

  allowedUpdates.forEach(update => {
    if (updatesKeys.includes(update)) {
      this[update] = updates[update];
    }
  });

  await this.save();

  return this;
};

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject({ virtuals: true });

  delete user.password;
  delete user.tokens;

  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
