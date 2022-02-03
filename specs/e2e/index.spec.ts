import puppeteer from "puppeteer"

describe('Homepage', () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('http://localhost:8080');
    });

    it('should contain "Genesis" in the title', async () => {
        await expect(page.title()).resolves.toContain('Genesis');
    });
});