import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

const AddUserModal = ({ open, onClose, onAdd, error }) => {
  const [email, setEmail] = useState("");

  const handleAdd = () => {
    onAdd(email, () => setEmail(""));
  };

  const handleClose = () => {
    setEmail("");
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <h2>Add user to shopping list</h2>
        <TextField
          label="Email Address"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!email && email !== ""}
          helperText={!email && email !== "" ? "Email is required" : ""}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            color="primary"
            disabled={!email.trim()}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddUserModal;
