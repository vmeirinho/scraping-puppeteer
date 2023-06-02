const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

// Example route to scrape a website
app.get('/api/scrape', async (req, res) => {
  try {
    const url = req.query.url;

    // Validate URL
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto(url);

    // Extract data from the page
    const data = await page.evaluate(() => {
      const title = document.querySelector('h1').textContent;
      const description = document.querySelector('p').textContent;

      return { title, description };
    });

    // Close the browser
    await browser.close();

    res.json(data);
  } catch (error) {
    console.error('Error scraping website:', error);
    res.status(500).json({ error: 'Failed to scrape website' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
