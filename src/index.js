const express = require("express");
require("./config/database/mongoose");
require("dotenv").config();

const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const schoolRouter = require("./routers/school");
const branchRouter = require("./routers/branch");
const teamRouter = require("./routers/team");
const studentRouter = require("./routers/student");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(authRouter);
app.use(userRouter);
app.use(schoolRouter);
app.use(branchRouter);
app.use(teamRouter);
app.use(studentRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
