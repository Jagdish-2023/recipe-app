const initializeDB = require("./db/db.connect");
const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const Recipe = require("./model/receipe.model");

initializeDB();

app.post("/recipes", async (req, res) => {
  const requiredFields = [
    "title",
    "author",
    "prepTime",
    "cookTime",
    "ingredients",
    "instructions",
    "imageUrl",
  ];

  try {
    const recipeInput = req.body;
    const recipeObjKeys = Object.keys(recipeInput);
    const missingFields = requiredFields.filter((field) => {
      return !recipeObjKeys.includes(field);
    });

    if (missingFields.length > 0) {
      res.status(400).json({
        error: `${missingFields.join(", ")} ${
          missingFields.length > 1 ? "fields are" : "field is"
        } required`,
      });
    } else {
      const savedRecipe = await addRecipeData(recipeInput);
      if (savedRecipe) {
        res
          .status(201)
          .json({ message: "Recipe added successfully", savedRecipe });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to create Recipe." });
    console.log(error);
  }
});

const addRecipeData = async (recipeData) => {
  try {
    const newRecipe = new Recipe(recipeData);
    const savedRecipe = await newRecipe.save();

    return savedRecipe;
  } catch (error) {
    throw error;
  }
};

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running in port: ", PORT);
});
