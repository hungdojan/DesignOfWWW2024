import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
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
    <Container className="main-container">
    <Box className="main-layout">
      <Paper className="sidebar">
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
              className={`list-item ${list.id === currentListId ? "selected" : ""}`}
            >
              <ListItemText primary={list.name} />
            </ListItem>
          ))}
        </List>
        <Button
          variant="outlined"
          fullWidth
          onClick={() =>
            setShoppingLists([
              ...shoppingLists,
              { id: Date.now(), name: "New List", items: [] },
            ])
          }
          className="new-list-btn"
        >
          Add New List
        </Button>
      </Paper>

      <Box className="shopping-list-display">
        {shoppingLists
          .filter((list) => list.id === currentListId)
          .map((list) => (
            <Box key={list.id} className="list-box">
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
                  className="list-title"
                  onClick={handleEditListTitle}
                >
                  {list.name}
                  <IconButton
                    size="small"
                    onClick={handleEditListTitle}
                  >
                    <Edit />
                  </IconButton>
                </Typography>
              )}
              <TextField
                placeholder="Add new item..."
                className="add-item-input"
                onKeyDown={(e) =>
                  e.key === "Enter" && addItem(list.id, e.target.value)
                }
              />
              <Paper variant="outlined" className="items-container">
                <List>
                  {list.items.map((item) => (
                    <ListItem key={item.id} className="item-row">
                      <ListItemText
                        primary={item.name}
                        secondary={`Quantity: ${item.quantity}`}
                        className="item-text"
                      />
                      <ListItemSecondaryAction className="item-actions">
                        <IconButton
                          edge="end"
                          onClick={() => updateItemQuantity(list.id, item.id, -1)}
                          className="action-button"
                        >
                          <Remove />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => updateItemQuantity(list.id, item.id, 1)}
                          className="action-button"
                        >
                          <Add />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => deleteItem(list.id, item.id)}
                          className="action-button"
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
    <Footer />
  </>
  );
};

export default ShoppingListPage;
