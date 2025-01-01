const pool = require("../config/db");
const ApiError = require("../utils/apiError");

class DepartmentService {
  async addDepartment(data) {
    const query = `
        INSERT INTO departments (name, status)
        VALUES ($1, $2)
        RETURNING *;
      `;
    const values = [data.name, data.status === undefined ? true : data.status];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  }

  async getHighestSalaryOfDepartment(departmentId) {
    try {
      const departmentCheckQuery = "SELECT * FROM departments WHERE id = $1";
      const departmentCheckResult = await pool.query(departmentCheckQuery, [
        departmentId,
      ]);

      if (departmentCheckResult.rows.length === 0) {
        throw ApiError.notFound("Department not found");
      }
      const query = `
      SELECT MAX(salary) AS highest_salary, department_id
      FROM employees
      WHERE department_id = $1
      GROUP BY department_id`;

      const { rows } = await pool.query(query, [departmentId]);
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    } catch (error) {
      if (error.message === "Department not found") {
        throw ApiError.notFound("Department not found");
      }
      throw ApiError.internal(error.message);
    }
  }

  async getYoungestEmployeeInEachDepartment() {
    try {
      const query = `
        SELECT
          e.department_id,
          d.name AS department_name,
          e.name AS employee_name,
          EXTRACT(YEAR FROM AGE(e.dob)) AS age
        FROM employees e
        INNER JOIN departments d ON e.department_id = d.id
        WHERE e.dob = (
          SELECT MIN(dob)
          FROM employees
          WHERE department_id = e.department_id
        )
        GROUP BY e.department_id, d.name, e.name, e.dob
        ORDER BY e.department_id;
      `;

      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  }
}

module.exports = new DepartmentService();
