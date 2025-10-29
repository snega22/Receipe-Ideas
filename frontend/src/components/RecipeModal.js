import React from 'react';

const RecipeModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  // Extract ingredients and measurements
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : ''
      });
    }
  }

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{recipe.strMeal}</h2>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {recipe.strCategory}
              </span>
              {recipe.strArea && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  📍 {recipe.strArea}
                </span>
              )}
              <span className={`px-2 py-1 rounded-full font-medium ${getTimeColor(recipe.estimatedTime)}`}>
                ⏰ {recipe.estimatedTime} min
              </span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                {getMoodEmoji(recipe.moodCategory)} {recipe.moodCategory}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Image */}
            <div>
              <img 
                src={recipe.strMealThumb} 
                alt={recipe.strMeal}
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-md"
              />

              {/* YouTube Video Link */}
              {recipe.strYoutube && (
                <div className="mt-4">
                  <a
                    href={recipe.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    <span>📺</span>
                    <span>Watch Video Tutorial</span>
                  </a>
                </div>
              )}

              {/* Source Link */}
              {recipe.strSource && (
                <div className="mt-2">
                  <a
                    href={recipe.strSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition duration-200"
                  >
                    <span>🔗</span>
                    <span>View Original Recipe</span>
                  </a>
                </div>
              )}
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🛒 Ingredients</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {ingredients.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="flex-1">
                        <span className="font-medium">{item.measure}</span>{' '}
                        <span>{item.ingredient}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Shopping List */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    const list = ingredients.map(item => 
                      `${item.measure} ${item.ingredient}`
                    ).join('\n');
                    navigator.clipboard.writeText(list);
                    alert('Shopping list copied to clipboard!');
                  }}
                  className="text-sm bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition duration-200"
                >
                  📋 Copy Shopping List
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">👨‍🍳 Instructions</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="prose prose-gray max-w-none">
                {recipe.strInstructions.split('\n').map((paragraph, index) => {
                  if (paragraph.trim()) {
                    return (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>

          {/* Tags */}
          {recipe.strTags && (
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-800 mb-2">🏷️ Tags</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.strTags.split(',').map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
            >
              🖨️ Print Recipe
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
            >
              ← Back to Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;