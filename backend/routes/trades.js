import { Router } from "express"
import { createTrade, getAllTrades, getTrade, updateTrade, deleteTrade } from "../controllers/tradesController.js"
import protect from "../middleware/protect.js"

const router = Router()

router.use(protect)

router.post("/", createTrade)
router.get("/", getAllTrades)
router.get("/:id", getTrade)
router.put("/:id", updateTrade)
router.delete("/:id", deleteTrade)

export default router