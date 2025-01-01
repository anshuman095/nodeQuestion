const {
  validateEmployee,
  validateUpdateEmployee,
} = require("../middlewares/validateRequest");
const employeeService = require("../services/employeeService");
const ApiError = require("../utils/apiError");

class EmployeeController {
  async listEmployees(req, res, next) {
    try {
      const { limit = 10, page } = req.query;

      if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
        return next(ApiError.badRequest("Invalid limit or page value."));
      }

      const offset = (page - 1) * limit;

      const { employees, totalCount } = await employeeService.listEmployees(
        limit,
        offset
      );

      res.json({
        status: 200,
        message: "Data retrieved successfully",
        data: employees,
        metaData: {
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async addEmployee(req, res, next) {
    try {
      const { error } = validateEmployee(req.body);
      if (error) {
        return next(ApiError.badRequest(error.details[0].message));
      }

      const employee = await employeeService.addEmployee(req.body);
      res.status(201).json({
        status: 201,
        message: "Employee created successfully",
        data: employee,
      });
    } catch (error) {
        console.log("oooooooo", error.message)
      next(error);
    }
  }

  async updateEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = validateUpdateEmployee(req.body);
      if (error) {
        return next(ApiError.badRequest(error.details[0].message));
      }
      const employee = await employeeService.updateEmployee(id, req.body);
      res.json({
        status: 200,
        message: "Employee updated successfully",
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const message = await employeeService.deleteEmployee(id);
      res.json({ message });
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeCount(req, res, next) {
    try {
      const { minSalary = 0, maxSalary = Infinity } = req.query;

      if (isNaN(minSalary) || (maxSalary !== "Infinity" && isNaN(maxSalary))) {
        return next(ApiError.badRequest("Invalid salary range values"));
      }

      const count = await employeeService.getEmployeeCountBySalaryRange(
        parseFloat(minSalary),
        maxSalary === "Infinity" ? Infinity : parseFloat(maxSalary)
      );

      res.json({
        status: 200,
        message: "Data retrieved successfully",
        data: count,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeController();
