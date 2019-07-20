const mongoose = require("mongoose")

const typeSchema = new mongoose.Schema({
  name: String,
  correct: Number,
  incorrect: Number
})

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  types: [typeSchema]
})

const Template = mongoose.model("Template", templateSchema)

module.exports = Template
