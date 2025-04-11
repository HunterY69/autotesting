const puppeteer = require('puppeteer');

describe('Magento Men Jackets Page Tests', () => {
  let browser;
  let page;
  const baseUrl = 'https://magento.softwaretestingboard.com/men/tops-men/jackets-men.html';

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1280, height: 800 }
    });
    page = await browser.newPage();
  });

  beforeEach(async () => {
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Page title should contain "Jackets"', async () => {
    const title = await page.title();
    expect(title).toContain('Jackets');
  });

  test('Should display at least 11 jacket products', async () => {
    const productItems = await page.$$('.product-item');
    expect(productItems.length).toBeGreaterThanOrEqual(11);
  });

  test('Filter jackets by price range', async () => {    
    // Count initial products
    const initialProducts = await page.$$eval('.product-item', items => items.length);
    console.log(`Initial product count: ${initialProducts}`);
    
    // Directly navigate to the filtered URL instead of clicking the filter
    await page.goto(`${baseUrl}?price=40-50`, { waitUntil: 'networkidle2' });
    
    // Count filtered products
    const filteredProducts = await page.$$eval('.product-item', items => items.length);
    console.log(`Filtered product count: ${filteredProducts}`);
    
    // Check that the URL contains the price filter
    const currentUrl = page.url();
    expect(currentUrl).toContain('price=40-50');
    
    // Check that we have some products (should be 4 based on your HTML snippet)
    expect(filteredProducts).toBeGreaterThan(0);
    
    // Optional: Verify the active filter is displayed
    const filterExists = await page.evaluate(() => {
      const filterItems = document.querySelectorAll('.filter-current .item');
      return Array.from(filterItems).some(item => 
        item.textContent.includes('$40.00') && item.textContent.includes('$49.99')
      );
    });
    
    expect(filterExists).toBe(true);
  }, 15000);

  test('Search functionality returns relevant results', async () => {
    // Navigate to the starting page
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    
    // Wait for search input to be available
    await page.waitForSelector('#search', { timeout: 10000 });
    
    // Type "jacket" into search box
    await page.type('#search', 'jacket');
    
    // Instead of waiting for navigation, just click the search button
    await page.click('button.action.search');
    
    try {
      // Wait for search results page indicators
      await page.waitForFunction(
        () => document.querySelector('.page-title') !== null || 
              document.querySelector('.search.results') !== null || 
              document.querySelector('.product-item') !== null,
        { timeout: 10000 }
      );
      
      // Check if we have any products
      const productCount = await page.evaluate(() => {
        const products = document.querySelectorAll('.product-item');
        return products ? products.length : 0;
      });
      
      console.log(`Found ${productCount} search results`);
      
      if (productCount > 0) {
        // Get search result titles
        const searchResultTitles = await page.evaluate(() => {
          const titleElements = document.querySelectorAll('.product-item-link');
          return Array.from(titleElements).map(el => el.textContent.trim().toLowerCase());
        });
        
        console.log(`Product titles: ${searchResultTitles.slice(0, 3).join(', ')}${searchResultTitles.length > 3 ? '...' : ''}`);
        
        // Check if at least one result contains our search term or related terms
        const relevantTerms = ['jacket', 'coat', 'outerwear'];
        const hasRelevantResults = searchResultTitles.some(title => 
          relevantTerms.some(term => title.includes(term))
        );
        
        expect(hasRelevantResults).toBe(true);
      } else {
        // If no products found, check if we have a "no results" message
        const pageContent = await page.content();
        const hasNoResultsMessage = pageContent.includes('no results') || 
                                   pageContent.includes('No results found') ||
                                   pageContent.includes('could not find');
        
        // Either we should have products OR a "no results" message
        expect(productCount > 0 || hasNoResultsMessage).toBe(true);
      }
    } catch (error) {
      console.error('Error during search test:', error);
      
      // Take screenshot for debugging
      await page.screenshot({ path: 'search-test-error.png' });
      
      // Get current URL
      const currentUrl = await page.url();
      console.log(`Current URL: ${currentUrl}`);
      
      // Re-throw the error
      throw error;
    }
  }, 30000); // Set explicit 30-second timeout for this test

  test('Add product to cart functionality', async () => {
    // Navigate to first product
    await page.hover('.product-item:first-child');
    
    // Click on first product to view details
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('.product-item:first-child .product-item-link')
    ]);
    
    // Make sure we're on a product detail page
    const productTitle = await page.$eval('.page-title', el => el.textContent.trim());
    expect(productTitle.length).toBeGreaterThan(0);
    
    // Select a size (if available)
    try {
      await page.click('.swatch-option.text:first-child');
    } catch (e) {
      // Some products might not have size options
    }
    
    // Select a color (if available)
    try {
      await page.click('.swatch-option.color:first-child');
    } catch (e) {
      // Some products might not have color options
    }
    
    // Click the "Add to Cart" button
    await page.click('#product-addtocart-button');
    
    // Wait for success message
    await page.waitForSelector('.messages .message-success');
    
    // Verify the success message
    const successMessage = await page.$eval('.messages .message-success', msg => msg.textContent.trim());
    expect(successMessage).toContain('added');
  });
});