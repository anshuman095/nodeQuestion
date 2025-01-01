const {
  validateEmployee,
  validateUpdateEmployee,
} = require("../middlewares/validateRequest");
const employeeService = require("../services/employeeService");
const ApiError = require("../utils/apiError");
const Messages = require("../utils/messages");
const { StatusCodes } = require("http-status-codes");

class EmployeeController {
  async listEmployees(req, res, next) {
    try {
      const { pageSize = 10, pageNumber } = req.query;

      if (
        isNaN(pageSize) ||
        isNaN(pageNumber) ||
        pageSize <= 0 ||
        pageNumber <= 0
      ) {
        return next(ApiError.badRequest(Messages.INVALID_LIMIT_OR_PAGE));
      }

      const offset = (pageNumber - 1) * pageSize;

      const { employees, totalCount } = await employeeService.listEmployees(
        pageSize,
        offset
      );

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: Messages.DATA_SUCCESS,
        data: employees,
        metaData: {
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          currentPage: pageNumber,
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
      res.status(StatusCodes.CREATED).json({
        status: StatusCodes.CREATED,
        message: Messages.EMPLOYEE_ADD_SUCCESS,
        data: employee,
      });
    } catch (error) {
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
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: Messages.EMPLOYEE_UPDATE_SUCCESS,
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
      res
        .status(StatusCodes.ACCEPTED)
        .json({ status: StatusCodes.ACCEPTED, message: message });
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeCount(req, res, next) {
    try {
      const { minSalary = 0, maxSalary = Infinity } = req.query;

      if (isNaN(minSalary) || (maxSalary !== "Infinity" && isNaN(maxSalary))) {
        return next(ApiError.badRequest(Messages.INVALID_SALARY_RANGE));
      }

      const count = await employeeService.getEmployeeCountBySalaryRange(
        parseFloat(minSalary),
        maxSalary === "Infinity" ? Infinity : parseFloat(maxSalary)
      );

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: Messages.DATA_SUCCESS,
        data: count,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeController();
