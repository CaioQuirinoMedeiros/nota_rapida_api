const mongoose = require("mongoose")

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
  categories: [categorySchema],
  sections: [sectionSchema]
})

const Template = mongoose.model("Template", templateSchema)

module.exports = Template
