// Define the API URL and access token 
const apiURL = 'https://uwp-test-store.myshopify.com/api/2021-04/graphql.json';
const accessToken = '250fac1f178f733cd0b26fe7656e364d';

// Define the GraphQL query
const graphqlQuery = `
  {
    products(first: 3) {
      edges {
        node {
          id
          title
          handle
          tags
          variants(first: 1) {
            edges {
              node {
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                originalSrc
              }
            }
          }
        }
      }
    }
  }
`;
