const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Employee = require("../models/Employee");

const { requireAuth } = require("../middleware/auth");
const { ok, fail } = require("../utils/response");
const {
  throwValidationError,
  throwNotFound,
  throwServerError
} = require("../utils/errors");

const {
  validateSignup,
  validateLogin,
  validateEmployee
} = require("../utils/validators");

const { uploadBase64Image } = require("../services/uploadService");

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
  return jwt.sign(
    { id: user._id.toString(), username: user.username, email: user.email },
    secret,
    { expiresIn }
  );
}

module.exports = {
  Query: {
    // 2) Login (Query)
    login: async (_, { input }) => {
      const errors = validateLogin(input);
      if (errors.length) return fail("Validation failed", errors);

      const { login, password } = input;

      const user = await User.findOne({
        $or: [{ username: login }, { email: login }]
      });

      if (!user) return fail("Invalid credentials", [{ field: "login", message: "User not found" }]);

      const match = await bcrypt.compare(password, user.password);
      if (!match) return fail("Invalid credentials", [{ field: "password", message: "Wrong password" }]);

      const token = signToken(user);

      return ok("Login successful", {
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    },

    // 3) Get all employees (Query) [JWT Protected]
    getAllEmployees: async (_, __, context) => {
      requireAuth(context);

      const employees = await Employee.find().sort({ created_at: -1 });
      return ok("Employees fetched successfully", employees);
    },

    // 5) Search employee by eid (Query) [JWT Protected]
    searchEmployeeByEid: async (_, { eid }, context) => {
      requireAuth(context);

      const emp = await Employee.findById(eid);
      if (!emp) return fail("Employee not found", [{ field: "eid", message: "No employee with this id" }]);

      return ok("Employee fetched successfully", emp);
    },

    // 8) Search by designation or department (Query) [JWT Protected]
    searchEmployeeByDesignationOrDepartment: async (_, { designation, department }, context) => {
      requireAuth(context);

      if (!designation && !department) {
        return fail("Validation failed", [
          { field: "designation/department", message: "Provide designation or department." }
        ]);
      }

      const filter = {};
      if (designation) filter.designation = new RegExp(designation, "i");
      if (department) filter.department = new RegExp(department, "i");

      const list = await Employee.find(filter).sort({ created_at: -1 });
      return ok("Employees fetched successfully", list);
    }
  },

  Mutation: {
    // 1) Signup (Mutation)
    signup: async (_, { input }) => {
      const errors = validateSignup(input);
      if (errors.length) return fail("Validation failed", errors);

      const { username, email, password } = input;

      const exists = await User.findOne({ $or: [{ username }, { email }] });
      if (exists) {
        return fail("User already exists", [
          { field: "username/email", message: "Username or email already in use." }
        ]);
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashed });

      return ok("Signup successful", {
        _id: user._id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
      });
    },

    // 4) Add new employee (Mutation) + Cloudinary [JWT Protected]
    addEmployee: async (_, { input }, context) => {
      requireAuth(context);

      const errors = validateEmployee(input, { partial: false });
      if (errors.length) return fail("Validation failed", errors);

      // Upload photo if present
      let photoUrl = "";
      if (input.employee_photo) {
        photoUrl = await uploadBase64Image(input.employee_photo);
      }

      try {
        const created = await Employee.create({
          ...input,
          employee_photo: photoUrl || ""
        });

        return ok("Employee created successfully", created);
      } catch (e) {
        // duplicate email etc.
        return fail("Failed to create employee", [{ field: "employee", message: e.message }]);
      }
    },

    // 6) Update employee by eid (Mutation) [JWT Protected]
    updateEmployeeByEid: async (_, { eid, input }, context) => {
      requireAuth(context);

      const errors = validateEmployee(input, { partial: true });
      if (errors.length) return fail("Validation failed", errors);

      const existing = await Employee.findById(eid);
      if (!existing) return fail("Employee not found", [{ field: "eid", message: "No employee with this id" }]);

      // Upload new photo if provided
      if (input.employee_photo) {
        input.employee_photo = await uploadBase64Image(input.employee_photo);
      }

      try {
        const updated = await Employee.findByIdAndUpdate(
          eid,
          { $set: input },
          { new: true, runValidators: true }
        );

        return ok("Employee updated successfully", updated);
      } catch (e) {
        return fail("Failed to update employee", [{ field: "employee", message: e.message }]);
      }
    },

    // 7) Delete employee by eid (Mutation) [JWT Protected]
    deleteEmployeeByEid: async (_, { eid }, context) => {
      requireAuth(context);

      const emp = await Employee.findById(eid);
      if (!emp) return fail("Employee not found", [{ field: "eid", message: "No employee with this id" }]);

      await Employee.findByIdAndDelete(eid);
      return ok("Employee deleted successfully", { deletedId: eid });
    }
  }
};