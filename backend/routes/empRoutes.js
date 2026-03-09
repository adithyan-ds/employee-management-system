import express from "express";
import { 
  getAllEmployees, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee 
} from "../controllers/empController.js";

const router = express.Router();

// GET /employees
router.get('/', getAllEmployees);

// POST /employees (This fixes the save issue!)
router.post('/', createEmployee);

// PUT /employees/:id
router.put('/:id', updateEmployee);

// DELETE /employees/:id
router.delete('/:id', deleteEmployee);

export default router;