import express from "express";
import {
  createCafe,
  updateCafe,
  getAllCafes,
  getCafe,
  deleteCafe,
  getLogo,
} from "../../controllers/cafeController.js";

const router = express.Router();

// create cafe
router.post("/cafe", createCafe);

// update cafe
router.put("/cafe/:id", updateCafe);

// get all cafes
router.get("/cafes", getAllCafes);

// get cafe
router.get("/cafe/:id", getCafe);

// delete cafe
router.delete("/cafe/:id", deleteCafe);

// get logo
router.get("/cafe/:id/logo", getLogo);

export default router;
