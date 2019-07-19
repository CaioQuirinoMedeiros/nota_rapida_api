const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  registration: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  }
});

studentSchema.pre("save", async function(next) {
  const student = this;

  student.slug = (Math.random() * 10000).toString();

  next();
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
