import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from '@/components/Home';
import About from './components/About';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link to="/" className="text-2xl font-bold text-black" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
                Store
              </Link>
              
              {/* Navigation Links */}
              <div className="flex space-x-8">
                <Link 
                  to="/" 
                  className="text-black hover:text-gray-600 font-medium transition-colors"
                  style={{fontFamily: 'Space Grotesk, sans-serif'}}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="text-black hover:text-gray-600 font-medium transition-colors"
                  style={{fontFamily: 'Space Grotesk, sans-serif'}}
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-black text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 
              className="text-2xl font-bold mb-4" 
              style={{fontFamily: 'Space Grotesk, sans-serif'}}
            >
              Store
            </h3>
            <p className="text-gray-400 mb-6">
              Your premium shopping destination
            </p>
            <div className="flex justify-center space-x-6">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                About
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-gray-400">
              <p>&copy; 2025 Store. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;