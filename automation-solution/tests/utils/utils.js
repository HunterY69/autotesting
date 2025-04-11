async function waitForSelector(page, selector, timeout = 5000) {
    await page.waitForSelector(selector, { timeout });
    return page.$(selector);
  }
  
async function clickAndWaitForNavigation(page, selector) {
    return Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click(selector)
    ]);
}
  
async function getTextContent(page, selector) {
    return page.$eval(selector, el => el.textContent.trim());
}
  
async function isElementVisible(page, selector) {
    return page.evaluate((sel) => {
        const element = document.querySelector(sel);
        if (!element) return false;
        const style = window.getComputedStyle(element);
        return style && style.display !== 'none' && style.visibility !== 'hidden';
    }, selector);
}
  
module.exports = {
    waitForSelector,
    clickAndWaitForNavigation,
    getTextContent,
    isElementVisible
};