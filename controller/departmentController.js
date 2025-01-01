const departmentService = require("../services/departmentService");
const ApiError = require("../utils/apiError");

class DepartmentController {
  async addDepartment(req, res, next) {
    try {
      if (!req.body.name) {
        throw new ApiError(400, "Department name is required");
      }
      const department = await departmentService.addDepartment(req.body);
      res.status(201).json({
        status: 201,
        message: "Department created successfully",
        data: department,
      });
    } catch (error) {
      next(error);
    }
  }

  async getHighestSalaryByDepartment(req, res, next) {
    try {
      const departmentId = req.params.id;

      if (!departmentId || isNaN(departmentId)) {
        return next(ApiError.badRequest("Invalid department ID"));
      }

      const result = await departmentService.getHighestSalaryOfDepartment(
        parseInt(departmentId, 10)
      );

      if (!result) {
        return next(ApiError.badRequest("No employees found in this department"));
      }

      res.status(200).json({
        status: 200,
        message: "Data retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getYoungestEmployee(req, res, next) {
    try {
      const employees =
        await departmentService.getYoungestEmployeeInEachDepartment();
      res.json({
        status: 200,
        message: "Data retrieved successfully",
        data: employees,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DepartmentController();
