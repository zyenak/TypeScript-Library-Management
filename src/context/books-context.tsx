import React, { createContext, useState, FC, ReactNode } from "react";
import { useSnackbar } from "./snackbar-context";
import { useErrorBoundary } from 'react-error-boundary';


export interface Book {
  isbn: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface BooksContextType {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  addBook: (newBook: Book) => void;
  updateBook: (updatedBook: Book) => void;
  deleteBook: (isbn: string) => void;
}


export const BooksContext = createContext<BooksContextType>({
  books: [],
  setBooks: () => {},
  addBook: () => {},
  updateBook: () => {},
  deleteBook: () => {},
});


export const BooksProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { showMessage } = useSnackbar()
  const { showBoundary } = useErrorBoundary();
  const [books, setBooks] = useState<Book[]>([
    {
      isbn: "123456789",
      name: "Sample Book 1",
      category: "Sci-Fi",
      price: 15,
      quantity: 10,
    },
    {
      isbn: "987654321",
      name: "Sample Book 2",
      category: "Fantasy",
      price: 20,
      quantity: 8,
    },
    // Add more mock books as needed
  ]);


  const handleExplode = () => {
    try {
        throw new Error('💥 KABOOM 💥');
    } catch (error) {
        showBoundary(error);
    }
};

  const addBook = (newBook: Book) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
    showMessage("New Book Added Successfully");
  };

  const updateBook = (updatedBook: Book) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.isbn === updatedBook.isbn ? updatedBook : book
      )
    );
    showMessage("Book Updated Successfully");
  };

  const deleteBook = (isbn: string) => {
    // setBooks((prevBooks) => prevBooks.filter((book) => book.isbn !== isbn));
    // showMessage("Book Deleted Successfully");
    handleExplode();
  };

  const contextValue: BooksContextType = {
    books,
    setBooks,
    addBook,
    updateBook,
    deleteBook,
  };

  return (
    <BooksContext.Provider value={contextValue}>
      {children}
    </BooksContext.Provider>
  );
};
