# Employee Management System (GraphQL)

## Tech
Node.js, Express, Apollo GraphQL, MongoDB (Mongoose), JWT, Cloudinary

## Run
1) npm install
2) Create .env from .env.example
3) npm run dev
4) Open: http://localhost:4000/graphql

## Auth
- signup (Mutation) creates user
- login (Query) returns token
- Add/Get/Search/Update/Delete employees require Authorization header:
  Authorization: Bearer <token>

## Cloudinary Photo
Send employee_photo as base64 or data-url string in GraphQL variables.
Stored as secure_url in MongoDB.