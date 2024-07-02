import React, { useState } from "react";
import { useUser } from "../../context/user-context";
import { Button, TextField, Container, Typography } from "@mui/material";
import classes from "./styles.module.css";
import { useNavigate } from "react-router-dom"

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const { addUser } = useUser();
  const navigate = useNavigate()

  const handleAddUser = () => {
    if (username && password) {
      addUser({ username, password, role });
      setUsername("");
      setPassword("");
    
    } 
  };

  return (
    <Container component="div" className={classes.wrapper}>
      <Typography variant="h5" className={classes.pageHeader}>
        Add User
      </Typography>
      <form noValidate autoComplete="off">
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          margin="normal"
        />
        <div className={classes.btnContainer}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              navigate(-1)
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddUser}
          >
            Add User
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default AddUser;
