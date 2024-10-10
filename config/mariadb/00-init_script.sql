CREATE TABLE IF NOT EXISTS Users  (
    ID INT PRIMARY KEY,
    username VARCHAR(50),
    role INT,
    name VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Recipes  (
    ID INT PRIMARY KEY,
    name VARCHAR(100),
    externalPage VARCHAR(255),
    description TEXT,
    instructions TEXT
);

CREATE TABLE IF NOT EXISTS Ingredients  (
    ID INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Images  (
    ID INT PRIMARY KEY,
    recipeID INT,
    target VARCHAR(255),
    FOREIGN KEY (recipeID) REFERENCES Recipes(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Groups  (
    ID INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS ShoppingList  (
    ID INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS ShoppingItem  (
    ID INT PRIMARY KEY,
    shoppingListID INT,
    name VARCHAR(100),
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (shoppingListID) REFERENCES ShoppingList(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Favorite  (
    userID INT,
    recipeID INT,
    PRIMARY KEY (userID, recipeID),
    FOREIGN KEY (userID) REFERENCES Users(ID) ON DELETE CASCADE,
    FOREIGN KEY (recipeID) REFERENCES Recipes(ID) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS UsersGroupsTBL  (
    userID INT,
    groupID INT,
    PRIMARY KEY (userID, groupID),
    FOREIGN KEY (userID) REFERENCES Users(ID) ON DELETE CASCADE,
    FOREIGN KEY (groupID) REFERENCES Groups(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RecipesIngredientsTBL  (
    recipeID INT,
    ingredientID INT,
    -- how much
    --
    PRIMARY KEY (recipeID, ingredientID),
    FOREIGN KEY (recipeID) REFERENCES Recipes(ID) ON DELETE CASCADE,
    FOREIGN KEY (ingredientID) REFERENCES Ingredients(ID) ON DELETE CASCADE
);


INSERT INTO Users (ID, username, role, name, email) VALUES
(1, 'user1', 1, 'John Doe', 'johndoe@example.com'),
(2, 'user2', 2, 'Jane Smith', 'janesmith@example.com'),
(3, 'user3', 3, 'Alice Johnson', 'alicejohnson@example.com');


INSERT INTO Recipes (ID, name, externalPage, description, instructions) VALUES
(1, 'Spaghetti Bolognese', 'https://www.example.com/recipe1', 'A classic Italian dish with a rich tomato sauce and savory ground beef.', '
    1. Cook spaghetti according to package directions.
    2. Brown ground beef in a large skillet over medium heat. Drain excess fat.
    3. Add chopped onion, garlic, and grated carrots to the skillet. Sauté until softened.
    4. Pour in tomato sauce, crushed tomatoes, and tomato paste. Season with salt, pepper, oregano, and basil.
    5. Simmer the sauce for 20-30 minutes, stirring occasionally.
    6. Toss cooked spaghetti with the bolognese sauce and serve with grated Parmesan cheese.
'),
(2, 'Chocolate Chip Cookies', 'https://www.example.com/recipe2', 'Decadent and chewy chocolate chip cookies.', '
    1. Preheat oven to 375°F (190°C).
    2. In a large bowl, cream together butter and sugar until light and fluffy.
    3. Beat in egg and vanilla extract.
    4. In a separate bowl, whisk together flour, baking soda, and salt.
    5. Gradually add dry ingredients to the wet ingredients, mixing until just combined.
    6. Stir in chocolate chips.
    7. Drop by rounded tablespoons onto ungreased baking sheets.
    8. Bake for 10-12 minutes, or until golden brown.
    9. Let cool on baking sheets for a few minutes before transferring to a wire rack to cool completely.
');

INSERT INTO Ingredients (ID, name) VALUES
(1, 'Spaghetti'),
(2, 'Ground Beef'),
(3, 'Tomato Sauce'),
(4, 'Butter'),
(5, 'Sugar'),
(6, 'Flour'),
(7, 'Chocolate Chips');

INSERT INTO Groups (ID, name) VALUES
(1, 'Cooking Club'),
(2, 'Baking Group');

INSERT INTO ShoppingList (ID, name) VALUES
(1, 'Grocery List'),
(2, 'Baking Supplies');

INSERT INTO ShoppingItem (ID, shoppingListID, name, completed) VALUES
(1, 1, 'Spaghetti', FALSE),
(2, 1, 'Ground Beef', TRUE),
(3, 1, 'Tomato Sauce', FALSE),
(4, 2, 'Butter', FALSE),
(5, 2, 'Sugar', FALSE),
(6, 2, 'Flour', FALSE),
(7, 2, 'Chocolate Chips', TRUE);

INSERT INTO Images (ID, recipeID, target) VALUES
(1, 1, 'spaghetti_bolognese.jpg'),
(2, 1, 'spaghetti_bolognese_2.jpg'),
(3, 2, 'chocolate_chip_cookies.jpg');

INSERT INTO Favorite (userID, recipeID) VALUES
(1, 1),
(2, 2),
(3, 1);

INSERT INTO UsersGroupsTBL (userID, groupID) VALUES
(1, 1),
(2, 2),
(3, 1),
(3, 2);

INSERT INTO RecipesIngredientsTBL (recipeID, ingredientID) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(2, 6),
(2, 7);
