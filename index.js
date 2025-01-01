const express = require("express");
const fs = require("fs");
const path = require("path");
const pool = require("./config/db");
const app = express();
const empployeeRoute = require("./routes/employeeRoute");
const departmentRoute = require("./routes/departmentRoute");
const errorHandler = require("./middlewares/errorHandler");
const ApiError = require("./utils/apiError");
const Messages = require("./utils/messages");

app.use(express.json());

app.use("/api/employee", empployeeRoute);
app.use("/api/department", departmentRoute);
app.use((req, res, next) => {
  next(ApiError.notFound(Messages.URL_NOT_FOUND));
});
app.use(errorHandler);

const port = 5000;

const setupDatabase = async () => {
  const sqlPath = path.join(__dirname, "models/dbSetup.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  try {
    await pool.query(sql);
    console.log("Database setup completed successfully");
  } catch (err) {
    console.error("Error setting up database:", err);
  }
};

setupDatabase();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
