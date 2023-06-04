import express from "express";
import {
  createEmployee,
  updateEmployee,
  getAllEmployees,
  getEmployee,
  deleteEmployee,
} from "../../controllers/employeeController.js";

const router = express.Router();

// create employee
router.post("/employee", createEmployee);

// update employee
router.put("/employee/:id", updateEmployee);

// get all employees
router.get("/employees", getAllEmployees);

// get employee
router.get("/employee/:id", getEmployee);

// delete employee
router.delete("/employee/:id", deleteEmployee);

export default router;
