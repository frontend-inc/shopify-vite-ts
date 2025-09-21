import React from 'react';
import Products from './products';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 
            className="text-6xl md:text-7xl font-bold text-black mb-8" 
            style={{fontFamily: 'Space Grotesk, sans-serif'}}
          >
            Shop Amazing Products
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Discover our curated collection of premium products, 
            carefully selected to bring you quality and style.
          </p>
          <button 
            className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-lg"
            style={{fontFamily: 'Space Grotesk, sans-serif'}}
            onClick={() => {
              document.querySelector('.products-section')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
          >
            Explore Products
          </button>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <Products 
          title="Featured Products"
          limit={12}
          showLoadMore={true}
        />
      </div>
    </div>
  );
};

export default Home;