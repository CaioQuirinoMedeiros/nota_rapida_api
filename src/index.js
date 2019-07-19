const express = require("express")
require("./config/database/mongoose")
require("dotenv").config()

const authRouter = require("./routes/auth")
const userRouter = require("./routes/user")
const schoolRouter = require("./routes/school")
const branchRouter = require("./routes/branch")
const teamRouter = require("./routes/team")
const studentRouter = require("./routes/student")

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(authRouter)
app.use(userRouter)
app.use(schoolRouter)
app.use(branchRouter)
app.use(teamRouter)
app.use(studentRouter)

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
