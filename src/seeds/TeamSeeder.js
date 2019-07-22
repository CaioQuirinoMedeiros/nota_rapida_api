const Branch = require("../app/models/Branch")
const Team = require("../app/models/Team")
const faker = require("faker")
faker.locale = "pt_BR"

module.exports = async () => {
  const branches = await Branch.find()

  await Promise.all(
    branches.map(async branch => {
      for (let i = 0; i < 5; i++) {
        const team = new Team({
          name: faker.company.companyName(),
          branch: branch._id
        })

        await team.save()
      }
    })
  )

  return console.log("Teams created successfully!")
}
