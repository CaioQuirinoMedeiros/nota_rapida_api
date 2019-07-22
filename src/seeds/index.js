const mongoose = require("mongoose")

const UserSeeder = require("./UserSeeder")
const BranchSeeder = require("./BranchSeeder")
const TeamSeeder = require("./TeamSeeder")
const StudentSeeder = require("./StudentSeeder")

mongoose.connect("mongodb://127.0.0.1:27017/nota-rapida", {
  useNewUrlParser: true
})
;(async () => {
  try {
    await UserSeeder()
    await BranchSeeder()
    await TeamSeeder()
    await StudentSeeder()
  } catch (err) {
    console.log(err)
  } finally {
    mongoose.disconnect()
    process.exit()
  }
})()
