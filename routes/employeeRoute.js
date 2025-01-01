const express = require("express");
const route = express.Router();
const {
  listEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeCount,
} = require("../controller/employeeController");

route.get("/", listEmployees);
route.post("/", addEmployee);
route.put("/:id", updateEmployee);
route.delete("/:id", deleteEmployee);
route.get("/salary-range", getEmployeeCount);

module.exports = route;
