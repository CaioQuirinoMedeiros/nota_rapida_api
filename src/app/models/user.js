const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid")
        }
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value === "password") {
          throw new Error("Your password cannot be 'password'")
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  { toJSON: { virtuals: true } }
)

userSchema.virtual("branches", {
  ref: "Branch",
  localField: "_id",
  foreignField: "user"
})

userSchema.virtual("templates", {
  ref: "Template",
  localField: "_id",
  foreignField: "user"
})

userSchema.virtual("exams", {
  ref: "Exam",
  localField: "_id",
  foreignField: "user"
})

userSchema.pre("save", async function(next) {
  const user = this

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error("Email não registrado")
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error("Senha inválida")
  }

  return user
}

userSchema.methods.generateAuthToken = async function() {
  const user = this

  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({ token })

  await user.save()

  return token
}

userSchema.methods.toJSON = function() {
  const user = this.toObject({ virtuals: true })

  delete user.password
  delete user.tokens

  return user
}

const User = mongoose.model("User", userSchema)

module.exports = User
