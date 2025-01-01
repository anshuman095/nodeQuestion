const departmentService = require("../services/departmentService");
const ApiError = require("../utils/apiError");
const Messages = require("../utils/messages");
const { StatusCodes } = require("http-status-codes");

class DepartmentController {
  async addDepartment(req, res, next) {
    try {
      if (!req.body.name) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          Messages.DEPARTMENT_NAME_REQUIRED
        );
      }
      const department = await departmentService.addDepartment(req.body);
      res.status(StatusCodes.CREATED).json({
        status: StatusCodes.CREATED,
        message: Messages.DEPARTMENT_ADD_SUCCESS,
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
        return next(ApiError.badRequest(Messages.INVALID_DEPARTMENT_ID));
      }

      const result = await departmentService.getHighestSalaryOfDepartment(
        parseInt(departmentId, 10)
      );

      if (!result) {
        return next(ApiError.badRequest(Messages.NO_EMPLOYEES_IN_DEPARTMENT));
      }

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: Messages.DATA_SUCCESS,
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
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: Messages.DATA_SUCCESS,
        data: employees,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DepartmentController();
