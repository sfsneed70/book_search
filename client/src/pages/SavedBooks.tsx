// import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { removeBookId } from "../utils/localStorage";

// import { getMe, deleteBook } from "../utils/API";
import Auth from "../utils/auth";
// import type { User } from "../models/U

import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { DELETE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
  // const [userData, setUserData] = useState({
  //   username: "",
  //   // email: "",
  //   // password: "",
  //   savedBooks: [],
  // });

  // const [savedBookIds, setSavedBookIds] = useState<string[]>([]);

  // const savedBookIdsLength = savedBookIds.length;

  const { loading, data } = useQuery(GET_ME);

  const [deleteBook, error] = useMutation(DELETE_BOOK, {
    refetchQueries: [GET_ME, "me"],
  });

refetchQueries: [GET_ME, "me"];

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  // useEffect(() => {
  //   return () => saveBookIds(savedBookIds);
  // });

  // setUserData(data?.me || {});
  const userData = data?.me || {};
  //   // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteBook({
        variables: { bookId },
      });
      removeBookId(bookId);
    } catch (err) {
      console.error(error);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
