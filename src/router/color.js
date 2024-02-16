import express from "express"
import { create, get, getAll, remove, update } from "../controller/color.js"

const router = express.Router()

router.get("/colors", getAll)
router.get("/color/:id", get)
router.post("/color", create)
router.delete("/color/:id", remove)
router.patch("/color/:id", update)

export default router
