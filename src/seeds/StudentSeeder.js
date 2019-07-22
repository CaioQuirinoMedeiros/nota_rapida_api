const User = require("../app/models/User")
const Student = require("../app/models/Student")
const Test = require("../app/models/Test")
const faker = require("faker")
faker.locale = "pt_BR"

module.exports = async () => {
  let users = await User.find().populate({
    path: "branches",
    populate: "teams"
  })

  users = users.map(user => user.toJSON())

  const students = []

  users.forEach(user => {
    user.branches.forEach(branch => {
      branch.teams.forEach(team => {
        for (let i = 0; i < 15; i++) {
          students.push({
            name: faker.name.findName(),
            registration: Math.random()
              .toString()
              .substr(2, 5),
            team: team._id,
            user: user._id
          })
        }
      })
    })
  })

  await Promise.all(
    students.map(async student => {
      const studentInstance = new Student(student)
      await studentInstance.save()
    })
  )

  return console.log("Students created successfully!")
}
