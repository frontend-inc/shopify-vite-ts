import React from 'react';
import Products from './products';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Products Section */}
      <div className="products-section">
        <Products 
          title="Our Products"
          limit={12}
          showLoadMore={true}
        />
      </div>
    </div>
  );
};

export default Home;