import { shopifyFetch } from '../services/shopify/index.js';

// GraphQL query for getting all products
const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!, $sortKey: ProductSortKeys!, $reverse: Boolean, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          id
          title
          description
          descriptionHtml
          handle
          productType
          category {
            id
            name
          }
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
                thumbhash
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
`;

// GraphQL query for getting a single product
const GET_PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      productType
      category {
        id
        name
      }
      options {
        id
        name
        values
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            thumbhash
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
`;

// Get all products
async function getProducts({ first = 20, sortKey = 'COLLECTIONS', reverse = false, query: searchQuery }) {
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

export { getProducts, getProduct, GET_PRODUCTS_QUERY, GET_PRODUCT_QUERY };