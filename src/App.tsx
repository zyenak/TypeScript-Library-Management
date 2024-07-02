import React, { Suspense } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { Container } from "@mui/material"
import AppLayout from "./layout/app-layout"
import { UserProvider } from "./context/user-context"
import { BooksProvider } from "./context/books-context"
import './App.css';

function App() {
  return (
    <div className="App">
       <BooksProvider>
      <UserProvider>
       
        <Suspense fallback={null}>
          <Container className="page-container">
            <Router>
              <AppLayout />
            </Router>
          </Container>
        </Suspense>
      
      </UserProvider>
      </BooksProvider>
    </div>
  );
}

export default App;
