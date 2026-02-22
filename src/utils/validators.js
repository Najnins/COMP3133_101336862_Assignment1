const { isEmail } = require("validator");

function validateSignup(input) {
  const errors = [];

  if (!input.username || input.username.trim().length < 3) {
    errors.push({ field: "username", message: "Username must be at least 3 characters." });
  }
  if (!input.email || !isEmail(input.email)) {
    errors.push({ field: "email", message: "Valid email is required." });
  }
  if (!input.password || input.password.length < 6) {
    errors.push({ field: "password", message: "Password must be at least 6 characters." });
  }

  return errors;
}

function validateLogin(input) {
  const errors = [];
  if (!input.login || input.login.trim().length === 0) {
    errors.push({ field: "login", message: "Username or email is required." });
  }
  if (!input.password || input.password.trim().length === 0) {
    errors.push({ field: "password", message: "Password is required." });
  }
  return errors;
}

function validateEmployee(input, { partial = false } = {}) {
  const errors = [];

  function req(field, msg) {
    if (!partial && (!input[field] || String(input[field]).trim().length === 0)) {
      errors.push({ field, message: msg });
    }
  }

  req("first_name", "first_name is required.");
  req("last_name", "last_name is required.");
  req("designation", "designation is required.");
  req("department", "department is required.");

  if (!partial || input.email !== undefined) {
    if (!input.email || !isEmail(input.email)) {
      errors.push({ field: "email", message: "Valid email is required." });
    }
  }

  if (!partial || input.salary !== undefined) {
    const salary = Number(input.salary);
    if (Number.isNaN(salary) || salary < 1000) {
      errors.push({ field: "salary", message: "Salary must be a number and >= 1000." });
    }
  }

  if (!partial || input.date_of_joining !== undefined) {
    const d = new Date(input.date_of_joining);
    if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
      errors.push({ field: "date_of_joining", message: "date_of_joining must be a valid date." });
    }
  }

  if (!partial || input.gender !== undefined) {
    if (input.gender && !["Male", "Female", "Other"].includes(input.gender)) {
      errors.push({ field: "gender", message: "gender must be Male/Female/Other." });
    }
  }

  return errors;
}

module.exports = { validateSignup, validateLogin, validateEmployee };