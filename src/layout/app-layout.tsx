import React, { useState } from "react";
import { useUser } from "../context/user-context";
import { createBrowserRouter, RouterProvider, Outlet, Navigate, Routes, Route } from 'react-router-dom';
import Dashboard from "../containers/dashboard";
import { LoginDialog } from "../components/login/login-dialog";
import WithAdminProtector from "../middleware/admin-protector";
import { WithLoginProtector } from "../middleware/login-protector";
import AppHeader from "../components/header/header";

import BookFormContainer from "../containers/add-book";
import UserFormContainer from "../containers/user-list";
import EditBookFormContainer from "../containers/edit-book";
import Welcome from "../containers/welcome";

const AppLayout: React.FC = () => {
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const { loginUser } = useUser();


  const handleLoginSubmit = (username: string, password: string) => {
    loginUser(username, password);
    setOpenLoginDialog(false);

  };

  const handleLoginClose = () => {
    setOpenLoginDialog(false);
  };


  // Define public and private routes as arrays

  const publicRoutes = [
    { path: "/", element: <Dashboard /> },
  ];
  
  const privateRoutes = [
    {
      path: "admin",
      element: (
        <WithLoginProtector>
          <WithAdminProtector>
            <Outlet />
          </WithAdminProtector>
        </WithLoginProtector>
      ),
      children: [
        { path: "books/add", element: <BookFormContainer /> },
        { path: "users/add", element: <UserFormContainer /> },
        { path: "books/:bookIsbn/edit", element: <EditBookFormContainer /> },
      ],
    },
  ];
  

return (
    <>
      <AppHeader onLoginClick={() => setOpenLoginDialog(true)} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* Public Routes */}
        {publicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        {/* Private Routes */}
        {privateRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element}>
            {route.children?.map((childRoute, childIndex) => (
              <Route key={childIndex} path={childRoute.path} element={childRoute.element} />
            ))}
          </Route>
        ))}
        {/* Default Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
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