import React, { useState, useContext } from "react";
import { useUser } from "../context/user-context";
import { Route, Routes, Navigate, Link, useNavigate } from "react-router-dom";
import BooksList from "../containers/dashboard";
import { LoginDialog } from "../components/login/login-dialog";
import { BooksContext } from "../context/books-context";
import CustomForm, { FormField } from "../components/forms/custom-form";
import WithAdminProtector from "../middleware/admin-protector";
import { WithLoginProtector } from "../middleware/login-protector";
import withInputValidation from '../hoc/input-error-handling';
import AppHeader from "../components/header/header";

const AppLayout: React.FC = () => {
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const { user, loginUser, addUser } = useUser();
  const { addBook, updateBook } = useContext(BooksContext);
  const navigate = useNavigate();


  const handleLoginSubmit = (username: string, password: string) => {
    loginUser(username, password);
    setOpenLoginDialog(false);
  };

  const handleLoginClose = () => {
    setOpenLoginDialog(false);
  };


  const handleUserSubmit = (data: any, toUpdate: boolean) => {
    addUser(data);
    navigate("/users");
  };

  const handleBookSubmit = (data: any, toUpdate: boolean) => {
    if (toUpdate) {
      updateBook(data);
    } else {
      addBook(data);
    }
    navigate("/books");
  };

  const initialBookState = {
    name: "",
    isbn: "",
    category: "",
    price: 0,
    quantity: 0,
  };

  const initialUserState = {
    username: "",
    password: "",
    role: "user",
  };

  const bookFields: FormField[] = [
    { label: "Name", name: "name", type: "text", required: true },
    { label: "ISBN", name: "isbn", type: "text", required: true },
    { label: "Category", name: "category", type: "select", required: true, options: ["Sci-Fi", "Action", "Adventure", "Horror", "Romance", "Mystery", "Thriller", "Drama", "Fantasy", "Comedy"] },
    { label: "Price", name: "price", type: "number", required: true },
    { label: "Quantity", name: "quantity", type: "number", required: true },
  ];

  const userFields: FormField[] = [
    { label: "Username", name: "username", type: "text", required: true },
    { label: "Password", name: "password", type: "password", required: true },
    { label: "Role", name: "role", type: "text", required: true },
  ];

  // Wrap CustomForm with withInputValidation HOC
  const ValidatedBookForm = withInputValidation(CustomForm);
  const ValidatedUserForm = withInputValidation(CustomForm);



  const publicRoutes = [
    { path: "/books", element: <BooksList /> },
  ];

  const privateRoutes = [
    {
      path: "/admin/books/add",
      element: (
        <WithLoginProtector>
          <WithAdminProtector>
            <ValidatedBookForm
              formType="book"
              initialData={initialBookState}
              toUpdate={false}
              onSubmit={handleBookSubmit}
              fields={bookFields}
              validateForm={function (formData: any, fields: FormField[]): boolean {
                throw new Error("Function not implemented.");
              }}
              errors={undefined}
            />
          </WithAdminProtector>
        </WithLoginProtector>
      ),
    },
    {
      path: "/admin/users/add",
      element: (
        <WithLoginProtector>
          <WithAdminProtector>
            <ValidatedUserForm
              formType="user"
              initialData={initialUserState}
              toUpdate={false}
              onSubmit={handleUserSubmit}
              fields={userFields}
              validateForm={function (formData: any, fields: FormField[]): boolean {
                throw new Error("Function not implemented.");
              }}
              errors={undefined}
            />
          </WithAdminProtector>
        </WithLoginProtector>
      ),
    },
    {
      path: "/admin/books/:bookIsbn/edit",
      element: (
        <WithLoginProtector>
          <WithAdminProtector>
            <ValidatedBookForm
              formType="book"
              initialData={initialBookState}
              toUpdate={true}
              onSubmit={handleBookSubmit}
              fields={bookFields}
              validateForm={function (formData: any, fields: FormField[]): boolean {
                throw new Error("Function not implemented.");
              }}
              errors={undefined}
            />
          </WithAdminProtector>
        </WithLoginProtector>
      ),
    },
  ];

  return (
    <>
      <AppHeader onLoginClick={() => setOpenLoginDialog(true)} />
      <Routes>
        {publicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        {privateRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<Navigate to="/books" replace />} />
      </Routes>
      <LoginDialog
        open={openLoginDialog}
        handleSubmit={handleLoginSubmit}
        handleClose={handleLoginClose}
      />
    </>
  );
};

export default AppLayout;
