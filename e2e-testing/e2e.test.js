const puppeteer = require('puppeteer');

describe('YouTube e2e tests', () => {
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

    test('Пошук за "Fitness" та перевірка першого результату на наявність "Fitness" у назві', async () => {
        // Введення "Fitness" в поле пошуку
        await page.type('input#search', 'Fitness');
        await page.click('button.action.search');
        await page.waitForSelector('.products-grid .product-item', { visible: true });
    
        // Отримання назви першого продукту
        const firstProductName = await page.$eval(
          '.products-grid .product-item:first-child .product-item-link',
          el => el.textContent.trim()
        );
    
        // Перевірка, чи містить назва слово "Fitness"
        expect(firstProductName).toMatch(/Fitness/i);
      }, 15000);

    test('Переходить на сторінку товару та перевіряє наявність інформації', async () => {
        // Знаходимо посилання на перший товар на сторінці та переходимо на сторінку товару
        const firstProductLink = await page.$('.product-item-link');
        const productUrl = await firstProductLink.evaluate(el => el.href);
        await firstProductLink.click();
    
        // Очікуємо завершення навігації на сторінку товару
        await page.waitForNavigation();

        // Отримуємо дані із сторінки товару
        const productTitle = await page.$('span.base');
        const productPrice = await page.$('.price');
        const productDescription = await page.$('.product.attribute.description');
    
        // Переконуємося, що отримані дані присутні 
        expect(productTitle).not.toBeNull();
        expect(productPrice).not.toBeNull();
        expect(productDescription).not.toBeNull();
        expect(page.url()).toBe(productUrl);
    });

    test('Додає товар із вибраними розміром та кольором до кошика та перевіряє його наявність в кошику та коректність доданих даних', async () => {
        // Натискання на перший товар
        await page.waitForSelector('.product-item-info', { visible: true });
        await page.click('.product-item-info:first-child a.product-item-link');
    
        // Вибір розміру
        await page.waitForSelector('div.swatch-attribute.size', { visible: true });
        const sizeOptions = await page.$$('div.swatch-attribute.size .swatch-option');
        if (sizeOptions.length > 0) {
            await sizeOptions[3].click(); // Вибір першого доступного розміру
            var selectedSize = await page.evaluate(el => el.getAttribute('option-label'), sizeOptions[3]);
        } else {
            throw new Error('Опції розміру не знайдено');
        }
    
        // Вибір кольору
        await page.waitForSelector('div.swatch-attribute.color', { visible: true });
        const colorOptions = await page.$$('div.swatch-attribute.color .swatch-option');
        if (colorOptions.length > 0) {
            await colorOptions[1].click(); // Вибір другого доступного кольору
            var selectedColor = await page.evaluate(el => el.getAttribute('option-label'), colorOptions[1]);
        } else {
            throw new Error('Опції кольору не знайдено');
        }
    
        // Натискання кнопки "Додати до кошика"
        await page.click('button#product-addtocart-button');
    
        // Очікування оновлення кошика
        await page.waitForSelector('.counter-number', { visible: true });
        const cartCount = await page.$eval('.counter-number', el => parseInt(el.textContent.trim(), 10));
        expect(cartCount).toBeGreaterThan(0);
    
        // Перехід до кошика
        await page.click('.showcart');
        await page.waitForSelector('.action.viewcart', { visible: true });
        await page.click('.action.viewcart');

        console.log("CART SHOWED");
    
        // Перевірка наявності товару в кошику з вибраними опціями
        await page.waitForSelector('.cart.item', { visible: true });
        const cartItemText = await page.$eval('.cart.item .product-item-name a', el => el.textContent.trim());
        expect(cartItemText).toBeTruthy();

        console.log("HERE TEXT", cartItemText);

        // Перевірка обраних опцій розміру та кольору
        const cartItemOptions = await page.$$eval('.cart.item .item-options dd', options =>
            options.map(option => option.textContent.trim())
        );

        console.log("HERE TEXT DETAILS", cartItemOptions);
  
        expect(cartItemOptions).toContain(selectedSize);
        expect(cartItemOptions).toContain(selectedColor);
    }, 15000);

});