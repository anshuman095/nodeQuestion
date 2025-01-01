const pool = require("../config/db");
const crypto = require("crypto");
const ApiError = require("../utils/apiError");

const algorithm = "aes-256-cbc";
const secretKey = "happysecretforphonenumberencrypt";
const iv = crypto.randomBytes(16);

class EmployeeService {
  async encryptPhone(phone) {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(phone, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  }

  async hashPhone(phone) {
    return crypto.createHash("sha256").update(phone).digest("hex");
  }

  async listEmployees(limit, offset) {
    try {
      const query =
        "SELECT * FROM employees ORDER BY id DESC LIMIT $1 OFFSET $2";
      const { rows } = await pool.query(query, [limit, offset]);

      const countQuery = "SELECT COUNT(*) FROM employees";
      const { rows: countRows } = await pool.query(countQuery);
      const totalCount = parseInt(countRows[0].count, 10);

      return { employees: rows, totalCount };
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  }

  async addEmployee(data) {
    const departmentCheckQuery = "SELECT * FROM departments WHERE id = $1";
    const departmentCheckResult = await pool.query(departmentCheckQuery, [
      data.department_id,
    ]);

    if (departmentCheckResult.rows.length === 0) {
      throw ApiError.notFound("Department not found");
    }
    if (data.phone) {
      var encryptedPhone = await this.encryptPhone(data.phone);
    }
    const emailCheckQuery = "SELECT * FROM employees WHERE email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [data.email]);
    if (emailCheckResult.rows.length > 0) {
      throw ApiError.badRequest("Email must be unique");
    }

    const phoneCheckQuery = "SELECT * FROM employees WHERE phone = $1";
    const phoneCheckResult = await pool.query(phoneCheckQuery, [
      encryptedPhone,
    ]);
    if (phoneCheckResult.rows.length > 0) {
      throw ApiError.badRequest("Phone number must be unique");
    }

    const query = `
        INSERT INTO employees (department_id, name, dob, phone, photo, email, salary, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`;
    const values = [
      data.department_id,
      data.name,
      data.dob,
      encryptedPhone,
      data.photo,
      data.email,
      data.salary,
      data.status === undefined ? true : data.status,
    ];
    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw ApiError.internal("Failed to add employee");
    }
  }

  async updateEmployee(id, data) {
    try {
      const existingEmployee = await this.getEmployeeById(id);
      //   if (existingEmployee === undefined) {
      //     throw ApiError.notFound("Employee not found");
      //   }

      if (data.phone) {
        // const hashedPhone = await this.hashPhone(data.phone);
        // const phoneCheckQuery = "SELECT * FROM employees WHERE phone = $1";
        // const phoneCheckResult = await pool.query(phoneCheckQuery, [
        //   hashedPhone,
        // ]);
        // const encryptedPhone = await this.encryptPhone(data.phone); // Encrypt the phone first
        // const phoneCheckQuery =
        //   "SELECT * FROM employees WHERE phone = $1 AND id != $2"; // Exclude the current employee
        // const phoneCheckResult = await pool.query(phoneCheckQuery, [
        //   encryptedPhone,
        //   id,
        // ]);

        // console.log("phoneCheckResult===", phoneCheckResult.rows);

        // if (phoneCheckResult.rows.length > 0) {
        //   throw ApiError.badRequest("Phone number must be unique");
        // }
        var encryptedPhone = await this.encryptPhone(data.phone);
        const phoneCheckQuery = "SELECT * FROM employees WHERE phone = $1";
        const phoneCheckResult = await pool.query(phoneCheckQuery, [
          encryptedPhone,
        ]);
        console.log("phoneCheckResult.rows---".phoneCheckResult?.rows);
        if (phoneCheckResult?.rows?.length > 0) {
          throw ApiError.badRequest("Phone number must be unique");
        }
        console.log("444444444444444444444444444444444");
      }
      console.log("555555555555555555");

      const updatedData = {
        department_id: data.department_id || existingEmployee.department_id,
        name: data.name || existingEmployee.name,
        dob: data.dob || existingEmployee.dob,
        phone: data.phone
          ? await this.encryptPhone(data.phone)
          : existingEmployee.phone,
        photo: data.photo || existingEmployee.photo,
        email: data.email || existingEmployee.email,
        salary: data.salary || existingEmployee.salary,
        status:
          data.status !== undefined ? data.status : existingEmployee.status,
      };

      const query = `
    UPDATE employees
    SET department_id = $1, name = $2, dob = $3, phone = $4, photo = $5, email = $6, salary = $7, status = $8, modified = CURRENT_TIMESTAMP
    WHERE id = $9 RETURNING *`;

      const values = [
        updatedData.department_id,
        updatedData.name,
        updatedData.dob,
        updatedData.phone,
        updatedData.photo,
        updatedData.email,
        updatedData.salary,
        updatedData.status,
        id,
      ];

      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      if (error.message === "Employee not found") {
        throw ApiError.notFound("Employee not found");
      }
      throw ApiError.internal("Failed to update employee");
    }
  }

  async deleteEmployee(id) {
    try {
      const existingEmployee = await this.getEmployeeById(id);

      const query = "DELETE FROM employees WHERE id = $1";
      await pool.query(query, [id]);
      return { message: "Employee deleted successfully" };
    } catch (error) {
      if (error.message === "Employee not found") {
        throw ApiError.notFound("Employee not found");
      }
      throw ApiError.internal("Failed to delete employee");
    }
  }

  async getEmployeeCountBySalaryRange(minSalary, maxSalary) {
    try {
      const query = `
        SELECT COUNT(*) AS count
        FROM employees
        WHERE salary >= $1 AND salary <= $2`;
      const values = [minSalary, maxSalary];

      const { rows } = await pool.query(query, values);

      return rows.length > 0 ? parseInt(rows[0].count, 10) : 0;
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  }

  async getEmployeeById(id) {
    try {
      const query = "SELECT * FROM employees WHERE id = $1";
      const { rows } = await pool.query(query, [id]);
      console.log("rows===", rows);
      if (rows.length === 0) {
        console.log("555555555555555555555555555555555555555555555");
        throw ApiError.notFound("Employee not found");
      }
      return rows[0];
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  }
}

module.exports = new EmployeeService();
