CREATE TABLE IF NOT EXISTS Users  (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    role ENUM('ADMIN', 'USER') NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Recipes  (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    externalPage VARCHAR(255),
    authorID INT,
    timeCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    instructions TEXT,
    FOREIGN KEY (authorID) REFERENCES Users(ID)
);

CREATE TABLE IF NOT EXISTS Ingredients  (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Images  (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    recipeID INT NOT NULL,
    target VARCHAR(255) NOT NULL,
    FOREIGN KEY (recipeID) REFERENCES Recipes(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Groups  (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS ShoppingLists  (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS ShoppingItems  (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    shoppingListID INT NOT NULL,
    total INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (shoppingListID) REFERENCES ShoppingLists(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Favorite  (
    userID INT NOT NULL,
    recipeID INT NOT NULL,
    -- TODO: set private key (userID, recipeID)
    FOREIGN KEY (userID) REFERENCES Users(ID) ON DELETE CASCADE,
    FOREIGN KEY (recipeID) REFERENCES Recipes(ID) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS UsersGroupsTBL  (
    userID INT NOT NULL,
    groupID INT NOT NULL,
    -- TODO: set private key (userID, groupID)
    FOREIGN KEY (userID) REFERENCES Users(ID) ON DELETE CASCADE,
    FOREIGN KEY (groupID) REFERENCES Groups(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RecipesIngredientsTBL  (
    recipeID INT NOT NULL,
    ingredientID INT NOT NULL,
    value FLOAT NOT NULL,
    unit ENUM('mg', 'g', 'kg', 'ml', 'l') NOT NULL,

    -- TODO: set private key (recipeID, ingredientID)
    FOREIGN KEY (recipeID) REFERENCES Recipes(ID) ON DELETE CASCADE,
    FOREIGN KEY (ingredientID) REFERENCES Ingredients(ID) ON DELETE CASCADE
);


INSERT INTO Users (ID, username, role, name, email) VALUES
(1, 'user1', 'USER', 'John Doe', 'johndoe@example.com'),
(2, 'user2', 'USER', 'Jane Smith', 'janesmith@example.com'),
(3, 'admin', 'ADMIN', 'Alice Johnson', 'alicejohnson@example.com');


INSERT INTO Recipes (ID, name, externalPage, authorID, description, instructions) VALUES
(1, 'Spaghetti Bolognese', 'https://www.example.com/recipe1', NULL, 'A classic Italian dish with a rich tomato sauce and savory ground beef.', '
    1. Cook spaghetti according to package directions.
    2. Brown ground beef in a large skillet over medium heat. Drain excess fat.
    3. Add chopped onion, garlic, and grated carrots to the skillet. Sauté until softened.
    4. Pour in tomato sauce, crushed tomatoes, and tomato paste. Season with salt, pepper, oregano, and basil.
    5. Simmer the sauce for 20-30 minutes, stirring occasionally.
    6. Toss cooked spaghetti with the bolognese sauce and serve with grated Parmesan cheese.
'),
(2, 'Chocolate Chip Cookies', 'https://www.example.com/recipe2', NULL, 'Decadent and chewy chocolate chip cookies.', '
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

INSERT INTO ShoppingLists (ID, name) VALUES
(1, 'Grocery Lists'),
(2, 'Baking Supplies');

INSERT INTO ShoppingItems (ID, shoppingListID, total, name, completed) VALUES
(1, 1, 1, 'Spaghetti', FALSE),
(2, 1, 1, 'Ground Beef', TRUE),
(3, 1, 1, 'Tomato Sauce', FALSE),
(4, 2, 1, 'Butter', FALSE),
(5, 2, 1, 'Sugar', FALSE),
(6, 2, 1, 'Flour', FALSE),
(7, 2, 1, 'Chocolate Chips', TRUE);

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

INSERT INTO RecipesIngredientsTBL (recipeID, ingredientID, value, unit) VALUES
(1, 1, 500, 'kg'),
(1, 2, 200, 'kg'),
(1, 3, 0.5, 'l'),
(2, 4, 500, 'kg'),
(2, 5, 500, 'kg'),
(2, 6, 500, 'kg'),
(2, 7, 500, 'kg');
