const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Base URL for TheMealDB API
const MEAL_DB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Helper function to get cooking time estimate based on recipe complexity
const getCookingTimeEstimate = (meal) => {
  const instructions = meal.strInstructions || '';
  const ingredientCount = Object.keys(meal || {})
    .filter(key => key.startsWith('strIngredient') && meal[key] && meal[key].trim())
    .length;
  
  // Simple algorithm to estimate cooking time
  if (ingredientCount <= 5 && instructions.length < 500) return 15; // Quick (15 min)
  if (ingredientCount <= 10 && instructions.length < 1000) return 30; // Medium (30 min)
  return 60; // Long (60+ min)
};

// Helper function to categorize meals by mood/occasion
const getMoodCategory = (meal) => {
  const name = (meal.strMeal || '').toLowerCase();
  const category = (meal.strCategory || '').toLowerCase();
  
  if (name.includes('chocolate') || name.includes('cake') || name.includes('dessert')) {
    return 'comfort';
  }
  if (category.includes('seafood') || name.includes('salmon') || name.includes('fish')) {
    return 'light';
  }
  if (name.includes('spicy') || name.includes('curry') || name.includes('chili')) {
    return 'spicy';
  }
  if (category.includes('vegetarian') || name.includes('vegetable')) {
    return 'healthy';
  }
  return 'hearty';
};

// API Routes

// 1. Search recipes by ingredient
app.get('/api/recipes/ingredient/:ingredient', async (req, res) => {
  try {
    const { ingredient } = req.params;
    const response = await axios.get(`${MEAL_DB_BASE_URL}/filter.php?i=${ingredient}`);
    
    if (!response.data.meals) {
      return res.json({ meals: [], message: 'No recipes found for this ingredient' });
    }

    // Enhance each meal with additional info
    const enhancedMeals = response.data.meals.map(meal => ({
      ...meal,
      estimatedTime: getCookingTimeEstimate(meal),
      moodCategory: getMoodCategory(meal)
    }));

    res.json({ meals: enhancedMeals });
  } catch (error) {
    console.error('Error fetching recipes by ingredient:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});



// 2. Get recipe details by ID
app.get('/api/recipes/lookup/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a meal ID' });
    }

    const response = await axios.get(`${MEAL_DB_BASE_URL}/lookup.php?i=${id.trim()}`);
    
    if (!response.data.meals) {
      return res.json({ 
        meals: [], 
        message: `No recipe found with ID "${id}". Try a different meal ID.`,
        searchedId: id
      });
    }

    const meal = response.data.meals[0];
    // Add cooking time estimate and mood category
    meal.estimatedTime = getCookingTimeEstimate(meal);
    meal.moodCategory = getMoodCategory(meal);
    
    res.json({ 
      meals: [meal], // Return as array for consistency with other search endpoints
      searchedId: id,
      totalFound: 1
    });
  } catch (error) {
    console.error('Error looking up recipe by ID:', error);
    res.status(500).json({ error: 'Failed to lookup recipe by ID' });
  }
});

// Recipe details endpoint with better error handling
app.get('/api/recipes/details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Fetching recipe details for ID:', id); // Debug log
    
    if (!id || id === 'undefined') {
      return res.status(400).json({ 
        error: 'Recipe ID is required',
        details: 'Invalid or missing recipe ID' 
      });
    }
    
    const response = await axios.get(`${MEAL_DB_BASE_URL}/lookup.php?i=${id}`);
    
    console.log('TheMealDB response:', response.data); // Debug log
    
    if (response.data.meals && response.data.meals.length > 0) {
      res.json({ meal: response.data.meals[0] });
    } else {
      res.status(404).json({ 
        error: 'Recipe not found',
        details: `No recipe found with ID: ${id}` 
      });
    }
  } catch (error) {
    console.error('Error fetching recipe details:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch recipe details',
      details: error.message 
    });
  }
});

