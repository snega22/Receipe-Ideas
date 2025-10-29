import React, { useState, useEffect } from 'react';

const SearchForm = ({ onSearch, onClear, loading }) => {
  const [searchType, setSearchType] = useState('ingredient');
  const [ingredient, setIngredient] = useState('');
  const [mealName, setMealName] = useState('');
  const [mealId, setMealId] = useState('');
  const [maxTime, setMaxTime] = useState('');

  const [hasPerformedSearch, setHasPerformedSearch] = useState(false);

  // Validation functions
  const validateIngredient = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter an ingredient!';
    if (trimmed.length < 2) return 'Ingredient must be at least 2 characters!';
    if (/^[0-9\s]+$/.test(trimmed)) return 'Please enter a valid ingredient name, not just numbers!';
    if (/^[^a-zA-Z]*$/.test(trimmed)) return 'Please enter a valid ingredient with letters!';
    if (trimmed.length > 50) return 'Ingredient name is too long!';
    return null;
  };

  const validateMealName = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter a meal name!';
    if (trimmed.length < 2) return 'Meal name must be at least 2 characters!';
    if (/^[0-9\s]+$/.test(trimmed)) return 'Please enter a valid meal name, not just numbers!';
    if (/^[^a-zA-Z]*$/.test(trimmed)) return 'Please enter a valid meal name with letters!';
    if (trimmed.length > 100) return 'Meal name is too long!';
    return null;
  };

  const validateMealId = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter a meal ID!';
    if (!/^[0-9]+$/.test(trimmed)) return 'Meal ID must contain only numbers!';
    if (trimmed.length < 4 || trimmed.length > 10) return 'Meal ID must be 4-10 digits!';
    return null;
  };

  // Check if there are any filters to reset
  const hasActiveFilters = () => {
    return ingredient.trim() !== '' || mealName.trim() !== '' || mealId.trim() !== '' || maxTime !== '';
  };

  // Check if all fields are empty/default and auto-reset if needed
  useEffect(() => {
    const isAllFieldsEmpty = () => {
      if (searchType === 'ingredient') {
        return !ingredient.trim() && maxTime === '';
      } else if (searchType === 'name') {
        return !mealName.trim();
      } else if (searchType === 'meal-id') {
        return !mealId.trim();
      }
      return false;
    };

    // Only trigger reset if fields are manually cleared after a search was performed
    if (isAllFieldsEmpty() && hasPerformedSearch && onClear) {
      const timeoutId = setTimeout(() => {
        onClear();
        setHasPerformedSearch(false);
      }, 800); // Debounce delay

      return () => clearTimeout(timeoutId);
    }
  }, [ingredient, mealName, mealId, maxTime, searchType, hasPerformedSearch, onClear]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let errorMessage = null;

    // Validate based on search type
    if (searchType === 'ingredient') {
      if (!ingredient.trim() && maxTime === '') {
        errorMessage = 'Please enter an ingredient or select a cooking time filter!';
      } else if (ingredient.trim()) {
        errorMessage = validateIngredient(ingredient);
      }
    } else if (searchType === 'name') {
      errorMessage = validateMealName(mealName);
    } else if (searchType === 'meal-id') {
      errorMessage = validateMealId(mealId);
    }

    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    // Mark that we've performed a search (for auto-reset detection)
    setHasPerformedSearch(true);

    // Call appropriate search function based on type
    onSearch({
      searchType,
      ingredient: searchType === 'ingredient' ? ingredient.trim() : undefined,
      mealName: searchType === 'name' ? mealName.trim() : undefined,
      mealId: searchType === 'meal-id' ? mealId.trim() : undefined,
      maxTime: maxTime || undefined
    });
  };

  const handleReset = () => {
    // Check if there are any filters to reset
    if (!hasActiveFilters()) {
      alert('No filters found to reset! 📋');
      return;
    }

    // Clear form fields
    setIngredient('');
    setMealName('');
    setMealId('');
    setMaxTime('');
    setHasPerformedSearch(false);
    
    // Call parent clear function to clear search results
    if (onClear) {
      onClear();
    }
  };

  // Search type configurations
  const searchTypeConfig = {
    ingredient: {
      icon: '🥕',
      title: 'By Ingredient',
      color: 'bg-green-100 border-green-300 text-green-800',
      activeColor: 'bg-green-200 border-green-400'
    },
    name: {
      icon: '🍽️',
      title: 'By Recipe Name',
      color: 'bg-blue-100 border-blue-300 text-blue-800',
      activeColor: 'bg-blue-200 border-blue-400'
    },
    'meal-id': {
      icon: '🆔',
      title: 'By Meal ID',
      color: 'bg-purple-100 border-purple-300 text-purple-800',
      activeColor: 'bg-purple-200 border-purple-400'
    }
  };

  return (
    <div className="search-form bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        What would you like to cook today? ✨
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🔍 Choose Your Search Method
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(searchTypeConfig).map(([type, config]) => (
              <label 
                key={type}
                className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  searchType === type 
                    ? config.activeColor + ' shadow-md transform scale-105' 
                    : config.color + ' hover:bg-opacity-80'
                }`}
              >
                <input
                  type="radio"
                  name="searchType"
                  value={type}
                  checked={searchType === type}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="hidden"
                />
                <div className="text-2xl">{config.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{config.title}</div>
                </div>
                {searchType === type && (
                  <div className="text-green-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Dynamic Search Input based on selected type */}
        {searchType === 'ingredient' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="ingredient" className="block text-sm font-medium text-gray-700 mb-2">
                🥕 Main Ingredient 
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="ingredient"
                  value={ingredient}
                  onChange={(e) => setIngredient(e.target.value)}
                  placeholder="e.g., chicken, tomatoes, pasta, rice..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  maxLength="50"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400 text-sm">{ingredient.length}/50</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter your main ingredient to find recipes
              </p>
            </div>
          </div>
        )}

        {searchType === 'name' && (
          <div>
            <label htmlFor="mealName" className="block text-sm font-medium text-gray-700 mb-2">
              🍽️ Recipe Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="mealName"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g., Arrabiata, Beef Stroganoff, Chicken Curry..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                maxLength="100"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400 text-sm">{mealName.length}/100</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Search for recipes by their exact name
            </p>
          </div>
        )}

        {searchType === 'meal-id' && (
          <div>
            <label htmlFor="mealId" className="block text-sm font-medium text-gray-700 mb-2">
              🆔 Meal ID Number
            </label>
            <div className="relative">
              <input
                type="text"
                id="mealId"
                value={mealId}
                onChange={(e) => setMealId(e.target.value)}
                placeholder="e.g., 52772, 52771, 52768..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                maxLength="10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400 text-sm">{mealId.length}/10</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter meal ID (numbers only, 4-10 digits). Try: 52772
            </p>
          </div>
        )}

        {/* Time Filter - Only show for ingredient search */}
        {searchType === 'ingredient' && (
          <div>
            <label htmlFor="maxTime" className="block text-sm font-medium text-gray-700 mb-2">
              ⏰ Max Cooking Time (Optional)
            </label>
            <select
              id="maxTime"
              value={maxTime}
              onChange={(e) => setMaxTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Any time ⏳</option>
              <option value="15">⚡ Quick (≤15 min)</option>
              <option value="30">🕐 Medium (≤30 min)</option>
              <option value="60">🍳 I have time (≤60 min)</option>
            </select>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-modern flex-1 py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Searching...' : '🔍 Find Recipes'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="sm:w-auto bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 flex items-center justify-center space-x-2"
          >
            <span>🔄</span>
            <span>Reset & Get New Recipe</span>
          </button>
        </div>
      </form>

      {/* Quick Search Suggestions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3 font-medium">💡 Quick suggestions:</p>
        <div className="flex flex-wrap gap-2">
          {searchType === 'ingredient' && 
            ['chicken', 'pasta', 'beef', 'vegetables', 'rice', 'fish'].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setIngredient(suggestion)}
                className="px-4 py-2 text-sm bg-green-50 text-green-700 rounded-full hover:bg-green-100 hover:text-green-800 transition duration-200 border border-green-200 hover:border-green-300"
              >
                🥕 {suggestion}
              </button>
            ))
          }
          {searchType === 'name' && 
            ['Arrabiata', 'Beef Stroganoff', 'Chicken Curry', 'Caesar Salad', 'Fish and Chips', 'Carbonara'].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setMealName(suggestion)}
                className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 hover:text-blue-800 transition duration-200 border border-blue-200 hover:border-blue-300"
              >
                🍽️ {suggestion}
              </button>
            ))
          }
          {searchType === 'meal-id' && 
            ['52772', '52771', '52768', '52764', '52940', '52895'].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setMealId(suggestion)}
                className="px-4 py-2 text-sm bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 hover:text-purple-800 transition duration-200 border border-purple-200 hover:border-purple-300"
              >
                🆔 {suggestion}
              </button>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default SearchForm;