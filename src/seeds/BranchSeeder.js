const User = require("../app/models/User")
const Branch = require("../app/models/Branch")
const faker = require("faker")
faker.locale = "pt_BR"

module.exports = async () => {
  const users = await User.find()

  await Promise.all(
    users.map(async user => {
      for (let i = 0; i < 2; i++) {
        const branch = new Branch({
          name: faker.address.city(),
          user: user._id
        })

        await branch.save()
      }
    })
  )

  return console.log("Branches created successfully!")
}
