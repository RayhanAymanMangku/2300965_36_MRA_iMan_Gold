const express = require("express");
const app = express();
const path = require("path");
const userRoute = require("../../CHALLENGE-CHAPTER-7/src/routes/userRoute");
const todoRoute = require("../../CHALLENGE-CHAPTER-7/src/routes/todoRoute");
const session = require("express-session");
const db = require("../database");
const morgan = require("morgan");
const moment = require("moment-timezone");

app.set("view engine", "ejs");
app.set("partials", path.join(__dirname, "partials"));
app.use(morgan("dev"));

app.use(express.static("views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/user", userRoute);
app.use("/todo", todoRoute);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/login", (req, res) => {
  res.render("partials/login");
});

app.get("/register", (req, res) => {
  res.render("partials/register");
});

app.get("/todo", async (req, res) => {
  const userId = req.session.userId;
  if (userId) {
    try {
      const todos = await db("todos").where({ user_id: userId }).select();

      todos.forEach((todo) => {
        if (todo.due_date) {
          const utcDateObj = moment.utc(todo.due_date);
          const jakartaDate = utcDateObj.tz("Asia/Jakarta");
          todo.due_date = jakartaDate.format("YYYY-MM-DD HH:mm:ss");
        }
      });

      const user = await db("users").where({ id: userId }).first();
      if (user) {
        const username = user.username;
        res.render("partials/todo", { userId, todos, username });
      } else {
        console.error("User not found with ID:", userId);
        res.redirect("/login");
      }
    } catch (error) {
      console.error("Error while fetching todos:", error);
      res.status(500).send("Server error");
    }
  } else {
    res.redirect("/login");
  }
});


app.get("tbBelanja", (req, res) => {
  const userId = req.session.userId;
  if (userId) {
    try {
      if (user) {
        const username = user.username; // Ambil username dari database
        res.render("partials/tbBelanja", { userId, todos, username });
        console.log("Username from session in /todo:", username);
      } else {
        console.error("User not found with ID:", userId);
        res.redirect("/login");
      }
    } catch (error) {
      console.error("Kesalahan saat mengambil data todos:", error);
      res.status(500).send("Terjadi kesalahan di server");
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/tbBelanja", (req, res) => {
  res.render("partials/tbBelanja");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000/");
});