// 3. Get recipes by category (for mood-based filtering)
app.get('/api/recipes/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const response = await axios.get(`${MEAL_DB_BASE_URL}/filter.php?c=${category}`);
    
    if (!response.data.meals) {
      return res.json({ meals: [], message: 'No recipes found for this category' });
    }

    const enhancedMeals = response.data.meals.map(meal => ({
      ...meal,
      estimatedTime: getCookingTimeEstimate(meal),
      moodCategory: getMoodCategory(meal)
    }));

    res.json({ meals: enhancedMeals });
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// 4. Search recipes with filters
app.post('/api/recipes/search', async (req, res) => {
  try {
    const { ingredient, maxTime, mood, dietary } = req.body;
    
    let meals = [];
    
    // First get recipes by ingredient if provided
    if (ingredient) {
      const response = await axios.get(`${MEAL_DB_BASE_URL}/filter.php?i=${ingredient}`);
      if (response.data.meals) {
        meals = response.data.meals;
      }
    } else {
      // If no ingredient, get from a general category
      const response = await axios.get(`${MEAL_DB_BASE_URL}/filter.php?c=Miscellaneous`);
      if (response.data.meals) {
        meals = response.data.meals.slice(0, 20); // Limit to prevent too many results
      }
    }

    // Enhance meals with additional info
    let enhancedMeals = meals.map(meal => ({
      ...meal,
      estimatedTime: getCookingTimeEstimate(meal),
      moodCategory: getMoodCategory(meal)
    }));

    // Apply filters
    if (maxTime) {
      enhancedMeals = enhancedMeals.filter(meal => meal.estimatedTime <= parseInt(maxTime));
    }

    if (mood && mood !== 'any') {
      enhancedMeals = enhancedMeals.filter(meal => meal.moodCategory === mood);
    }

    // Basic dietary filtering (this could be enhanced with more detailed ingredient analysis)
    if (dietary && dietary !== 'any') {
      enhancedMeals = enhancedMeals.filter(meal => {
        const category = (meal.strCategory || '').toLowerCase();
        if (dietary === 'vegetarian') {
          return !category.includes('beef') && !category.includes('pork') && !category.includes('chicken') && !category.includes('lamb');
        }
        return true;
      });
    }

    res.json({ 
      meals: enhancedMeals,
      totalFound: enhancedMeals.length,
      filters: { ingredient, maxTime, mood, dietary }
    });
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ error: 'Failed to search recipes' });
  }
});

// 5. Get random recipe suggestion
app.get('/api/recipes/random', async (req, res) => {
  try {
    const response = await axios.get(`${MEAL_DB_BASE_URL}/random.php`);
    
    if (!response.data.meals) {
      return res.status(404).json({ error: 'No random recipe found' });
    }

    const meal = response.data.meals[0];
    meal.estimatedTime = getCookingTimeEstimate(meal);
    meal.moodCategory = getMoodCategory(meal);
    
    res.json({ meal });
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    res.status(500).json({ error: 'Failed to fetch random recipe' });
  }
});

// 6. Get all available categories
app.get('/api/categories', async (req, res) => {
  try {
    const response = await axios.get(`${MEAL_DB_BASE_URL}/categories.php`);
    res.json({ categories: response.data.categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// 7. Search meal by name
app.get('/api/recipes/search/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a meal name to search' });
    }

    const response = await axios.get(`${MEAL_DB_BASE_URL}/search.php?s=${encodeURIComponent(name.trim())}`);
    
    if (!response.data.meals) {
      return res.json({ 
        meals: [], 
        message: `No recipes found with name "${name}". Try a different spelling or meal name.`,
        searchTerm: name
      });
    }

    // Enhance each meal with additional info
    const enhancedMeals = response.data.meals.map(meal => ({
      ...meal,
      estimatedTime: getCookingTimeEstimate(meal),
      moodCategory: getMoodCategory(meal)
    }));

    res.json({ 
      meals: enhancedMeals,
      searchTerm: name,
      totalFound: enhancedMeals.length
    });
  } catch (error) {
    console.error('Error searching meal by name:', error);
    res.status(500).json({ error: 'Failed to search meal by name' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'QuickBite API is running' });
});

app.listen(port, () => {
  console.log(`QuickBite Backend service listening on port ${port}`);
});
