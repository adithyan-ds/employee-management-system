import Employee from "../models/empModel.js";
import mongoose from "mongoose"; // We need this to validate the MongoDB ID format

// --- HELPER FUNCTION: Reusable Validation Logic ---
const validateEmployeeInput = (data) => {
  const { name, position, salary, department } = data;
  
  if (!name || typeof name !== 'string' || name.trim() === '') return "Valid name is required.";
  if (!position || typeof position !== 'string' || position.trim() === '') return "Valid position is required.";
  if (!department || typeof department !== 'string' || department.trim() === '') return "Valid department is required.";
  
  // Salary must exist, must be a number, and cannot be negative
  if (salary === undefined || isNaN(salary) || Number(salary) < 0) {
    return "Salary must be a valid positive number.";
  }
  
  return null; // Return null if everything is perfect
};


// --- CONTROLLERS ---

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json({ message: "Employees fetched successfully", employees });
  } catch (error) {
    console.error("GET Error:", error);
    res.status(500).json({ message: "Internal server error fetching employees" });
  }
};


export const createEmployee = async (req, res) => {
  try {
    // 1. Run the validation shield
    const validationError = validateEmployeeInput(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError }); // 400 Bad Request
    }

    const { name, position, salary, department } = req.body;
    
    // 2. If validation passes, save to database
    const employee = await Employee.create({ name, position, salary, department });
    res.status(201).json({ message: "Employee created successfully", employee });
    
  } catch (error) {
    console.error("POST Error:", error);
    res.status(500).json({ message: "Internal server error creating employee" });
  }
};


export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate the MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee ID format." });
    }

    // 2. Run the input validation shield
    const validationError = validateEmployeeInput(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { name, position, salary, department } = req.body;
    
    // 3. Update the document
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { name, position, salary, department },
      { new: true, runValidators: true } // runValidators ensures Mongoose schema rules are also checked
    );
    
    if (!updatedEmployee) return res.status(404).json({ message: "Employee not found" });
    
    res.json({ message: "Employee updated successfully", updatedEmployee });
    
  } catch (error) {
    console.error("PUT Error:", error);
    res.status(500).json({ message: "Internal server error updating employee" });
  }
};


export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate the MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee ID format." });
    }

    const deleted = await Employee.findByIdAndDelete(id);
    
    if (!deleted) return res.status(404).json({ message: "Employee not found" });
    
    res.json({ message: "Employee deleted successfully" });
    
  } catch (error) {
    console.error("DELETE Error:", error);
    res.status(500).json({ message: "Internal server error deleting employee" });
  }
};