const { GraphQLJSON } = require("graphql-type-json");

module.exports = `#graphql
  scalar JSON

  type ApiResponse {
    success: Boolean!
    message: String!
    data: JSON
    errors: [FieldError!]
  }

  type FieldError {
    field: String
    message: String!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: String
    updated_at: String
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    login: String!     # username OR email
    password: String!
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String  # base64 or data-url
  }

  input EmployeeUpdateInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String  # base64 or data-url
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    login(input: LoginInput!): ApiResponse!
    getAllEmployees: ApiResponse!
    searchEmployeeByEid(eid: ID!): ApiResponse!
    searchEmployeeByDesignationOrDepartment(designation: String, department: String): ApiResponse!
  }

  type Mutation {
    signup(input: SignupInput!): ApiResponse!
    addEmployee(input: EmployeeInput!): ApiResponse!
    updateEmployeeByEid(eid: ID!, input: EmployeeUpdateInput!): ApiResponse!
    deleteEmployeeByEid(eid: ID!): ApiResponse!
  }
`;