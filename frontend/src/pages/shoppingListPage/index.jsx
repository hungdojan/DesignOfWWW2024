import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Container,
  Paper,
} from "@mui/material";
import { Add, Remove, Delete, Edit } from "@mui/icons-material";
import "./shoppingListPage.css";

const ShoppingListPage = () => {
  const [shoppingLists, setShoppingLists] = useState([
    {
      id: 1,
      name: "Groceries",
      items: [{ id: 1, name: "Apple", quantity: 2 }],
    },
    {
      id: 2,
      name: "Stationery",
      items: [{ id: 1, name: "Notebook", quantity: 5 }],
    },
  ]);
  const [currentListId, setCurrentListId] = useState(1);
  const [isEditingListTitle, setIsEditingListTitle] = useState(false);
  const [editedListTitle, setEditedListTitle] = useState("");

  useEffect(() => {
    document.title = "Shopping List";
  }, []);

  // Edit the main displayed list name
  const handleEditListTitle = () => {
    const listToEdit = shoppingLists.find((list) => list.id === currentListId);
    setEditedListTitle(listToEdit.name);
    setIsEditingListTitle(true);
  };

  const saveListTitle = () => {
    const updatedLists = shoppingLists.map((list) =>
      list.id === currentListId ? { ...list, name: editedListTitle } : list
    );
    setShoppingLists(updatedLists);
    setIsEditingListTitle(false);
  };

  const addItem = (listId, itemName) => {
    if (itemName.trim() === "") return; // prevent adding empty items
    const updatedLists = shoppingLists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: [
              ...list.items,
              { id: Date.now(), name: itemName, quantity: 1 },
            ],
          }
        : list
    );
    setShoppingLists(updatedLists);
  };

  const updateItemQuantity = (listId, itemId, delta) => {
    const updatedLists = shoppingLists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: list.items.map((item) =>
              item.id === itemId
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
            ),
          }
        : list
    );
    setShoppingLists(updatedLists);
  };

  const deleteItem = (listId, itemId) => {
    const updatedLists = shoppingLists.map((list) =>
      list.id === listId
        ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
        : list
    );
    setShoppingLists(updatedLists);
  };

  return (
    <>
      <Header />
      <Typography variant="h4" className="shopping-list-title">
        Shopping Lists
      </Typography>
      <Container>
        {/* Sidebar to Select Shopping Lists */}
        <Box sx={{ display: "flex" }}>
          {/* Sidebar: List of Shopping Lists */}
          <Paper sx={{ width: 250, marginRight: 2, padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              All Lists
            </Typography>
            <List>
              {shoppingLists.map((list) => (
                <ListItem
                  button
                  key={list.id}
                  selected={list.id === currentListId}
                  onClick={() => setCurrentListId(list.id)}
                  sx={{
                    borderRadius: 1,
                    padding: 1,
                    marginBottom: 1,
                    backgroundColor:
                      list.id === currentListId ? "#68A062" : "#f5f5f5",
                    color: list.id === currentListId ? "#fff" : "#000",
                  }}
                >
                  <ListItemText primary={list.name} />
                </ListItem>
              ))}
            </List>
            {/* Button to Add New List */}
            <Button
              variant="outlined"
              fullWidth
              onClick={() =>
                setShoppingLists([
                  ...shoppingLists,
                  { id: Date.now(), name: "New List", items: [] },
                ])
              }
            >
              Add New List
            </Button>
          </Paper>

          {/* Main Shopping List Display */}
          <Box sx={{ flexGrow: 1 }}>
            {shoppingLists
              .filter((list) => list.id === currentListId)
              .map((list) => (
                <Box key={list.id} sx={{ padding: 2 }}>
                  {/* Editable Shopping List Title */}
                  {isEditingListTitle ? (
                    <TextField
                      value={editedListTitle}
                      onChange={(e) => setEditedListTitle(e.target.value)}
                      onBlur={saveListTitle}
                      onKeyDown={(e) => e.key === "Enter" && saveListTitle()}
                      fullWidth
                      autoFocus
                    />
                  ) : (
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={handleEditListTitle}
                    >
                      {list.name}
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={handleEditListTitle}
                      >
                        <Edit />
                      </IconButton>
                    </Typography>
                  )}

                  {/* Add New Item to Current List */}
                  <TextField
                    placeholder="Add new item..."
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    onKeyDown={(e) =>
                      e.key === "Enter" && addItem(list.id, e.target.value)
                    }
                  />

                  {/* Display List Items */}
                  <Paper variant="outlined" sx={{ padding: 2 }}>
                    <List>
                      {list.items.map((item) => (
                        <ListItem
                          key={item.id}
                          sx={{
                            marginBottom: 1,
                            padding: 1,
                            borderRadius: 1,
                            border: "1px solid #ddd",
                          }}
                        >
                          <ListItemText
                            primary={item.name}
                            secondary={`Quantity: ${item.quantity}`}
                            sx={{ minWidth: 150 }}
                          />
                          <ListItemSecondaryAction
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <IconButton
                              edge="end"
                              onClick={() =>
                                updateItemQuantity(list.id, item.id, -1)
                              }
                              sx={{ marginRight: 1 }}
                            >
                              <Remove />
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={() =>
                                updateItemQuantity(list.id, item.id, 1)
                              }
                              sx={{ marginRight: 1 }}
                            >
                              <Add />
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={() => deleteItem(list.id, item.id)}
                            >
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Box>
              ))}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ShoppingListPage;
