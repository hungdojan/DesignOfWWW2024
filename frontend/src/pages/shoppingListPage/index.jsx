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
import axios from "axios";

const ShoppingListPage = () => {
  const [shoppingLists, setShoppingLists] = useState([
    {
      id: 1,
      name: "Sample",
      items: [{ id: 1, name: "Item", quantity: 2 }],
    },
  ]);
  const [newItemName, setNewItemName] = useState("");
  const [currentListId, setCurrentListId] = useState(1);
  const [isEditingListTitle, setIsEditingListTitle] = useState(false);
  const [editedListTitle, setEditedListTitle] = useState("");

  useEffect(() => {
    document.title = "Shopping List";
  }, []);

  useEffect(() => {
    fetchShoppingLists();
  }, []);
  
  const fetchShoppingLists = async () => {
    try {
      const resp = await axios.get("/api/users/shop_lists");

      const shoppingLists = resp.data.map((list) => ({
        id: list.ID,
        name: list.name,
        items: [],
      }));

      // fetch all items for each shopping list
      const updatedShoppingLists = await Promise.all(
        shoppingLists.map(async (list) => {
          try {
            const itemsResponse = await axios.get(`/api/shopping_lists/${list.id}/items`);
              return {
              ...list,
              items: itemsResponse.data.map((item) => ({
                id: item.ID,
                name: item.name,
                quantity: item.total,
              })),
              };
          } catch (error) {
            console.error(`Error fetching items for list ${list.id}:`, error);
            return list;
          }
        })
      );

      setShoppingLists(updatedShoppingLists);
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
    }
  };

  const addNewShoppingList = async () => {

    const shoppingListData = { name: "New List"};

    await axios
      .post("/api/users/shop_lists", shoppingListData)
      .then((response) => {
        const shoppingListID = response.data.shopping_list_id;
        console.log("Created new shopping list with id:", shoppingListID);
      })

    fetchShoppingLists();
  };

  // Edit the main displayed list name
  const handleEditListTitle = () => {
    const listToEdit = shoppingLists.find((list) => list.id === currentListId);
    setEditedListTitle(listToEdit.name);
    setIsEditingListTitle(true);
  };

  const saveListTitle = async () => {

    await axios
      .patch(`/api/shopping_lists/${currentListId}`, {
        name: editedListTitle,
      })
      .catch ((error) => {
        console.error(`Error updating list ${currentListId} name:`, error);
    });

    fetchShoppingLists();
    setIsEditingListTitle(false);
  };

  const addItem = async (listId, itemName) => {
    if (itemName.trim() === "") return; // prevent adding empty items

    const itemData = 	
    {
      total: 1,
      name: itemName,
      completed: false
    }

    await axios
    .post(`/api//shopping_lists/${listId}/items`, itemData)
    .then((response) => {
      const shoppingListID = response.data.shopping_list_id;
      console.log("Created new shopping list with id:", shoppingListID);
    })

    fetchShoppingLists();
  };

  const updateItemQuantity = async (listId, itemId, delta) => {

    try {
      const response = await axios.get(`/api/shop_items/${itemId}`);
      const item = response.data;
    
      const updatedItem = {
        ...item,
        total: Math.max(1, item.total + delta),
      };
    
      await axios.patch(`/api/shop_items/${itemId}`, updatedItem);
    } catch (error) {
      console.error(`Error handling item ${itemId}:`, error);
    }

    fetchShoppingLists();
  };

  const deleteItem = async (listId, itemId) => {

    await axios
      .delete(`/api/shopping_lists/${listId}/items/${itemId}`)
      .catch((error) => {
        console.error(`Error deleting item ${itemId} from list ${listId}:`, error);
      });

    fetchShoppingLists();
  };

  const deleteShoppingList = async (listId) => {
      
    await axios
      .delete(`/api/shopping_lists/${listId}`)
      .catch((error) => {
        console.error(`Error deleting list ${listId}:`, error);
      });
  
      fetchShoppingLists();
    }

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

            <IconButton
              edge="end"
              onClick={() => deleteShoppingList(list.id)}
              className="action-button"
            >
              <Delete />
            </IconButton>
            </ListItem>
          ))}
        </List>
        <Button
          variant="outlined"
          fullWidth
          onClick={() =>
            addNewShoppingList()
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
                  gutterBottom
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
              <Box className="add-container">
                <TextField
                  placeholder="Add new item..."
                  className="add-item-input"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addItem(list.id, newItemName);
                      setNewItemName("");
                    }
                  }}
                />
                <Button
                  className="add-button"
                  onClick={() => {
                    addItem(list.id, newItemName);
                    setNewItemName("");
                  }}
                >
                  +
                </Button>
              </Box>
              {list.items.length > 0 && (
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
              )}
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
