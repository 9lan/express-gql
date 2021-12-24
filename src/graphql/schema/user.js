import { gql } from "apollo-server-express";

export default gql`
  enum UserRole {
    FINANCE
  }

	type User {
    id: String
    name: String
    email: String
    role: UserRole
    subRole: String
  }

	type LoginOK {
    user: User!
    token: String!
  }

  type RegisterOK {
    user: User!
  }

	type GetRefreshedTokenOK {
    token: String!
  }

	union LoginRes = LoginOK
  union RegisterRes = RegisterOK
  union GetRefreshedTokenRes = GetRefreshedTokenOK

	type Query {
		login(input: UserInput): LoginRes
	}

  type Mutation {
    signUpUser(input: UserInput): RegisterRes
  }

  input UserInput {
    email: String!
    password: String!
  }
`