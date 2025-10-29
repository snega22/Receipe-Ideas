import React, { useState, useRef, useEffect } from 'react';

const Header = ({ onFeatureClick, user, onLogout, onShowFavorites }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const features = [
    { id: 'quick', label: 'Quick & Easy', color: 'green', icon: '⚡' },
    { id: 'ingredient', label: 'Ingredient-Based', color: 'blue', icon: '🥗' },
    { 
      id: 'favorites', 
      label: 'Favorites', 
      color: 'purple', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      )
    },
  ];

  const handleFeatureClick = (featureId) => {
    if (featureId === 'favorites') {
      onShowFavorites();
    } else if (onFeatureClick) {
      onFeatureClick(featureId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('quickbite_user');
    localStorage.removeItem('quickbite_favorites');
    setIsUserMenuOpen(false);
    onLogout();
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="logo-container relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41-6.88-6.88 1.37-1.37z"/>
                </svg>
              </div>
            </div>
            
            {/* Brand Text */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold brand-gradient leading-tight">
                QuickBite
              </h1>
              <p className="text-sm text-gray-500 font-medium tracking-wide">
                Recipe ideas for busy lives
              </p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-2">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature.id)}
                  className={`feature-button px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex items-center ${
                    feature.color === 'green' 
                      ? 'text-green-700 bg-green-50 hover:bg-green-100 border border-green-200' 
                      : feature.color === 'blue'
                      ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200'
                      : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  <span className="mr-2">
                    {typeof feature.icon === 'string' ? feature.icon : feature.icon}
                  </span>
                  {feature.label}
                </button>
              ))}
            </nav>

            {/* User Menu Dropdown */}
            {user && (
              <div className="relative ml-4 pl-4 border-l border-gray-200" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>Hi, {user.name}!</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="space-y-2">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => { 
                    handleFeatureClick(feature.id); 
                    setIsMenuOpen(false); 
                  }}
                  className={`w-full text-left py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center ${
                    feature.color === 'green' 
                      ? 'text-green-700 bg-green-50 hover:bg-green-100' 
                      : feature.color === 'blue'
                      ? 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                      : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                  }`}
                >
                  <span className="mr-3">
                    {typeof feature.icon === 'string' ? feature.icon : feature.icon}
                  </span>
                  {feature.label}
                </button>
              ))}
              
              {user && (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600 border-t border-gray-200 mt-2 pt-4 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>Hi, {user.name}!</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-3 px-4 rounded-lg font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;