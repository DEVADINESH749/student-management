const { chromium } = require("playwright");
const path = require("path");

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
        viewport: { width: 1600, height: 1000 }
    });

    const reportPath = path.resolve("reports/postman-report.html");
    const screenshotPath = path.resolve("reports/postman-report.png");

    await page.goto(`file://${reportPath}`, {
        waitUntil: "networkidle"
    });

    await page.screenshot({
        path: screenshotPath,
        fullPage: true
    });

    await browser.close();

    console.log(`Screenshot created: ${screenshotPath}`);
})();
