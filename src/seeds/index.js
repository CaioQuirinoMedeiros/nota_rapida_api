const mongoose = require("mongoose");

const UserSeeder = require("./UserSeeder");
const SchoolSeeder = require("./SchoolSeeder");
const BranchSeeder = require("./BranchSeeder");
const TeamSeeder = require("./TeamSeeder");

mongoose.connect("mongodb://127.0.0.1:27017/nota-rapida", {
  useNewUrlParser: true
});

(async () => {
  try {
    await UserSeeder();
    await SchoolSeeder();
    await BranchSeeder();
    await TeamSeeder();
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.disconnect();
    process.exit();
  }
})();
