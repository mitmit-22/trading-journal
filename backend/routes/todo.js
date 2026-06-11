import { Router } from "express"
import { createTodo, getAllTodos, updateTodo, deleteTodo } from "../controllers/todoController.js"
import protect from "../middleware/protect.js"

const router = Router()

router.use(protect)

router.post("/", createTodo)
router.get("/", getAllTodos)
router.put("/:id", updateTodo)
router.delete("/:id", deleteTodo)

export default router