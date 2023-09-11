const db = require("../../database");

const todoController = {};

todoController.addTodo = async (req, res) => {
  try {
    const userId = req.session.userId;
    const tasks = Array.isArray(req.body.task)
      ? req.body.task
      : [req.body.task];
    let due_dates = req.body.due_dates;

    if (!Array.isArray(due_dates)) {
      due_dates = [due_dates];
    }

    if (!tasks.length || !userId) {
      return res.status(400).json({ message: "Incomplete data provided." });
    }

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const due_date = due_dates[i] || null;

      const todoData = {
        user_id: userId,
        todo: task,
        status: "pending",
      };

      if (due_date) {
        todoData.due_date = due_date;
      }

      await db("todos").insert(todoData);
    }

    console.log("Successfully added todos.");
    res.redirect("/todo");
  } catch (error) {
    console.error("Error while adding todos:", error);
    res.status(500).redirect("/todo");
  }
};

// Ambil semua todo berdasarkan user
todoController.getAllTodos = async (req, res) => {
  try {
    const userId = req.session.userId;
    const username = req.session.username;

    if (!userId) {
      return res.redirect("/login");
    }

    const todos = await db("todos").where({ user_id: userId });
    res.render("partials/todo", { todos, userId: userId, username });
    // res.json({ todos, userId: userId, username });
  } catch (error) {
    console.error("Error in getAllTodos:", error);
    res
      .status(500)
      .json({ message: "Error fetching todos", error: error.message });
  }
};

todoController.updateTodos = async (req, res) => {
  const userId = req.params.userId;
  const todosFromFrontend = req.body.todos || [];

  try {
    const dbTodos = await db("todos").where({ user_id: userId });

    for (const todo of dbTodos) {
      if (!todosFromFrontend.includes(todo.id)) {
        await db("todos").where({ id: todo.id }).delete();
      }
    }

    res.redirect("/todo");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};


todoController.deleteTodos = async (req, res) => {
  const todoId = req.params.todoId;

  if (!todoId || todoId === "null" || isNaN(Number(todoId))) {
    console.error("Invalid todo ID:", todoId);
    return res.status(400).json({ message: "Invalid todo ID" });
  }

  try {
    // Debug: Mencetak ID yang akan dihapus
    console.log("ID yang akan dihapus:", todoId);

    // Debug: Mencetak tipe data dari ID
    console.log("Tipe data dari todoId:", typeof todoId);

    // Debug: Cetak data dari database berdasarkan ID sebelum dihapus
    const todoItem = await db("todos").where({ id: todoId }).first();
    console.log("Data yang akan dihapus:", todoItem);

    await db("todos").where({ id: todoId }).delete();

    console.log("berhasil menghapus todo dengan ID:", todoId);

    return res.redirect("/todo"); 
  } catch (error) {
    if (!res.headersSent) {
      // respons jika belum ada yang terkirim
      console.error("Error saat menghapus todo dengan ID:", todoId, error);
      res.status(500).json({ message: "Error deleting todo", error });
    }
  }
};

module.exports = todoController;
