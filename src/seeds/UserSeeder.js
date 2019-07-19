const User = require("../app/models/User");

module.exports = async () => {
  const user = new User({
    name: "Caio 1",
    email: "caio1@gmail.com",
    password: "123123123"
  });

  await user.save();

  return console.log("User created successfully");
};
