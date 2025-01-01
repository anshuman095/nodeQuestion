const express = require("express");
const { addDepartment, getHighestSalaryByDepartment, getYoungestEmployee } = require("../controller/departmentController");

const route = express.Router();

route.post("/", addDepartment);
route.get("/highest-salary/:id", getHighestSalaryByDepartment);
route.get('/youngest-employee', getYoungestEmployee);

module.exports = route;
