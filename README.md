MAD9124 Mobile API Development

# Assignment 3 - JWT Authentication

## The brief

This is the third of three take home assignments related to building a backend web service to support a simple class list application called _cListR_.

In the previous assignments you built the base for the _cListR_ RESTful API using Node.js, the Express framework and MongoDB. For this assignment you will enhance that foundation with JWT based authentication.

In addition to correctly implementing all of the requirements from the previous assignment. The application will implement the following.

## Core Requirements

1. Create a new `/auth` router module that will support

- creating new users
- authenticating a user
- retrieving the currently logged-in user

Make sure to redact the user's password.

2. The user schema should have the following properties:
   | Property | Type | Required | Max Length | Default |
   | :-------- | :----- | :------- | ---------: | -------: |
   | firstName | String | true | 64 | |
   | lastName | String | true | 64 | |
   | email | String | true | 512 | |
   | password | String | true | 70 | |
   | isAdmin | Boolean | true | | false|

3. All API routes for the _students_ and _courses_ resource paths should only be accessible to authenticated users.

4. All `POST`, `PUT`, `PATCH`, and `DELETE` routes for both the _students_ and _courses_ resource paths should be limited to authenticated users with the `isAdmin` flag set to true.

5. Record each login attempt in an `authentication_attempts` collection in MongoDB. The properties of each attempt document should include:

| Property   | Type    | Required | Max Length |
| :--------- | :------ | :------- | ---------: |
| username   | String  | true     |         64 |
| ipAddress  | String  | true     |         64 |
| didSucceed | Boolean | true     |            |
| createdAt  | Date    | true     |            |

DO NOT store the password or the JWT.

6. Ensure that you write clean and readable code. Pay attention to:

- no runtime errors
- consistent 2 space indentation
- logical grouping of related code
- semantically descriptive names for variables and functions
- well organized project folder structure
- properly formatted `package.json` file
  - correct project name
  - your author details

## Logistics

- Clone this repo to your latptop.
- Build the project on your laptop.
- Test each route with Postman.
- Make git commits as you complete each requirement
- When everything is complete, push the final commit back up to GitHub and submit the GitHub repo's URL on Birghtspace.
