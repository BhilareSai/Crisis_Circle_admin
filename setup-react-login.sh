#!/bin/bash

# React.js Login Project Setup Script
echo "🚀 Setting up React.js Login Project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Project name
PROJECT_NAME="react-login-app"

echo "📁 Creating React application: $PROJECT_NAME"
npx create-react-app $PROJECT_NAME

# Navigate to project directory
cd $PROJECT_NAME

echo "📝 Creating project structure..."

# Create components directory
mkdir -p src/components
mkdir -p src/styles

# Create Login component
cat > src/components/Login.js << 'EOF'
import React, { useState } from 'react';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (formData.email && formData.password) {
      console.log('Login attempt:', formData);
      setIsLoggedIn(true);
      alert('Login successful!');
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFormData({ email: '', password: '' });
  };

  if (isLoggedIn) {
    return (
      <div className="welcome-container">
        <h2>Welcome!</h2>
        <p>You have successfully logged in.</p>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
EOF

# Create CSS for Login component
cat > src/styles/Login.css << 'EOF'
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e1e1;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
}

.welcome-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.welcome-container h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.welcome-container p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.logout-btn {
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: white;
  color: #667eea;
}
EOF

# Update App.js
cat > src/App.js << 'EOF'
import React from 'react';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
EOF

# Update App.css
cat > src/App.css << 'EOF'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.App {
  text-align: center;
}
EOF

echo "✅ Project setup complete!"
echo ""
echo "📋 Project Structure:"
echo "   $PROJECT_NAME/"
echo "   ├── src/"
echo "   │   ├── components/"
echo "   │   │   └── Login.js"
echo "   │   ├── styles/"
echo "   │   │   └── Login.css"
echo "   │   ├── App.js"
echo "   │   └── App.css"
echo "   └── package.json"
echo ""
echo "🚀 To start your project:"
echo "   cd $PROJECT_NAME"
echo "   npm start"
echo ""
echo "🌐 Your app will open at: http://localhost:3000"
echo ""
echo "📌 Test credentials: Any valid email and password will work"
echo "   Example: test@example.com / password123"