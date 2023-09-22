const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(express.json());

const resError = (res, code, msg) => {
  return res.status(code).json({ msg });
};

app.get("/", async (req, res, next) => {
  let result = await prisma.user.findMany({});
  res.json(result);
});

app.post("/register", async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    let result = await prisma.user.create({
      data: {
        username,
        password,
        email,
      },
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "Register fail!!!" });
  }
});

app.patch("/password", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    await prisma.user.update({
      data: { password },
      where: { username },
    });
    res.json({ message: "Change password success" });
  } catch (error) {
    resError(res, 404, "Change fail");
  }
});

app.post("/todos", async (req, res, next) => {
  try {
    const { title, status, due_date, userId } = req.body;
    console.log(!!due_date);
    if (!!due_date) {
      let res1 = await prisma.todoList.create({
        data: {
          title,
          status,
          due_date,
          userId,
        },
      });
      console.log("res1");
    }
    if (!due_date) {
      let res2 = await prisma.todoList.create({
        data: {
          title,
          status,
          userId,
        },
      });
      console.log("res2");
    }
    res.json({ message: "Create todolist" });
  } catch (err) {
    res.status(500).json({ msg: "Can not crate todolist" });
  }
});

app.listen(8080, () => console.log("run on port8080"));
