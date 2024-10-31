-- Change delimiter so that the function body doesn't end the function declaration
DELIMITER //

CREATE FUNCTION uuid_v4()
    RETURNS CHAR(36) NO SQL
BEGIN
    -- Generate 8 2-byte strings that we will combine into a UUIDv4
    SET @h1 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h2 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h3 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h6 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h7 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');
    SET @h8 = LPAD(HEX(FLOOR(RAND() * 0xffff)), 4, '0');

    -- 4th section will start with a 4 indicating the version
    SET @h4 = CONCAT('4', LPAD(HEX(FLOOR(RAND() * 0x0fff)), 3, '0'));

    -- 5th section first half-byte can only be 8, 9 A or B
    SET @h5 = CONCAT(HEX(FLOOR(RAND() * 4 + 8)),
                LPAD(HEX(FLOOR(RAND() * 0x0fff)), 3, '0'));

    -- Build the complete UUID
    RETURN LOWER(CONCAT(
        @h1, @h2, '-', @h3, '-', @h4, '-', @h5, '-', @h6, @h7, @h8
    ));
END
//
-- Switch back the delimiter
DELIMITER ;
CREATE TABLE IF NOT EXISTS Users  (
    ID VARCHAR(255) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    role ENUM('ADMIN', 'USER') NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Recipes  (
    ID VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    externalPage VARCHAR(255),
    authorID VARCHAR(255),
    timeCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    instructions TEXT,
    FOREIGN KEY (authorID) REFERENCES Users(ID)
);

CREATE TABLE IF NOT EXISTS Ingredients  (
    ID VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Images  (
    ID VARCHAR(255) PRIMARY KEY,
    recipeID VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    FOREIGN KEY (recipeID) REFERENCES Recipes(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Groups  (
    ID VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS ShoppingLists  (
    ID VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS ShoppingItems  (
    ID VARCHAR(255) PRIMARY KEY,
    shoppingListID VARCHAR(255) NOT NULL,
    total INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (shoppingListID) REFERENCES ShoppingLists(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Favorite  (
    userID VARCHAR(255) NOT NULL,
    recipeID VARCHAR(255) NOT NULL,
    -- TODO: set private key (userID, recipeID)
    FOREIGN KEY (userID) REFERENCES Users(ID) ON DELETE CASCADE,
    FOREIGN KEY (recipeID) REFERENCES Recipes(ID) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS UsersGroupsTBL  (
    userID VARCHAR(255) NOT NULL,
    groupID VARCHAR(255) NOT NULL,
    -- TODO: set private key (userID, groupID)
    FOREIGN KEY (userID) REFERENCES Users(ID) ON DELETE CASCADE,
    FOREIGN KEY (groupID) REFERENCES Groups(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RecipesIngredientsTBL  (
    recipeID VARCHAR(255) NOT NULL,
    ingredientID VARCHAR(255) NOT NULL,
    value FLOAT NOT NULL,
    unit ENUM('mg', 'g', 'kg', 'ml', 'l') NOT NULL,

    -- TODO: set private key (recipeID, ingredientID)
    FOREIGN KEY (recipeID) REFERENCES Recipes(ID) ON DELETE CASCADE,
    FOREIGN KEY (ingredientID) REFERENCES Ingredients(ID) ON DELETE CASCADE
);

-- Insert data using the uuid_v4() function for UUIDs
INSERT INTO Users (ID, username, role, name, email) VALUES
(uuid_v4(), 'user1', 'USER', 'John Doe', 'johndoe@example.com'),
(uuid_v4(), 'user2', 'USER', 'Jane Smith', 'janesmith@example.com'),
(uuid_v4(), 'admin', 'ADMIN', 'Alice Johnson', 'alicejohnson@example.com');

INSERT INTO Recipes (ID, name, externalPage, authorID, description, instructions) VALUES
(uuid_v4(), 'Spaghetti Bolognese', 'https://www.example.com/recipe1', NULL, 'A classic Italian dish with a rich tomato sauce and savory ground beef.', '
    1. Cook spaghetti according to package directions.
    2. Brown ground beef in a large skillet over medium heat. Drain excess fat.
    3. Add chopped onion, garlic, and grated carrots to the skillet. Sauté until softened.
    4. Pour in tomato sauce, crushed tomatoes, and tomato paste. Season with salt, pepper, oregano, and basil.
    5. Simmer the sauce for 20-30 minutes, stirring occasionally.
    6. Toss cooked spaghetti with the bolognese sauce and serve with grated Parmesan cheese.
'),
(uuid_v4(), 'Chocolate Chip Cookies', NULL, (SELECT ID FROM Users WHERE Users.username = 'user1'), 'Decadent and chewy chocolate chip cookies.', '
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
(uuid_v4(), 'Spaghetti'),
(uuid_v4(), 'Ground Beef'),
(uuid_v4(), 'Tomato Sauce'),
(uuid_v4(), 'Butter'),
(uuid_v4(), 'Sugar'),
(uuid_v4(), 'Flour'),
(uuid_v4(), 'Chocolate Chips');

INSERT INTO Groups (ID, name) VALUES
(uuid_v4(), 'Cooking Club'),
(uuid_v4(), 'Baking Group');

INSERT INTO ShoppingLists (ID, name) VALUES
(uuid_v4(), 'Grocery Lists'),
(uuid_v4(), 'Baking Supplies');

INSERT INTO ShoppingItems (ID, shoppingListID, total, name, completed) VALUES
(uuid_v4(), (SELECT ID FROM ShoppingLists LIMIT 1), 1, 'Spaghetti', FALSE),
(uuid_v4(), (SELECT ID FROM ShoppingLists LIMIT 1 OFFSET 1), 1, 'Ground Beef', TRUE),
(uuid_v4(), (SELECT ID FROM ShoppingLists LIMIT 1), 1, 'Tomato Sauce', FALSE),
(uuid_v4(), (SELECT ID FROM ShoppingLists LIMIT 1 OFFSET 1), 1, 'Butter', FALSE),
(uuid_v4(), (SELECT ID FROM ShoppingLists LIMIT 1 OFFSET 1), 1, 'Sugar', FALSE),
(uuid_v4(), (SELECT ID FROM ShoppingLists LIMIT 1 OFFSET 1), 1, 'Flour', FALSE),
(uuid_v4(), (SELECT ID FROM ShoppingLists LIMIT 1 OFFSET 1), 1, 'Chocolate Chips', TRUE);

INSERT INTO Images (ID, recipeID, target) VALUES
(uuid_v4(), (SELECT ID FROM Recipes LIMIT 1), 'spaghetti_bolognese.jpg'),
(uuid_v4(), (SELECT ID FROM Recipes LIMIT 1), 'spaghetti_bolognese_2.jpg'),
(uuid_v4(), (SELECT ID FROM Recipes LIMIT 1 OFFSET 1), 'chocolate_chip_cookies.jpg');

INSERT INTO Favorite (userID, recipeID) VALUES
((SELECT ID FROM Users LIMIT 1), (SELECT ID FROM Recipes LIMIT 1)),
((SELECT ID FROM Users LIMIT 1 OFFSET 1), (SELECT ID FROM Recipes LIMIT 1 OFFSET 1)),
((SELECT ID FROM Users LIMIT 1), (SELECT ID FROM Recipes LIMIT 1));

INSERT INTO UsersGroupsTBL (userID, groupID) VALUES
((SELECT ID FROM Users LIMIT 1), (SELECT ID FROM Groups LIMIT 1)),
((SELECT ID FROM Users LIMIT 1 OFFSET 1), (SELECT ID FROM Groups LIMIT 1 OFFSET 1)),
((SELECT ID FROM Users LIMIT 1 OFFSET 2), (SELECT ID FROM Groups LIMIT 1)),
((SELECT ID FROM Users LIMIT 1 OFFSET 2), (SELECT ID FROM Groups LIMIT 1 OFFSET 1));

INSERT INTO RecipesIngredientsTBL (recipeID, ingredientID, value, unit) VALUES
((SELECT ID FROM Recipes LIMIT 1), (SELECT ID FROM Ingredients LIMIT 1), 500, 'kg'),
((SELECT ID FROM Recipes LIMIT 1), (SELECT ID FROM Ingredients LIMIT 1 OFFSET 1), 200, 'kg'),
((SELECT ID FROM Recipes LIMIT 1), (SELECT ID FROM Ingredients LIMIT 1 OFFSET 2), 0.5, 'l'),
((SELECT ID FROM Recipes LIMIT 1 OFFSET 1), (SELECT ID FROM Ingredients LIMIT 1 OFFSET 3), 500, 'kg'),
((SELECT ID FROM Recipes LIMIT 1 OFFSET 1), (SELECT ID FROM Ingredients LIMIT 1 OFFSET 4), 500, 'kg'),
((SELECT ID FROM Recipes LIMIT 1 OFFSET 1), (SELECT ID FROM Ingredients LIMIT 1 OFFSET 5), 500, 'kg'),
((SELECT ID FROM Recipes LIMIT 1 OFFSET 1), (SELECT ID FROM Ingredients LIMIT 1 OFFSET 6), 500, 'kg');
