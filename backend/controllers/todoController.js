import prisma from "../lib/prisma.js"

export const createTodo = async (req, res) => {
  const { title, dueDate } = req.body

  try {
    const todo = await prisma.todo.create({
      data: {
        userId: req.userId,
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    res.status(201).json(todo)
  } catch (error) {
    console.error("CREATE TODO ERROR:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const getAllTodos = async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    })

    res.status(200).json(todos)
  } catch (error) {
    console.error("GET TODOS ERROR:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const updateTodo = async (req, res) => {
  const { id } = req.params
  const { title, isCompleted, dueDate } = req.body

  try {
    const todo = await prisma.todo.update({
      where: { id, userId: req.userId },
      data: {
        title,
        isCompleted,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    res.status(200).json(todo)
  } catch (error) {
    console.error("UPDATE TODO ERROR:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const deleteTodo = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.todo.delete({
      where: { id, userId: req.userId },
    })

    res.status(200).json({ message: "Todo deleted" })
  } catch (error) {
    console.error("DELETE TODO ERROR:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}