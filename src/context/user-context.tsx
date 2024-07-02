import React, { createContext, useState, useEffect, useContext } from "react";
import { Snackbar } from "@mui/material";
import { BooksContext, BooksContextType } from "./books-context";

// Define the user interface
export interface User {
  username: string;
  password: string;
  role: string;
  borrowedBooks?: any[]; // Assuming borrowedBooks is an array of any type
}

// Define mock users
const mockUsers: User[] = [
  { username: "admin", password: "admin", role: "admin" },
  { username: "user", password: "user", role: "user" },
  // Add more mock users as needed
];

// Define the context type
interface UserContextType {
  user: User | null;
  users: User[];
  isAdmin: boolean;
  loginUser: (username: string, password: string) => void;
  logoutUser: () => void;
  borrowBook: (isbn: string) => void;
  returnBook: (isbn: string) => void;
  addUser: (newUser: User) => void;
  deleteUser: (username: string) => void;
  borrowedBooks: any[]; // Assuming borrowedBooks is an array of any type
  setBorrowedBooks: React.Dispatch<React.SetStateAction<any[]>>;
}

// Create context
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// UserProvider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers); // Using mockUsers
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const { books, setBooks } = useContext<BooksContextType>(BooksContext); // Access books and setBooks from BooksContext

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
  }, [user]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const loginUser = (username: string, password: string) => {
    const foundUser = users.find(
      (user) => user.username === username && user.password === password
    );
    if (foundUser) {
      setSnackbarMessage("Logged in successfully");
      setSnackbarOpen(true);
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
    } else {
      setSnackbarMessage("Invalid credentials");
      setSnackbarOpen(true);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setBorrowedBooks([]); // Clear borrowed books on logout
    localStorage.removeItem("user");
    setSnackbarMessage("Logged out successfully");
    setSnackbarOpen(true);
  };

  const borrowBook = (isbn: string) => {
    const bookToBorrow = books.find((book: any) => book.isbn === isbn);
    if (bookToBorrow && bookToBorrow.quantity > 0) {
      // Update book availability
      const updatedBook = { ...bookToBorrow, quantity: bookToBorrow.quantity - 1 };
      setBooks((prevBooks: any) =>
        prevBooks.map((book: any) =>
          book.isbn === isbn ? updatedBook : book
        )
      );
      // Update borrowed books for the user
      setUser((prevUser: any) => {
        const updatedBorrowedBooks = [...(prevUser.borrowedBooks || []), bookToBorrow];
        setBorrowedBooks(updatedBorrowedBooks);
        return { ...prevUser, borrowedBooks: updatedBorrowedBooks };
      });
      setSnackbarMessage("Book borrowed successfully");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Book not available for borrowing");
      setSnackbarOpen(true);
    }
  };

  const returnBook = (isbn: string) => {
    const bookToReturn = borrowedBooks.find((book) => book.isbn === isbn);
    if (bookToReturn) {
      setBooks((prevBooks: any) =>
        prevBooks.map((book: any) =>
          book.isbn === isbn
            ? { ...book, quantity: book.quantity + 1 }
            : book
        )
      );

      const updatedBorrowedBooks = borrowedBooks.filter((book) => book.isbn !== isbn);
      setBorrowedBooks(updatedBorrowedBooks);

      setUser((prevUser: any) => {
        const updatedUser = {
          ...prevUser,
          borrowedBooks: updatedBorrowedBooks,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      });

      setSnackbarMessage("Book returned successfully");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Book not found in borrowed list");
      setSnackbarOpen(true);
    }
  };

  const addUser = (newUser: User) => {
    // Ensure username is unique
    const isDuplicate = users.some((user) => user.username === newUser.username);
    if (isDuplicate) {
      setSnackbarMessage("Username already exists");
      setSnackbarOpen(true);
      return;
    }

    // Add new user to the users array
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setSnackbarMessage("User added successfully");
    setSnackbarOpen(true);
  };

  const deleteUser = (username: string) => {
    // Filter out the user with matching userId
    setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
    setSnackbarMessage("User deleted successfully");
    setSnackbarOpen(true);
  };

  const contextValue: UserContextType = {
    user,
    users,
    isAdmin,
    loginUser,
    logoutUser,
    borrowBook,
    returnBook,
    borrowedBooks,
    setBorrowedBooks,
    addUser,
    deleteUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </UserContext.Provider>
  );
};
