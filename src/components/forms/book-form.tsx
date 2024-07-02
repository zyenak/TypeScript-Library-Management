import React, { useState, useEffect, useContext, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Paper,
  Container,
  Button,
  TextField,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import classes from "./styles.module.css";
import { BooksContext, Book } from "../../context/books-context";

interface Errors {
  name: string;
  isbn: string;
  category: string;
  price: string;
  quantity: string;
}

const BookForm: React.FC = () => {
  const { bookIsbn } = useParams();
  const navigate = useNavigate();
  const { books, setBooks, addBook, updateBook } = useContext(BooksContext);

  const initialBookState: Book = {
    name: "",
    isbn: bookIsbn || "",
    category: "",
    price: 0,
    quantity: 0,
  };

  const [book, setBook] = useState<Book>(initialBookState);
  const [errors, setErrors] = useState<Errors>({
    name: "",
    isbn: "",
    category: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    if (bookIsbn) {
      const foundBook = books.find((b) => b.isbn === bookIsbn);
      if (foundBook) {
        setBook(foundBook);
      } else {
        navigate("/books");
      }
    }
  }, [bookIsbn, books, navigate]);

  const isInvalid =
    book.name.trim() === "" ||
    book.isbn.trim() === "" ||
    book.category.trim() === "";

  const formSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isInvalid) {
      if (bookIsbn) {
        updateBook(book);
      } else {
        addBook(book);
      }
      navigate("/books");
    }
  };

  const updateBookField = (event: SelectChangeEvent) => {
    const { value } = event.target;
    setBook({ ...book, category: value as string });
  };
  
  const validateForm = (event: ChangeEvent<{ name: string; value: string }>) => {
    const { name, value } = event.target;
    if (["name", "isbn", "category"].includes(name)) {
      if (!value.trim().length) {
        setErrors({ ...errors, [name]: `${name} can't be empty` });
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    }
    if (["price", "quantity"].includes(name)) {
      if (isNaN(Number(value))) {
        setErrors({ ...errors, [name]: "Only numbers are allowed" });
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  return (
    <>
      <Container component={Paper} className={classes.wrapper}>
        <Typography className={classes.pageHeader} variant="h5">
          {bookIsbn ? "Update Book" : "Add Book"}
        </Typography>
        <form noValidate autoComplete="off" onSubmit={formSubmit}>
          <FormGroup>
            <FormControl className={classes.mb2}>
              <TextField
                label="Name"
                name="name"
                required
                value={book.name}
                onChange={(e) => setBook({ ...book, name: e.target.value })}
                onBlur={validateForm}
                error={errors.name.length > 0}
                helperText={errors.name}
              />
            </FormControl>
            <FormControl className={classes.mb2}>
              <TextField
                label="ISBN"
                name="isbn"
                required
                value={book.isbn}
                onChange={(e) => setBook({ ...book, isbn: e.target.value })}
                onBlur={validateForm}
                error={errors.isbn.length > 0}
                helperText={errors.isbn}
              />
            </FormControl>
            <FormControl className={classes.mb2}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={book.category}
                onChange={(e: SelectChangeEvent) => updateBookField(e)}
                required
              >
                <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
                <MenuItem value="Action">Action</MenuItem>
                <MenuItem value="Adventure">Adventure</MenuItem>
                <MenuItem value="Horror">Horror</MenuItem>
                <MenuItem value="Romance">Romance</MenuItem>
                <MenuItem value="Mystery">Mystery</MenuItem>
                <MenuItem value="Thriller">Thriller</MenuItem>
                <MenuItem value="Drama">Drama</MenuItem>
                <MenuItem value="Fantasy">Fantasy</MenuItem>
                <MenuItem value="Comedy">Comedy</MenuItem>
              </Select>
            </FormControl>
            <FormControl className={classes.mb2}>
              <TextField
                label="Price"
                name="price"
                required
                value={book.price}
                onChange={(e) => setBook({ ...book, price: Number(e.target.value) })}
                onBlur={validateForm}
                error={errors.price.length > 0}
                helperText={errors.price}
              />
            </FormControl>
            <FormControl className={classes.mb2}>
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={book.quantity}
                onChange={(e) => setBook({ ...book, quantity: Number(e.target.value) })}
                onBlur={validateForm}
                error={errors.quantity.length > 0}
                helperText={errors.quantity}
              />
            </FormControl>
          </FormGroup>
          <div className={classes.btnContainer}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isInvalid}
            >
              {bookIsbn ? "Update Book" : "Add Book"}
            </Button>
          </div>
        </form>
      </Container>
    </>
  );
};

export default BookForm;
