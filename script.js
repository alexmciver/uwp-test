

// Define the API URL and access token
const apiUrl = 'https://uwp-test-store.myshopify.com/api/2021-04/graphql.json';
const accessToken = '250fac1f178f733cd0b26fe7656e364d';

// Define the GraphQL query
const graphqlQuery = `
  {
    products(first: 3) {
      edges {
        node {
          id
          title
          descriptionHtml
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
  const currencySymbols = {
    USD: '$',
    GBP: '£',
    // Add more currencies as needed
  };
  return currencySymbols[currencyCode] || currencyCode;
}

// Function to create and append HTML elements with a unique class
function createAndAppend(tag, content, parent, className) {
  const element = document.createElement(tag);
  element.innerHTML = content;
  if (className) {
    element.className = className;
  }
  parent.appendChild(element);
}

// Function to navigate to the product page
function navigateToProduct(handle) {
  // Construct the product URL based on the handle
  const productUrl = `https://uwp-test-store.myshopify.com/products/${handle}`;
  // Navigate to the product URL
  window.location.href = productUrl;
}

// Make the API request
fetch(apiUrl, requestOptions)
  .then(response => response.json())
  .then(({ data }) => {
    // Get the product container element from the DOM
    const productContainer = document.getElementById('product-container');

    // Iterate through the products and create HTML elements for each
    data?.products?.edges?.forEach(({ node }, index) => {
      const productElement = document.createElement('div');
      const uniqueClassName = `product-item-${index + 1}`; // Unique class name like 'product-item-1', 'product-item-2', etc.
      productElement.className = uniqueClassName;

      // Check if there is an image, and if so, create an image element
      const imageSrc = node?.images?.edges?.[0]?.node?.originalSrc;
      if (imageSrc) {
        const image = Object.assign(document.createElement('img'), { src: imageSrc });
        productElement.appendChild(image);
      }

      // Display product tags if available
      const tags = node?.tags;
      if (tags && tags.length > 0) {
        createAndAppend('p', `Tags: ${tags.join(', ')}`, productElement);
      }

      createAndAppend('h1', node?.title, productElement);

      // Display the price information with dynamic currency symbol
      const priceNode = node?.variants?.edges?.[0]?.node?.priceV2;
      if (priceNode) {
        const currencySymbol = getCurrencySymbol(priceNode.currencyCode);
        const price = `${currencySymbol}${priceNode.amount}`;
        createAndAppend('p', `Price: ${price}`, productElement);
      }

      // Create a "Shop Now" button and append it to the product element
      const shopNowButton = Object.assign(document.createElement('button'), {
        innerText: 'Shop Now',
        // Add a click event listener to navigate to the product URL
        onclick: () => navigateToProduct(node.handle),
      });
      productElement.appendChild(shopNowButton);

      // Append the product element to the product container
      productContainer.appendChild(productElement);
    });
  })
  .catch(error => console.error('Error fetching data:', error));

