const express = require("express")
require("./config/database/mongoose")
require("dotenv").config()
const auth = require("./app/middlewares/auth")

const authRouter = require("./routes/auth")
const userRouter = require("./routes/user")
const schoolRouter = require("./routes/school")
const branchRouter = require("./routes/branch")
const teamRouter = require("./routes/team")
const testRouter = require("./routes/test")
const studentRouter = require("./routes/student")

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(authRouter)

app.use(auth)
app.use(userRouter)
app.use(schoolRouter)
app.use(testRouter)
app.use(branchRouter)
app.use(teamRouter)
app.use(studentRouter)

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
