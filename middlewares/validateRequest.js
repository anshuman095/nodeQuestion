const Joi = require("joi");

const employeeSchema = Joi.object({
  department_id: Joi.number().integer().required().messages({
    "number.base": "Department ID must be a number",
    "any.required": "Department ID is required",
  }),
  name: Joi.string().min(1).max(255).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "any.required": "Name is required",
  }),
//   dob: Joi.date().iso().required().messages({
//     "date.base": "Date of Birth must be a valid date",
//     "date.format": "Date of Birth must be in ISO format (YYYY-MM-DD)",
//     "any.required": "Date of Birth is required",
//   }),
dob: Joi.alternatives().try(Joi.date().iso(), Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/)).required().messages({
    "date.base": "Date of Birth must be a valid date",
    "any.required": "Date of Birth is required",
  }),
  phone: Joi.string().required().messages({
    "string.base": "Phone must be a string",
    "any.required": "Phone is required",
  }),
  photo: Joi.string().required().messages({
    "string.base": "Photo must be a string",
    "any.required": "Photo is required",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  salary: Joi.number().greater(0).required().messages({
    "number.base": "Salary must be a number",
    "number.greater": "Salary must be greater than 0",
    "any.required": "Salary is required",
  }),
  status: Joi.boolean().optional(),
});

const validateEmployee = (data) => {
  return employeeSchema.validate(data, { abortEarly: false, convert: false });
};

const updateEmployeeSchema = Joi.object({
    department_id: Joi.number().integer().optional().messages({
      "number.base": "Department ID must be a number",
    }),
    name: Joi.string().min(1).max(255).optional().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
    }),
    // dob: Joi.date().optional().messages({
    //   "date.base": "Date of Birth must be a valid date",
    // }),
    dob: Joi.alternatives().try(Joi.date().iso(), Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/)).messages({
        "date.base": "Date of Birth must be a valid date",
      }),
    phone: Joi.string().optional().messages({
      "string.base": "Phone must be a string",
    }),
    photo: Joi.string().optional().messages({
      "string.base": "Photo must be a string",
    }),
    email: Joi.string().email().optional().messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email",
    }),
    salary: Joi.number().greater(0).optional().messages({
      "number.base": "Salary must be a number",
      "number.greater": "Salary must be greater than 0",
    }),
    status: Joi.boolean().optional(),
  });
  
  const validateUpdateEmployee = (data) => {
    return updateEmployeeSchema.validate(data, { abortEarly: false, convert: false });
  };

const departmentSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "any.required": "Name is required",
  }),
  status: Joi.boolean().optional(),
});

const validateDepartment = (data) => {
  return departmentSchema.validate(data, { abortEarly: false });
};

module.exports = { validateEmployee, validateUpdateEmployee, validateDepartment };
