import { shopifyFetch } from '../services/shopify/index.js';

// Product Fragment for reusable fields
const ProductFragment = `
  fragment ProductFragment on Product {
    id
    title
    description
    descriptionHtml
    handle
    productType
    options {
      id
      name
      values
    }
    images(first: 5) {
      edges {
        node {
          url
          altText
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

// GraphQL query for getting all products
const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!, $sortKey: ProductSortKeys!, $reverse: Boolean, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          ...ProductFragment
        }
      }
    }
  }
  ${ProductFragment}
`;

// GraphQL query for getting a single product
const GET_PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
  ${ProductFragment}
`;

// GraphQL query for product recommendations
const QUERY_PRODUCT_RECOMMENDATIONS = `
  query ProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductFragment
    }
  }
  ${ProductFragment}
`;

// Get all products
async function getProducts({ first = 20, sortKey = 'CREATED_AT', reverse = false, query: searchQuery }) {
  const response = await shopifyFetch({
    query: GET_PRODUCTS_QUERY,
    variables: { first, sortKey, reverse, query: searchQuery },
  });

  const { data } = response;
  return data.products.edges.map(edge => edge.node);
}

// Get single product by handle
async function getProduct(handle) {
  const response = await shopifyFetch({
    query: GET_PRODUCT_QUERY,
    variables: { handle },
  });

  const { data } = response;
  return data.product;
}

// Get product recommendations
async function getProductRecommendations(productId) {
  try {
    const response = await shopifyFetch({
      query: QUERY_PRODUCT_RECOMMENDATIONS,
      variables: { productId },
    });

    const { data } = response;
    return data.productRecommendations || [];
  } catch (error) {
    console.error('Error fetching product recommendations:', error);
    return [];
  }
}

export { 
  getProducts, 
  getProduct, 
  getProductRecommendations,
  GET_PRODUCTS_QUERY, 
  GET_PRODUCT_QUERY, 
  QUERY_PRODUCT_RECOMMENDATIONS,
  ProductFragment 
};