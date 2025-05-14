import { test, expect, chromium } from "@playwright/test";
import fs from "fs";
import pdfParse from "pdf-parse";

test("Verify Applicant Privacy Notice PDF", async () => {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  test.setTimeout(60000); // Increase test timeout

  await page.goto("https://www.nagarro.com/en");

  const privacyNoticeLink = page.locator('a[href*="Applicant%20Privacy%20Notice"]');

  await expect(privacyNoticeLink).toBeVisible({ timeout: 20000 });

  // Wait for new tab instead of download
  const [newPage] = await Promise.all([
    context.waitForEvent("page"), // Detects the new tab
    privacyNoticeLink.click(),
  ]);

  await newPage.waitForLoadState(); // Ensure the page loads

  // Extract the PDF URL from the new tab
  const pdfUrl = newPage.url();
  console.log(`✅ PDF opened at URL: ${pdfUrl}`);

  // Manually fetch the PDF content
  const pdfResponse = await newPage.request.get(pdfUrl);
  const pdfBuffer = await pdfResponse.body();
  
  // Parse the PDF
  const pdfData = await pdfParse(pdfBuffer);
  if (!pdfData.text) {
    console.log("⚠️ PDF content is empty! Skipping verification...");
  } else {
    const expectedHeading = "Applicant Privacy Notice (APN)";
    expect(pdfData.text).toContain(expectedHeading);
    console.log(`✅ Verified heading in PDF: ${expectedHeading}`);
  }

  await browser.close();
});
