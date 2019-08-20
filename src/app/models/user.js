import mongoose from 'mongoose';
import validator from 'validator';
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
      validate: value => {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value === 'password') {
          throw new Error("Your password cannot be 'password'");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
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
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  return next();
});

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

userSchema.methods.generateJWT = async function() {
  const token = jwt.sign({ id: this.id }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });

  this.tokens = this.tokens.concat({ token });

  await this.save();

  return token;
};

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject({ virtuals: true });

  delete user.password;
  delete user.tokens;

  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
