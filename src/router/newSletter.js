import express from "express"
import { getAll, get, create, remove } from "../controller/newSletter.js"

const router = express.Router()

router.get("/newSletter", getAll)
router.get("/newSletter/:id", get)
router.delete("/newSletter/:id", remove)
router.post("/newSletter", create)

export default router
