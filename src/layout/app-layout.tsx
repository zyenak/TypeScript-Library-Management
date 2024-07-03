import React, { useState } from "react";
import { useUser } from "../context/user-context";
import { Route, Routes, Navigate, Link, Outlet } from "react-router-dom";
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
  const privateRoutes = [
    { path: "admin", element: <Dashboard /> },
    { path: "books", element: <Outlet />, 
      children: [
        { path: "", element: <Dashboard /> }, 
        { path: "add", element: <BookFormContainer /> }, 
        { path: ":bookIsbn", element: <Outlet />, 
          children: [
            { path: "edit", element: <EditBookFormContainer /> },
          ]
        },
      ]
    },
    { path: "books", element: <Outlet />, 
      children: [
        { path: "", element: <Dashboard /> }, 
      ]
    }
  ];

  const RouteComponent = () => (
    <>
      <Outlet />
    </>
  )
  const pv = [
    {
      path: "admin",
      element: (
        <RouteComponent />
      ),
      subroutes: [
        { path: "books", element: <Dashboard /> },
        // { path: "books", element: <Outlet /> },
        // { path: "users", element: <Outlet /> },
      ],
    },
    {
      path: "books",
      subRoutes: [
        { path: "add", element: <BookFormContainer /> },
        { path: ":bookIsbn/edit", element: <EditBookFormContainer /> },
      ],
    },
    {
      path: "admin/users",
      subRoutes: [
        { path: "add", element: <UserFormContainer /> },
      ],
    },
  ];

  return (
    <>
      <AppHeader onLoginClick={() => setOpenLoginDialog(true)} />
      <Routes>

        {privateRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element}>
            {route.children && route.children.map((childRoute, idx) => (
              //wrap with protected routes
              <Route key={idx} path={childRoute.path} element={childRoute.element} />
            ))}
          </Route>
        ))}


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







// const publicRoutes = [
//   { path: "/books", element: <Dashboard /> },
// ];

// const privateRoutes = [
//   {
//     path: "/admin/books/add",
//     element: (
//       <WithLoginProtector>
//         <WithAdminProtector>
//           <BookFormContainer />
//         </WithAdminProtector>
//       </WithLoginProtector>
//     ),
//   },
//   {
//     path: "/admin/users/add",
//     element: (
//       <WithLoginProtector>
//         <WithAdminProtector>
//           <UserFormContainer />
//         </WithAdminProtector>
//       </WithLoginProtector>
//     ),
//   },
//   {
//     path: "/admin/books/:bookIsbn/edit",
//     element: (
//       <WithLoginProtector>
//         <WithAdminProtector>
//           <EditBookFormContainer />
//         </WithAdminProtector>
//       </WithLoginProtector>
//     ),
//   },
// ];

// return (
//   <>
//     <AppHeader onLoginClick={() => setOpenLoginDialog(true)} />
//     <Routes>
//       {publicRoutes.map((route, index) => (
//         <Route key={index} path={route.path} element={route.element} />
//       ))}
//       {privateRoutes.map((route, index) => (
//         <Route key={index} path={route.path} element={route.element} />
//       ))}
//       <Route path="*" element={<Navigate to="/books" replace />} />
//     </Routes>
//     <LoginDialog
//       open={openLoginDialog}
//       handleSubmit={handleLoginSubmit}
//       handleClose={handleLoginClose}
//     />
//   </>
// );