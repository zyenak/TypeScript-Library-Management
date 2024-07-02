import React, { useState, useContext } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { useUser } from "../context/user-context";
import { Route, Routes, Navigate, Link, useNavigate } from "react-router-dom";
import AdbIcon from "@mui/icons-material/Adb";
import BooksList from "../containers/dashboard";
import { LoginDialog } from "../components/login/login-dialog";
import { BooksContext } from "../context/books-context";
import CustomForm, { FormField } from "../components/forms/custom-form";
import WithAdminProtector from "../middleware/admin-protector";
import { WithLoginProtector } from "../middleware/login-protector";
import withInputValidation from '../hoc/input-error-handling';

const AppLayout: React.FC = () => {
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { user, loginUser, logoutUser, addUser } = useUser();
  const { addBook, updateBook } = useContext(BooksContext);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLoginSubmit = (username: string, password: string) => {
    loginUser(username, password);
    setOpenLoginDialog(false);
  };

  const handleLoginClose = () => {
    setOpenLoginDialog(false);
  };

  const handleLogout = () => {
    logoutUser();
    handleCloseUserMenu();
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

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: "flex", mr: 1 }} />
            <Link to="/" style={{ textDecoration: "none", flexGrow: 1 }}>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: "flex",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "white",
                }}
              >
                Library Management System
              </Typography>
            </Link>
            <Box
              sx={{
                flexGrow: 0,
              }}
            >
              {user ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar>
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  onClick={() => {
                    setOpenLoginDialog(true);
                  }}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Routes>
        <Route path="/books" element={<BooksList />} />
        <Route
          path="/admin/books/add"
          element={
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
                  } }              />
              </WithAdminProtector>
            </WithLoginProtector>
          }
        />
        <Route
          path="/admin/users/add"
          element={
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
                  } }              />
              </WithAdminProtector>
            </WithLoginProtector>
          }
        />
        <Route
          path="/admin/books/:bookIsbn/edit"
          element={
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
                  } }               />
              </WithAdminProtector>
            </WithLoginProtector>
          }
        />
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
