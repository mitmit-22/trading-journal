import { Router } from "express"
import { createJournal, getAllJournals, getJournal, updateJournal, deleteJournal } from "../controllers/journalController.js"
import protect from "../middleware/protect.js"

const router = Router()

router.use(protect)

router.post("/", createJournal)
router.get("/", getAllJournals)
router.get("/:id", getJournal)
router.put("/:id", updateJournal)
router.delete("/:id", deleteJournal)

export default router