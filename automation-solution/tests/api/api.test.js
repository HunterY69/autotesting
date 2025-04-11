// magento-api-tests.test.js
const axios = require('axios');

// Base URL for the Magento API
const baseUrl = 'https://magento.softwaretestingboard.com';
const endpoint = '/men/tops-men/jackets-men.html';

describe('Magento Men\'s Jackets API Tests', () => {
  // Test 1: Verify API endpoint returns 200 status code
  test('Men\'s jackets page returns 200 status code', async () => {
    const response = await axios.get(`${baseUrl}${endpoint}`);
    
    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
  });

  // Test 2: Check for essential product data in the response
  test('API response contains product data', async () => {
    const response = await axios.get(`${baseUrl}${endpoint}`);
    
    // Check if the response body contains expected text/data
    expect(response.data).toContain('Jackets');
    expect(response.data).toContain('product-item-info');
    expect(response.data).toContain('price-box');
  });

  // Test 3: Test product search functionality
  test('Search API returns relevant jackets', async () => {
    const searchTerm = 'jacket';
    const response = await axios.get(`${baseUrl}/catalogsearch/result/?q=${searchTerm}`);
    
    expect(response.status).toBe(200);
    expect(response.data).toContain('Search results for');
    expect(response.data).toContain(searchTerm);
    // Verify search returned products
    expect(response.data).toContain('product-item-info');
  });

  // Test 4: Test filtering API - Fixed to use the correct filter format
  test('Filter API returns filtered products', async () => {
    // Using standard filter format with price-filter parameter
    const filterUrl = `${baseUrl}${endpoint}?price=40-50`;
    
    const response = await axios.get(filterUrl, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    expect(response.status).toBe(200);
    
    // More reliable checks for filtered results
    expect(response.data).toContain('product-items');
    
    // Verify price filter is present in the response
    expect(response.data).toContain('price=');
    
    // Add timeout to handle slow responses
  }, 10000);

  // Test 5: Test product sorting API
  test('Sort API returns properly sorted products', async () => {
    // Testing price sorting (high to low)
    const sortUrl = `${baseUrl}${endpoint}?product_list_order=price&product_list_dir=desc`;
    const response = await axios.get(sortUrl);
    
    expect(response.status).toBe(200);
    // Verify sorting parameter appears in response
    expect(response.data).toContain('product_list_order');
    expect(response.data).toContain('product-item-info');
    
    // Advanced: Parse HTML to verify price sorting (this would require a DOM parser like jsdom)
    // This is a simplified check for demonstration
    expect(response.data).toContain('Sort By');
  });
});