const puppeteer = require('puppeteer');

describe('YouTube UI tests', () => {
let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('https://www.youtube.com'),
    {
        waitUntil: 'networkidle2'
    };
});

afterAll(async () => {
    await browser.close();
});

test('1. Перевірка заголовку сторінки', async () => {
    const title = await page.title();
    expect(title).toContain('YouTube');
});

test('2. Перевірка наявності логотипу YouTube', async () => {
    const logo = await page.$('a#logo');
    expect(logo).not.toBeNull();
});

test('3. Перевірка наявності поля пошуку', async () => {
    const searchInput = await page.$("input.yt-searchbox-input");
    expect(searchInput).not.toBeNull();
});

test('4. Перевірка пошуку за запитом "puppeteer"', async () => {
    await page.type('input.yt-searchbox-input', 'puppeteer');
    await Promise.all([
        page.keyboard.press('Enter'),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
    const url = page.url();
    expect(url).toContain('search_query=puppeteer');
});

test('5. Перевірка наявності відео у результатах пошуку', async () => {
    const videos = await page.$$('ytd-video-renderer');
    expect(videos.length).toBeGreaterThan(0);
});

});