const gql = String.raw;

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
    bookCount: Int
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
    savedBooks: [BookInput]
  }

  type Book {
    bookId: ID
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }

  input BookInput {
    authors: [String]
    description: String
    title: String!
    bookId: String!
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    # users: [User]
    me: User
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    saveBook( input: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;
