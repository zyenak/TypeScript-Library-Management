import React, { createContext, useState, useEffect, useContext } from "react";
import { BooksContext, BooksContextType, Book } from "./books-context";
import { useSnackbar } from "./snackbar-context";


export interface User {
  username: string;
  password: string;
  role: string;
  borrowedBooks: Book[];
}

const mockUsers: User[] = [
  { username: "admin", password: "admin", role: "admin", borrowedBooks: [] },
  { username: "user", password: "user", role: "user", borrowedBooks: [] },
];


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
  borrowedBooks: Book[];
  setBorrowedBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}


export const UserContext = createContext<UserContextType | undefined>(undefined);


export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const { books, setBooks } = useContext<BooksContextType>(BooksContext);
  const { showMessage } = useSnackbar();

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
  }, [user]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      setUser(storedUser);
      setBorrowedBooks(storedUser.borrowedBooks || []);
    }
  }, []);


  const loginUser = (username: string, password: string) => {
    const foundUser = users.find((user) => user.username === username && user.password === password);
    if (foundUser) {
      showMessage("Logged in successfully");
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      setBorrowedBooks(foundUser.borrowedBooks || []);
    } else {
      showMessage("Invalid credentials");
    }
  };

  const logoutUser = () => {
    setUser(null);
    setBorrowedBooks([]);
    localStorage.removeItem("user");
    showMessage("Logged out successfully");
  };

  const borrowBook = (isbn: string) => {
    const bookToBorrow = books.find((book: Book) => book.isbn === isbn);
    if (bookToBorrow && bookToBorrow.quantity > 0) {
      const updatedBook = { ...bookToBorrow, quantity: bookToBorrow.quantity - 1 };
      setBooks((prevBooks: Book[]) =>
        prevBooks.map((book: Book) =>
          book.isbn === isbn ? updatedBook : book
        )
      );

      setUser((prevUser: User | null) => {
        const updatedBorrowedBooks = [...(prevUser?.borrowedBooks || []), bookToBorrow];
        setBorrowedBooks(updatedBorrowedBooks);

        const updatedUser = { ...prevUser!, borrowedBooks: updatedBorrowedBooks };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        const updatedMockUsers = users.map((user) =>
          user.username === prevUser?.username ? updatedUser : user
        );
        setUsers(updatedMockUsers);
        return updatedUser;
      });
      showMessage("Book borrowed successfully");
    } else {
      showMessage("Book not available for borrowing");
    }
  };

  const returnBook = (isbn: string) => {
    const indexToRemove = borrowedBooks.findIndex((book) => book.isbn === isbn);
    if (indexToRemove !== -1) {
      setBooks((prevBooks: Book[]) =>
        prevBooks.map((book: Book) =>
          book.isbn === isbn
            ? { ...book, quantity: book.quantity + 1 }
            : book
        )
      );

      const updatedBorrowedBooks = [...borrowedBooks];
      updatedBorrowedBooks.splice(indexToRemove, 1);
      setBorrowedBooks(updatedBorrowedBooks);

      setUser((prevUser: User | null) => {
        const updatedUser = { ...prevUser!, borrowedBooks: updatedBorrowedBooks };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        const updatedMockUsers = users.map((user) =>
          user.username === prevUser?.username ? updatedUser : user
        );
        setUsers(updatedMockUsers);
        return updatedUser;
      });

      showMessage("Book returned successfully");
    } else {
      showMessage("Book not found in borrowed list");
    }
  };


  const addUser = (newUser: User) => {
    const isDuplicate = users.some((user) => user.username === newUser.username);
    if (isDuplicate) {
      showMessage("Username already exists");
      return;
    }

    setUsers((prevUsers) => [...prevUsers, newUser]);
    showMessage("User added successfully");
  };

  const deleteUser = (username: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
    showMessage("User deleted successfully");
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
    </UserContext.Provider>
  );
};
