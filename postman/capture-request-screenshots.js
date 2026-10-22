const { chromium } = require("playwright");
const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
    const browser = await chromium.launch({ headless: true });

    const page = await browser.newPage({
        viewport: { width: 1600, height: 1000 }
    });

    const reportPath = path.resolve("reports/postman-report.html");
    const outputDir = path.resolve("reports/requests");

    require("fs").mkdirSync(outputDir, { recursive: true });

    await page.goto(pathToFileURL(reportPath).href, {
        waitUntil: "networkidle"
    });

    await page.evaluate(() => {
        const summary = document.querySelector("#pills-summary");
        const requestsTab = document.querySelector("#pills-requests");

        if (summary) {
            summary.classList.remove("show", "active");
            summary.style.display = "none";
        }

        if (requestsTab) {
            requestsTab.classList.add("show", "active");
            requestsTab.style.display = "block";
        }

        document.querySelectorAll('[id^="collapse-"]').forEach((el) => {
            el.classList.add("show");
            el.style.display = "block";
        });
    });

    const cards = page.locator(
        'div[id^="folder-"]:not([id^="folder-collapse-"])'
    );

    const count = await cards.count();

    console.log(`Found ${count} Postman request cards.`);

    for (let i = 0; i < count; i++) {
        const card = cards.nth(i);

        const header = card.locator('a[id^="requests-"]').first();

        let requestName = await header.innerText();

        requestName = requestName
            .replace(/^Iteration:\s*\d+\s*-\s*/, "")
            .trim();

        const safeName = requestName
            .replace(/[<>:"/\\|?*]+/g, "_")
            .replace(/\s+/g, "_");

        await card.evaluate((el) => {
            const walker = document.createTreeWalker(
                el,
                NodeFilter.SHOW_TEXT
            );

            const nodes = [];

            while (walker.nextNode()) {
                nodes.push(walker.currentNode);
            }

            for (const node of nodes) {
                node.nodeValue = node.nodeValue
                    .replace(/Deva@123/g, "[REDACTED]")
                    .replace(
                        /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
                        "[JWT REDACTED]"
                    )
                    .replace(
                        /Bearer\s+[A-Za-z0-9._-]+/g,
                        "Bearer [REDACTED]"
                    );
            }
        });

        await card.scrollIntoViewIfNeeded();

        const filename =
            String(i + 1).padStart(2, "0") + "_" + safeName + ".png";

        const screenshotPath = path.join(outputDir, filename);

        await card.screenshot({
            path: screenshotPath,
            animations: "disabled"
        });

        console.log(`Created: ${filename}`);
    }

    await browser.close();

    console.log(`\nAll screenshots saved to: ${outputDir}`);
})();
