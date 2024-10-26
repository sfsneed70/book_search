import { gql } from "@apollo/client";

export const GET_ME = gql`
  query me {
    me {
      savedBooks {
        title
        image
        description
        bookId
        authors
      }
    }
  }
`;
