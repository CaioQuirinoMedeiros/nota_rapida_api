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

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
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
  sections: [sectionSchema]
})

templateSchema.plugin(idvalidator)

const Template = mongoose.model("Template", templateSchema)

module.exports = Template
