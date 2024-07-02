import React, { useState, useEffect, ChangeEvent, FormEvent, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { BooksContext } from "../../context/books-context";

export type FormField =
  | { label: string; name: string; type: "text" | "number" | "password"; required: boolean; options?: undefined }
  | { label: string; name: string; type: "select"; required: boolean; options: string[] };

interface CustomFormProps {
  formType: "book" | "user";
  initialData: any;
  toUpdate: boolean;
  onSubmit: (data: any, toUpdate: boolean) => void; // Remove bookIsbn parameter from onSubmit
  fields: FormField[];
}

const CustomForm: React.FC<CustomFormProps> = ({ formType, initialData, toUpdate, onSubmit, fields }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<any>({});
  const { books } = useContext(BooksContext);
  const navigate = useNavigate();
  const { bookIsbn } = useParams<{ bookIsbn?: string }>(); // Make bookIsbn optional

  useEffect(() => {
    setFormData(initialData);
    if (toUpdate && bookIsbn) {
      const bookToEdit = books.find((b) => b.isbn === bookIsbn);
      if (bookToEdit) {
        setFormData(bookToEdit);
      } else {
        setFormData(initialData);
      }
    }
  }, [initialData, bookIsbn, toUpdate]);

  const validateForm = (event: ChangeEvent<{ name: string; value: string }>) => {
    const { name, value } = event.target;
    const field = fields.find((f) => f.name === name);
    if (field?.required && !value.trim()) {
      setErrors((prevErrors: any) => ({ ...prevErrors, [name]: `${field.label} can't be empty` }));
    } else if (field?.type === "number" && isNaN(Number(value))) {
      setErrors((prevErrors: any) => ({ ...prevErrors, [name]: "Only numbers are allowed" }));
    } else {
      setErrors((prevErrors: any) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const formSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formData, toUpdate);
    navigate("/books");
  };

  const handleChange = (event: ChangeEvent<{ name: string; value: string }>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const isInvalid = fields.some((field) => {
    const value = formData[field.name];
    return field.required && (!value || typeof value !== 'string' || value.trim() === '');
  });

  return (
    <Container component={Paper} className={classes.wrapper}>
      <Typography className={classes.pageHeader} variant="h5">
        {formType === "book" ? (bookIsbn ? "Update Book" : "Add Book") : "Add User"}
      </Typography>
      <form noValidate autoComplete="off" onSubmit={formSubmit}>
        <FormGroup>
          {fields.map((field) => (
            <FormControl className={classes.mb2} key={field.name}>
              {field.type === "select" ? (
                <>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange as (event: SelectChangeEvent<string>) => void}
                    required={field.required}
                  >
                    {field.options?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              ) : (
                <TextField
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onBlur={validateForm}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                />
              )}
            </FormControl>
          ))}
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
            disabled={formType === "book" && !bookIsbn ? isInvalid : false}
          >
            {formType === "book" ? (bookIsbn ? "Update Book" : "Add Book") : "Add User"}
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default CustomForm;
