import React, { createContext, useState, FC, ReactNode, useContext } from "react";

// Define the book interface
export interface Book {
  isbn: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

// Define the context type
export interface BooksContextType {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  addBook: (newBook: Book) => void;
  updateBook: (updatedBook: Book) => void;
  deleteBook: (isbn: string) => void;
}

// Initialize context
export const BooksContext = createContext<BooksContextType>({
  books: [],
  setBooks: () => {},
  addBook: () => {},
  updateBook: () => {},
  deleteBook: () => {},
});

// Define BooksProvider component
export const BooksProvider: FC<{ children: ReactNode }> = ({ children }) => {
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

  const addBook = (newBook: Book) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  const updateBook = (updatedBook: Book) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.isbn === updatedBook.isbn ? updatedBook : book
      )
    );
  };

  const deleteBook = (isbn: string) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.isbn !== isbn));
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
