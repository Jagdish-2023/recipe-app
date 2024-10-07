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

// API to get all the recipes
app.get("/recipes", async (req, res) => {
  try {
    const getRecipes = await getAllRecipes();
    if (getRecipes.length > 0) {
      res.status(200).json(getRecipes);
    } else {
      res.status(404).json({ error: "No recipes found in Database." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get recipes." });
  }
});

const getAllRecipes = async () => {
  try {
    return await Recipe.find();
  } catch (error) {
    throw error;
  }
};

//API to get Recipe by its Title
app.get("/recipes/:recipeTitle", async (req, res) => {
  try {
    const recipe = await getRecipeByTitle(req.params.recipeTitle);
    if (recipe) {
      res.status(200).json(recipe);
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get recipe." });
    console.log(error);
  }
});

const getRecipeByTitle = async (recipeTitle) => {
  try {
    return await Recipe.findOne({ title: recipeTitle });
  } catch (error) {
    throw error;
  }
};

//API to get all Recipes by Author
app.get("/recipes/author/:recipeAuthor", async (req, res) => {
  try {
    const recipes = await getRecipesByAuthor(req.params.recipeAuthor);
    if (recipes.length > 0) {
      res.status(200).json(recipes);
    } else {
      res.status(404).json({ error: "Recipes not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Recipes." });
    console.log(error);
  }
});

const getRecipesByAuthor = async (recipeAuthor) => {
  try {
    return await Recipe.find({ author: recipeAuthor });
  } catch (error) {
    throw error;
  }
};

//API to get all Recipes with EASY difficulty level
app.get("/recipes/difficulty/:difficultLevel", async (req, res) => {
  try {
    const recipes = await getRecipesByEasyLevel(req.params.difficultLevel);
    if (recipes.length > 0) {
      res.status(200).json(recipes);
    } else {
      res.status(404).json({ error: "Recipes not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Recipes" });
  }
});

const getRecipesByEasyLevel = async (difficultyLevel) => {
  try {
    return await Recipe.find({ difficulty: difficultyLevel });
  } catch (error) {
    throw error;
  }
};

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running in port: ", PORT);
});
