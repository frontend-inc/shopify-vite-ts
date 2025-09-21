import { shopifyFetch } from '../services/shopify/index.js';

// GraphQL query for getting collections
const GET_COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

// GraphQL query for getting products from a collection
const GET_COLLECTION_PRODUCTS_QUERY = `
  query getCollectionProducts($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys!, $reverse: Boolean) {
    collection(handle: $handle) {
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
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
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Get collections
async function getCollections(first = 10) {
  const response = await shopifyFetch({
    query: GET_COLLECTIONS_QUERY,
    variables: { first },
  });

  const { data } = response;
  return data.collections.edges.map(edge => edge.node);
}

// Get products from a specific collection
async function getCollectionProducts({
  collection,
  limit = 20,
  sortKey = 'COLLECTION_DEFAULT',
  reverse = false,
}) {
  const response = await shopifyFetch({
    query: GET_COLLECTION_PRODUCTS_QUERY,
    variables: { handle: collection, first: limit, sortKey, reverse },
  });

  const { data } = response;

  if (!data.collection) {
    return [];
  }

  return data.collection.products.edges.map(edge => edge.node);
}

export { 
  getCollections, 
  getCollectionProducts, 
  GET_COLLECTIONS_QUERY, 
  GET_COLLECTION_PRODUCTS_QUERY 
};