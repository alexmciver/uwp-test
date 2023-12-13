// script.js

document.addEventListener('DOMContentLoaded', fetchDataAndPopulate);

function fetchDataAndPopulate() {
  const apiUrl = 'https://uwp-test-store.myshopify.com/api/2021-04/graphql.json';
  const accessToken = '250fac1f178f733cd0b26fe7656e364d';

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

function populateProductContainer(products) {
  const productContainer = document.getElementById('product-container');
  productContainer.innerHTML = ''; // Clear existing content

  products.forEach(({ node }, index) => {
    const productItem = createProductItem(node, index + 1);
    productContainer.appendChild(productItem);
  });
}

function createProductItem(productData, index) {
  const productItem = document.createElement('div');
  productItem.className = `product-item-${index}`;

  const imageSrc = productData?.images?.edges?.[0]?.node?.originalSrc;
  if (imageSrc) {
    const productImage = createAndAppend('div', `<img src="${imageSrc}" alt="Product Image ${index}">`, productItem, 'product-image');
  }

  const tags = productData?.tags;
  if (tags && tags.length > 0) {
    createAndAppend('p', `${tags.join(', ')}`, productItem, 'product-tags');
  }

  createAndAppend('h1', productData?.title, productItem, 'product-title');

  const priceNode = productData?.variants?.edges?.[0]?.node?.priceV2;
  if (priceNode) {
    const currencySymbol = getCurrencySymbol(priceNode.currencyCode);
    const price = `${currencySymbol}${priceNode.amount}`;
    createAndAppend('p', `${price}`, productItem, 'product-price');
  }

  const shopNowButton = createAndAppend('button', 'Shop Now', productItem, 'product-button');
  shopNowButton.addEventListener('click', () => navigateToProduct(productData.handle));

  return productItem;
}

function getCurrencySymbol(currencyCode) {
  const currencySymbols = { USD: '$', GBP: '£' };
  return currencySymbols[currencyCode] || currencyCode;
}

function navigateToProduct(handle) {
  const productUrl = `https://uwp-test-store.myshopify.com/products/${handle}`;
  window.location.href = productUrl;
}

function createAndAppend(tag, content, parent, className) {
  const element = document.createElement(tag);
  element.innerHTML = content;
  if (className) {
    element.className = className;
  }
  parent.appendChild(element);
  return element;
}
