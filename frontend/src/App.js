import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import RecipeGrid from './components/RecipeGrid';
import RecipeModal from './components/RecipeModal';
import Footer from './components/Footer';
import Login from './components/Login';
import Favorites from './components/Favorites';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // App state
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [lastSearchType, setLastSearchType] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  // Check authentication on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('quickbite_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  // Load random recipe when authenticated
  useEffect(() => {
    if (isAuthenticated && !searchPerformed) {
      loadRandomRecipe();
    }
  }, [isAuthenticated, searchPerformed]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setRecipes([]);
    setSearchPerformed(false);
    setLastSearchType(null);
    setShowFavorites(false); // Close favorites when logging out
  };

  const loadRandomRecipe = async () => {
    try {
      setLoading(true);
      setError('');
      setLastSearchType(null);
      
      const response = await axios.get(`${API_BASE_URL}/recipes/random`);
      if (response.data.meals && response.data.meals.length > 0) {
        setRecipes(response.data.meals);
        setSearchPerformed(true);
      }
    } catch (error) {
      console.error('Error loading random recipe:', error);
      setError('Failed to load recipe suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchParams) => {
    try {
      // Clear previous results immediately
      setRecipes([]);
      setError('');
      setSelectedRecipe(null);
      setShowModal(false);
      setSearchPerformed(false);
      setLoading(true);

      let response;
      
      if (searchParams.searchType === 'ingredient') {
        response = await axios.get(
          `${API_BASE_URL}/recipes/ingredient/${encodeURIComponent(searchParams.ingredient)}`,
          { params: { maxTime: searchParams.maxTime } }
        );
      } else if (searchParams.searchType === 'name') {
        response = await axios.get(
          `${API_BASE_URL}/recipes/search/${encodeURIComponent(searchParams.mealName)}`
        );
      } else if (searchParams.searchType === 'meal-id') {
        response = await axios.get(
          `${API_BASE_URL}/recipes/lookup/${encodeURIComponent(searchParams.mealId)}`
        );
      } else {
        response = await axios.post(`${API_BASE_URL}/recipes/search`, searchParams);
      }

      console.log('Search response:', response.data);

      if (response.data.meals && response.data.meals.length > 0) {
        setRecipes(response.data.meals);
        setSearchPerformed(true);
        setLastSearchType(searchParams.searchType);
      } else {
        setRecipes([]);
        setSearchPerformed(true);
        setLastSearchType(searchParams.searchType);
        setError('No recipes found with your criteria. Try different search terms or filters!');
      }

    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search recipes. Please try again.');
      setRecipes([]);
      setSearchPerformed(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = async (recipe) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_BASE_URL}/recipes/details/${recipe.idMeal}`);
      
      console.log('API Response:', response.data);
      
      if (response.data.meal) {
        setSelectedRecipe(response.data.meal);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      setError('Failed to load recipe details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  const handleClearResults = () => {
    setRecipes([]);
    setError('');
    setSearchPerformed(false);
    setLastSearchType(null);
    // Load a new random recipe
    loadRandomRecipe();
  };

  const handleFeatureClick = (featureType) => {
    switch (featureType) {
      case 'quick':
        // Quick & Easy - search for chicken with 15 min time limit
        handleSearch({
          searchType: 'ingredient',
          ingredient: 'chicken',
          maxTime: '15'
        });
        break;
      case 'ingredient':
        // Demo ingredient search
        handleSearch({
          searchType: 'ingredient',
          ingredient: 'tomatoes'
        });
        break;
      case 'random':
        loadRandomRecipe();
        break;
      default:
        break;
    }
  };

  const getResultsHeading = () => {
    if (!searchPerformed || recipes.length === 0) {
      return '';
    }
    
    // If lastSearchType is null, it means it's a random recipe suggestion
    if (lastSearchType === null) {
      return recipes.length === 1 ? 'Recipe Suggestion' : 'Recipe Suggestions';
    }
    
    // For actual searches, show "Found X recipes"
    return recipes.length === 1 ? 'Found 1 recipe' : `Found ${recipes.length} recipes`;
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Show favorites as separate view
  if (showFavorites) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Favorites 
          onClose={() => setShowFavorites(false)}
          onRecipeClick={handleRecipeClick}
        />
        
        {/* Recipe Modal can still appear on top of favorites */}
        {showModal && selectedRecipe && (
          <RecipeModal 
            recipe={selectedRecipe} 
            onClose={closeModal}
          />
        )}
      </div>
    );
  }

  // Main app view
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onFeatureClick={handleFeatureClick} 
        user={user}
        onLogout={handleLogout}
        onShowFavorites={() => setShowFavorites(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        {!loading && !searchPerformed && (
          <div className="welcome-section text-center py-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to QuickBite, {user?.name || 'User'}! 👨‍🍳
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Your personal recipe assistant for busy professionals. Find recipes based on:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="feature-card bg-white p-4 rounded-lg shadow hover-lift">
                  <h3 className="font-semibold text-blue-600 mb-2">🥘 Ingredients You Have</h3>
                  <p className="text-gray-600">Just enter what's in your fridge!</p>
                </div>
                <div className="feature-card bg-white p-4 rounded-lg shadow hover-lift">
                  <h3 className="font-semibold text-green-600 mb-2">⏰ Available Time</h3>
                  <p className="text-gray-600">Quick 15-min meals or longer cooking sessions!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <SearchForm onSearch={handleSearch} onClear={handleClearResults} loading={loading} />
        </div>

        {error && (
          <div className="error-message mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Finding delicious recipes...</span>
          </div>
        )}

        {!loading && searchPerformed && (
          <div>
            {recipes.length > 0 && (
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {getResultsHeading()}
                </h2>
              </div>
            )}
            
            <RecipeGrid 
              key={`search-${recipes.length}-${Date.now()}`}
              recipes={recipes} 
              onRecipeClick={handleRecipeClick}
              loading={loading}
            />
          </div>
        )}
      </main>

      {/* Recipe Modal */}
      {showModal && selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={closeModal}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
