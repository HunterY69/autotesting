const puppeteer = require('puppeteer');

async function runTests() {
  // Launching the browser
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50 // Slows down operations by 50ms - helpful for watching tests
  });
  
  const page = await browser.newPage();
  
  try {
    // Test 1: Checking page title and header to contain "Jackets - Tops - Men" for title and "Jackets" for header
    console.log('Running Test 1: Page Title and Header');
    await page.goto('https://magento.softwaretestingboard.com/men/tops-men/jackets-men.html');
    await page.waitForSelector('.page-title');
    
    // Getting the page title
    const pageTitle = await page.title();
    console.assert(pageTitle.includes('Jackets - Tops - Men'), 
      `Page title check failed. Expected title to contain "Jackets - Tops - Men", but got: ${pageTitle}`);
    
    // Checking the header text
    const headerText = await page.$eval('.page-title span', el => el.textContent.trim());
    console.assert(headerText === 'Jackets', 
      `Header text check failed. Expected "Jackets", but got: ${headerText}`);
    
    console.log('Test 1 passed!');
    
    // Test 2: Checking  that products exist on the page
    console.log('Running Test 2: Products Existence');
    await page.waitForSelector('.products.list.items.product-items');
    
    // Counting the number of products
    const productCount = await page.$$eval('.product-item', items => items.length);
    console.assert(productCount > 0, 
      `Product count check failed. Expected more than 0 products, but got: ${productCount}`);
    
    console.log(`Found ${productCount} products on the page.`);
    console.log('Test 2 passed!');
    
    // Test 3: Checking that filters functionality exists
    console.log('Running Test 3: Filters Functionality');
    // Verifying filters sidebar exists
    await page.waitForSelector('.filter-options');
    
    // Checking if at least one filter option is present
    const filterOptions = await page.$$eval('.filter-options-item', items => items.length);
    console.assert(filterOptions > 0, 
      `Filter options check failed. Expected filter options to exist, but found: ${filterOptions}`);
    
    // Checking filter title for price filter
    const priceFilterExists = await page.evaluate(() => {
      const filters = Array.from(document.querySelectorAll('.filter-options-title'));
      return filters.some(filter => filter.textContent.includes('Price'));
    });
    
    console.assert(priceFilterExists, 'Price filter not found on the page');
    
    console.log(`Found ${filterOptions} filter options on the page.`);
    console.log('Test 3 passed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

runTests();