import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, getProductRecommendations } from '../services/shopify/api.js';
import { useCart } from '../contexts/CartContext';
import ProductCard from './product-card';

interface ProductImage {
  url: string;
  altText?: string;
}

interface ProductPrice {
  amount: string;
  currencyCode: string;
}

interface ProductVariant {
  id: string;
  title: string;
  price: ProductPrice;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

interface Product {
  id: string;
  title: string;
  description?: string;
  descriptionHtml?: string;
  handle: string;
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
  priceRange: {
    minVariantPrice: ProductPrice;
  };
  compareAtPriceRange?: {
    minVariantPrice: ProductPrice;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
  options: ProductOption[];
}

const ProductDetail: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const { addItem, openCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!handle) return;
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await getProduct(handle);
        
        if (!productData) {
          setError('Product not found');
          return;
        }

        setProduct(productData);
        
        // Set default variant
        const firstVariant = productData.variants.edges[0]?.node;
        if (firstVariant) {
          setSelectedVariant(firstVariant);
          
          // Initialize selected options
          const initialOptions: Record<string, string> = {};
          firstVariant.selectedOptions.forEach(option => {
            initialOptions[option.name] = option.value;
          });
          setSelectedOptions(initialOptions);
        }

        // Fetch recommendations
        if (productData.id) {
          setLoadingRecommendations(true);
          try {
            const recommendations = await getProductRecommendations(productData.id);
            setRecommendedProducts(recommendations);
          } catch (recError) {
            console.error('Error fetching recommendations:', recError);
          } finally {
            setLoadingRecommendations(false);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  const formatPrice = (price: ProductPrice) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currencyCode,
    }).format(parseFloat(price.amount));
  };

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    // Find matching variant
    const matchingVariant = product?.variants.edges.find(({ node }) => {
      return node.selectedOptions.every(option => 
        newOptions[option.name] === option.value
      );
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return;
    
    const firstImage = product.images.edges[0]?.node;
    
    // Add to cart using context
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      title: product.title,
      price: selectedVariant.price,
      image: firstImage?.url,
      quantity,
      variant: {
        title: selectedVariant.title,
        selectedOptions: selectedVariant.selectedOptions,
      },
    });

    // Open cart drawer
    openCart();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery Skeleton */}
          <div>
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse mb-4"></div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Product Info Skeleton */}
          <div>
            <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded mb-6 w-1/3 animate-pulse"></div>
            <div className="h-24 bg-gray-200 rounded mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <i className="ri-error-warning-line text-4xl text-red-500 mb-4"></i>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Product Not Found
          </h3>
          <p className="text-red-600 mb-4">
            {error || 'The requested product could not be found.'}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = product.images.edges.map(edge => edge.node);
  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <div className="min-h-screen bg-white">
      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage].url}
                  alt={images[selectedImage].altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <i className="ri-image-line text-6xl"></i>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-black' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || product.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 
              className="text-4xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(price)}
              </span>
              {hasDiscount && compareAtPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(compareAtPrice)}
                  </span>
                  <div className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded">
                    {Math.round(((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) / parseFloat(compareAtPrice.amount)) * 100)}% OFF
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="text-gray-600 mb-8 text-lg leading-relaxed">
                {product.descriptionHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                ) : (
                  <p>{product.description}</p>
                )}
              </div>
            )}

            {/* Product Options */}
            {product.options.map(option => (
              <div key={option.id} className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {option.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {option.values.map(value => (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(option.name, value)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedOptions[option.name] === value
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <i className="ri-subtract-line"></i>
                </button>
                <span className="flex-1 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <i className="ri-add-line"></i>
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                selectedVariant?.availableForSale
                  ? 'bg-black text-white hover:bg-gray-800 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <i className="ri-truck-line"></i>
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-arrow-go-back-line"></i>
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-secure-payment-line"></i>
                  <span>Secure payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      {(loadingRecommendations || recommendedProducts.length > 0) && (
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 
              className="text-4xl font-bold text-center mb-12 text-gray-900"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              You Might Also Like
            </h2>

            {loadingRecommendations ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded mb-4"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recommendedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {recommendedProducts.slice(0, 4).map((recommendedProduct) => (
                  <ProductCard
                    key={recommendedProduct.id}
                    product={recommendedProduct}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;