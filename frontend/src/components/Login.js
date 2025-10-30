import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Static user credentials
  const STATIC_USERS = [
    { email: 'taylor@quickbite.com', password: 'taylor123', name: 'Taylor' },
    { email: 'admin@quickbite.com', password: 'admin123', name: 'Admin User' },
    { email: 'demo@quickbite.com', password: 'demo123', name: 'Demo User' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate input
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      // Check credentials
      const user = STATIC_USERS.find(
        u => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        // Store user info in localStorage
        localStorage.setItem('quickbite_user', JSON.stringify({
          email: user.email,
          name: user.name,
          loginTime: new Date().toISOString()
        }));
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 1000);
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'taylor@quickbite.com',
      password: 'taylor123'
    });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="login-container">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🍽️ QuickBite
          </h1>
          <p className="text-gray-600">Your personal recipe assistant</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="login-input w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="login-input w-full"
              required
            />
          </div>

          {error && (
            <div className="error-message p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-btn w-full py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-3">Demo Credentials:</p>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="demo-btn w-full py-2 px-4 rounded-lg text-sm font-medium"
          >
            Use Demo Account (Taylor)
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default Login;