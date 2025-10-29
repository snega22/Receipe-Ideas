import React, { useState, useEffect } from 'react';

const RecipeCard = ({ recipe, onClick, isFavorite, toggleFavorite }) => {
  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      comfort: '🍲',
      healthy: '🥗',
      spicy: '🌶️',
      light: '🐟',
      hearty: '🥘'
    };
    return moodEmojis[mood] || '🍽️';
  };

  const getTimeColor = (time) => {
    if (time <= 15) return 'text-green-600 bg-green-100';
    if (time <= 30) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div 
      onClick={() => onClick(recipe.idMeal)}
      className="recipe-card group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Favorite Heart Button - TOP LEFT */}
        <button
          onClick={(e) => toggleFavorite(recipe, e)}
          className={`absolute top-3 left-3 p-2 rounded-full transition-all duration-200 ${
            isFavorite(recipe.idMeal)
              ? 'bg-white/90 shadow-lg'
              : 'bg-white/80 hover:bg-white/90'
          }`}
          title={isFavorite(recipe.idMeal) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg 
            className={`w-5 h-5 transition-colors duration-200 ${
              isFavorite(recipe.idMeal) 
                ? 'fill-red-500 stroke-red-600' 
                : 'fill-none stroke-gray-700 hover:stroke-red-500'
            }`}
            strokeWidth="2" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>

        {/* Cooking Time - TOP RIGHT */}
        {recipe.estimatedTime && (
          <div className="absolute top-3 right-3">
            <span className="time-tag bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
              ⏰ {recipe.estimatedTime}min
            </span>
          </div>
        )}

        {/* Category Tag - BOTTOM LEFT */}
        <div className="absolute bottom-3 left-3">
         
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {recipe.strMeal}
        </h3>
        {/* <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center">
            🌍 {recipe.strArea || 'International'}
          </span>
          <span className="text-blue-600 font-medium group-hover:underline">
            View Recipe →
          </span>
        </div> */}
      </div>
    </div>
  );
};

const RecipeGrid = ({ recipes, onRecipeClick, loading }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('quickbite_favorites');
    if (savedFavorites) {
      const favoritesData = JSON.parse(savedFavorites);
      setFavorites(favoritesData.map(fav => fav.idMeal));
    }
  };

  const toggleFavorite = (recipe, e) => {
    // Prevent the click from bubbling up to the recipe card
    e.preventDefault();
    e.stopPropagation();
    
    console.log('❤️ Heart clicked for:', recipe.strMeal);
    
    const savedFavorites = localStorage.getItem('quickbite_favorites');
    let favoritesData = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    const isCurrentlyFavorite = favoritesData.some(fav => fav.idMeal === recipe.idMeal);
    
    if (isCurrentlyFavorite) {
      // Remove from favorites
      favoritesData = favoritesData.filter(fav => fav.idMeal !== recipe.idMeal);
      setFavorites(prev => prev.filter(id => id !== recipe.idMeal));
      console.log('✅ Removed from favorites');
    } else {
      // Add to favorites
      favoritesData.push({
        idMeal: recipe.idMeal,
        strMeal: recipe.strMeal,
        strMealThumb: recipe.strMealThumb,
        strCategory: recipe.strCategory,
        strArea: recipe.strArea,
        addedAt: new Date().toISOString()
      });
      setFavorites(prev => [...prev, recipe.idMeal]);
      console.log('✅ Added to favorites');
    }
    
    localStorage.setItem('quickbite_favorites', JSON.stringify(favoritesData));
  };

  const isFavorite = (recipeId) => {
    return favorites.includes(recipeId);
  };

  const handleRecipeClick = (recipe) => {
    console.log('🍽️ Recipe card clicked for:', recipe.strMeal);
    onRecipeClick(recipe);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading recipes...</span>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">No recipes found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or browse our suggestions!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <div 
          key={recipe.idMeal} 
          className="recipe-card group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => handleRecipeClick(recipe)}
        >
          <div className="relative overflow-hidden rounded-t-xl">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Favorite Heart Button - TOP LEFT */}
            <div 
              className="absolute top-3 left-3 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => toggleFavorite(recipe, e)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isFavorite(recipe.idMeal)
                    ? 'bg-white/95 shadow-lg'
                    : 'bg-white/85 hover:bg-white/95 shadow-md'
                }`}
                title={isFavorite(recipe.idMeal) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg 
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isFavorite(recipe.idMeal) 
                      ? 'fill-red-500 stroke-red-600' 
                      : 'fill-none stroke-gray-700 hover:stroke-red-500'
                  }`}
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
            </div>

            {/* Cooking Time - TOP RIGHT */}
            {recipe.estimatedTime && (
              <div className="absolute top-3 right-3">
                <span className="time-tag bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ⏰ {recipe.estimatedTime}min
                </span>
              </div>
            )}

            {/* Category Tag - BOTTOM LEFT */}
            <div className="absolute bottom-3 left-3">
              {/* <span className="category-tag bg-blue-500/80 text-white px-2 py-1 rounded-full text-xs font-medium">
                {recipe.strCategory}
              </span> */}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {recipe.strMeal}
            </h3>
            <div className="absolute bottom-3 right-3 text-sm text-gray-600">
              <span className="text-blue-600 font-medium group-hover:underline">
                View Recipe 👆
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeGrid;