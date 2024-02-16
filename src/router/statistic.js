import express from "express";
import {generateStatisticsForDateRange, generateStatisticsForSpecificOrCurrentMonth } from "../controller/statistic.js";


const router = express.Router();
router.post("/statistic/day", generateStatisticsForDateRange);
router.post("/statistic/month", generateStatisticsForSpecificOrCurrentMonth);

export default router;