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

// Configure the request options 
const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
    },
    body: JSON.stringify({ query: graphqlQuery }),
};

// Function to get the currency symbol based on the currency code 
function getCurrencySymbol(currencyCode) {
    const CurrencySymbols = {
        USD: '$',
        GBP: '£',
    };
    return CurrencySymbols[currencyCode] || currencyCode;
}

// Function to create and append HTML elements 
function createAndAppend(tag, content, parent) {
    const element = document.createElement(tag);
    element.innerHTML = content;
    parent.appendChild(element);
}

// Function to navigate to the product page after clicking on the Shop Now button 
function navigateToProduct(handle) {
    // Construct the product URL based on the handle of the product 
    const productUrl = 'https://uwp-test-store.myshopify.com/products/${handle}';
    // Navigate to the clicked on product URL 
    window.location.href = productUrl;
}
