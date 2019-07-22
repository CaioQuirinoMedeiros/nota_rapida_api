const User = require("../app/models/User")
const faker = require("faker")
faker.locale = "pt_BR"

module.exports = async () => {
  let users = []

  for (i = 0; i < 5; i++) {
    users[i] = new User({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: "123123123"
    })
  }

  const me = new User({
    name: "Caio 1",
    email: "caio1@gmail.com",
    password: "123123123"
  })

  users.push(me)

  await Promise.all(
    users.map(async user => {
      await user.save()
    })
  )

  return console.log("Users created successfully")
}
