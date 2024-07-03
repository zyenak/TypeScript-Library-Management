import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BooksContext } from "../context/books-context";
import CustomForm, { FormField } from "../components/forms/custom-form";
import WithAdminProtector from "../middleware/admin-protector";
import { WithLoginProtector } from "../middleware/login-protector";
import withInputValidation from '../hoc/input-error-handling';

const BookFormContainer: React.FC = () => {
  const { addBook, updateBook } = useContext(BooksContext);
  const navigate = useNavigate();

  const handleBookSubmit = (data: any) => {
    console.log({data})
    if (data.toUpdate) {
      updateBook(data);
    } else {
      addBook(data);
    }
    navigate("/");
  };

  const bookFields: FormField[] = [
    { label: "Name", name: "name", type: "text", required: true },
    { label: "ISBN", name: "isbn", type: "text", required: true },
    { label: "Category", name: "category", type: "select", required: true, options: ["Sci-Fi", "Action", "Adventure", "Horror", "Romance", "Mystery", "Thriller", "Drama", "Fantasy", "Comedy"] },
    { label: "Price", name: "price", type: "number", required: true },
    { label: "Quantity", name: "quantity", type: "number", required: true },
  ];

  // Wrap CustomForm with withInputValidation HOC
  const ValidatedBookForm = withInputValidation(CustomForm);

  // Define initialData internally
  const initialData = {
    name: "",
    isbn: "",
    category: "",
    price: 0,
    quantity: 0,
    toUpdate: false,
  };

  return (
    // <WithLoginProtector>
    //   <WithAdminProtector>
        <ValidatedBookForm
          formType="book"
          initialData={initialData}
          toUpdate={false}
          onSubmit={handleBookSubmit}
          fields={bookFields}
          validateForm={function (formData: any, fields: FormField[]): boolean {
            throw new Error("Function not implemented.");
          }}
   
        />
    //   </WithAdminProtector>
    // </WithLoginProtector>
  );
};

export default BookFormContainer;
