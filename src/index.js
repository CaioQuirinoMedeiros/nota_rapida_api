const express = require("express")
require("./config/database/mongoose")
require("dotenv").config()
const cors = require("cors")
const auth = require("./app/middlewares/auth")

const authRouter = require("./routes/auth")
const userRouter = require("./routes/user")
const branchRouter = require("./routes/branch")
const teamRouter = require("./routes/team")
const studentRouter = require("./routes/student")
const templateRouter = require("./routes/template")
const examRouter = require("./routes/exam")
const testRouter = require("./routes/test")

const app = express()

const port = process.env.PORT || 3333

app.use(cors())
app.use(express.json())
app.use(authRouter)

app.use(auth)
app.use(userRouter)
app.use(branchRouter)
app.use(teamRouter)
app.use(studentRouter)
app.use(templateRouter)
app.use(examRouter)
app.use(testRouter)

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
