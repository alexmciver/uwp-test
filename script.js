// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', fetchDataAndPopulate);
// Function to fetch data from Shopify API and populate the product container
function fetchDataAndPopulate() {
  const apiUrl = 'https://uwp-test-store.myshopify.com/api/2021-04/graphql.json';
  const accessToken = '250fac1f178f733cd0b26fe7656e364d';

  // GraphQL query to retrieve product information
  const graphqlQuery = `{ 
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
  }`;

  // Options for the fetch request
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': accessToken,
    },
    body: JSON.stringify({ query: graphqlQuery }),
  };

  fetch(apiUrl, requestOptions)
    .then(response => response.json())
    .then(({ data }) => populateProductContainer(data.products.edges))
    .catch(error => console.error('Error fetching data:', error));
}

// Function to populate the product container with fetched data
function populateProductContainer(products) {
  const productContainer = document.getElementById('product-container');
  productContainer.innerHTML = '';

  // Loop through each product and create product items
  products.forEach(({ node }, index) => {
    const productItem = createProductItem(node, index + 1);
    productContainer.appendChild(productItem);
  });
}

// Function to create a product item element
function createProductItem(productData, index) {
  // Create a new div element for the product item
  const productItem = document.createElement('div');
  productItem.className = `product-item-${index}`;

  // Get the product image source
  const imageSrc = productData?.images?.edges?.[0]?.node?.originalSrc;
  imageSrc && createAndAppend('div', `<img src="${imageSrc}" alt="Product Image ${index}">`, productItem, 'product-image');

  // Get the product tags
  const tags = productData?.tags;
  tags?.length > 0 && createAndAppend('p', `${tags[0]}`, productItem, 'product-tags');

  // Create an h1 element for the product title and append it to the product item
  createAndAppend('h1', productData?.title, productItem, 'product-title');

  // Get the product price information
  const priceNode = productData?.variants?.edges?.[0]?.node?.priceV2;
  if (priceNode) {
    const formattedPrice = `${getCurrencySymbol(priceNode.currencyCode)}${parseFloat(priceNode.amount).toFixed(2)}`;
    createAndAppend('p', formattedPrice, productItem, 'product-price');
  }

  // Create a "Shop Now" button and append it to the product item
  const shopNowButton = createAndAppend('button', 'Shop Now', productItem, 'product-button');
  shopNowButton.addEventListener('click', () => navigateToProduct(productData.handle));

  // Include an SVG icon next to the "Shop Now" button
  createAndAppend('span', getSVGIcon(), shopNowButton, 'svg-icon');

  // Return the created product item
  return productItem;
}

// Function to get the currency symbol based on the currency code
function getCurrencySymbol(currencyCode) {
  const currencySymbols = { USD: '$', GBP: '£' };
  return currencySymbols[currencyCode] || currencyCode;
}

// Function to navigate to the product details page
function navigateToProduct(handle) {
  window.location.href = `https://uwp-test-store.myshopify.com/products/${handle}`;
}

// Function to create and append an HTML element to a parent element
function createAndAppend(tag, content, parent, className) {
  const element = document.createElement(tag);
  element.innerHTML = content;
  // If a class name is provided, set the class name for the element
  className && (element.className = className);
  // Append the element to the parent element
  parent.appendChild(element);
  // Return the created element
  return element;
}

// Function to get the appropriate SVG icon based on screen width
function getSVGIcon() {
  const isMobile = window.innerWidth <= 767;
  return isMobile
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="29" height="10" viewBox="0 0 29 10" fill="none"><path d="M19.9414 9.17744V9.48471H20.0687L20.1587 9.39471L19.9414 9.17744ZM28.4582 0.967875C28.4582 0.798175 28.3207 0.660607 28.151 0.660607L25.3856 0.660607C25.2159 0.660607 25.0783 0.798175 25.0783 0.967874C25.0783 1.13757 25.2159 1.27514 25.3856 1.27514L27.8437 1.27514V3.73328C27.8437 3.90298 27.9813 4.04055 28.151 4.04055C28.3207 4.04055 28.4582 3.90298 28.4582 3.73328V0.967875ZM0.309875 9.48471H19.9414V8.87018H0.309875V9.48471ZM20.1587 9.39471L28.3682 1.18515L27.9337 0.750603L19.7241 8.96017L20.1587 9.39471Z" fill="#333333"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="29" height="10" viewBox="0 0 29 10" fill="none"><path d="M20.1185 9.17745V9.48472H20.2458L20.3358 9.39472L20.1185 9.17745ZM28.6354 0.96788C28.6354 0.798181 28.4978 0.660613 28.3281 0.660613L25.5627 0.660613C25.393 0.660612 25.2554 0.798181 25.2554 0.96788C25.2554 1.13758 25.393 1.27515 25.5627 1.27515L28.0208 1.27515V3.73329C28.0208 3.90299 28.1584 4.04056 28.3281 4.04056C28.4978 4.04056 28.6354 3.90299 28.6354 3.73329V0.96788ZM0.487 9.48472H20.1185V8.87018H0.487V9.48472ZM20.3358 9.39472L28.5454 1.18515L28.1108 0.750609L19.9013 8.96018L20.3358 9.39472Z" fill="#333333"/></svg>';
}
