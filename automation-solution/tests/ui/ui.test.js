const puppeteer = require('puppeteer');

describe('ui tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        // browser = await puppeteer.launch({ headless: true });
        browser = await puppeteer.launch({ headless: false });

        page = await browser.newPage();
        await page.goto("https://magento.softwaretestingboard.com/men/tops-men/jackets-men.html", {waitUntil: 'networkidle2'});
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Перевіряємо назву сторінки', async () => {
        const title = await page.title();
        expect(title).toContain('Jackets - Tops - Men');
      });

    test('Перевіряємо наявність списку товарів та відповідність вказаній кількості на сайті', async () => {
        const productCount = await page.$eval('.toolbar-amount', el => {
        return parseInt(el.textContent.trim().split(' ').filter(word => !isNaN(word))[0]);
    });
    
        const actualProducts = await page.$$eval('.product-item', items => items.length);
        expect(actualProducts).toBeGreaterThan(0);
        expect(actualProducts).toBeLessThanOrEqual(productCount);
    });
      
    test('Перевіряємо чи нопка "Add to Cart" видима та її можна натиснути', async () => {
        const addToCartButton = await page.$('.product-item:first-child .action.tocart');
        expect(addToCartButton).not.toBeNull();
        const isButtonEnabled = await addToCartButton.evaluate(button => !button.disabled);
        expect(isButtonEnabled).toBe(true);
    });

    test('Перевіряємо чи фільтри зроблені видимими', async () => {
        const filterSection = await page.$('.filter-options');
        expect(filterSection).not.toBeNull();
        const isFilterVisible = await filterSection.evaluate(el => el.offsetWidth > 0 && el.offsetHeight > 0);
        expect(isFilterVisible).toBe(true);
    });

    test('Перевіряємо сторінку на вміст хедера, футера, меню навігації та пошукової форми', async () => {
        // Перевірка хедера
        const header = await page.$('header');
        expect(header).not.toBeNull();
        const isHeaderVisible = await header.evaluate(el => el.offsetWidth > 0 && el.offsetHeight > 0);
        expect(isHeaderVisible).toBe(true);

        // Перевірка футера
        const footer = await page.$('footer');
        expect(footer).not.toBeNull();
        const isFooterVisible = await footer.evaluate(el => el.offsetWidth > 0 && el.offsetHeight > 0);
        expect(isFooterVisible).toBe(true);

        // Перевірка меню навігації
        const navMenu = await page.$('nav');
        expect(navMenu).not.toBeNull();
        const isNavMenuVisible = await navMenu.evaluate(el => el.offsetWidth > 0 && el.offsetHeight > 0);
        expect(isNavMenuVisible).toBe(true);

        // Перевірка пошукової форми
        const searchForm = await page.$('#search_mini_form');
        expect(searchForm).not.toBeNull();
        const isSearchFormVisible = await searchForm.evaluate(el => el.offsetWidth > 0 && el.offsetHeight > 0);
        expect(isSearchFormVisible).toBe(true);
    });
      
});