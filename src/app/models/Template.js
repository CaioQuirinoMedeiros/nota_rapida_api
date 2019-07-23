const mongoose = require("mongoose")
const idvalidator = require("mongoose-id-validator")

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  correct: {
    type: Number,
    required: true
  },
  incorrect: {
    type: Number,
    required: true
  }
})

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  categories: [categorySchema],
  sections: { type: [String], default: undefined },
  subjects: { type: [String], default: undefined },
  languages: { type: [String], default: undefined }
})

templateSchema.plugin(idvalidator)

const Template = mongoose.model("Template", templateSchema)
const Category = mongoose.model("Category", categorySchema)

module.exports = Template
