import { test, expect } from "@playwright/test";
import ExcelJS from "exceljs";

test("Accessibility Compliance for Images", async ({ page }) => {
  // Step 1: Navigate to Nagarro Home Page
  await page.goto("https://www.nagarro.com/en");

  // Step 2: Find all <img> tags
  const images = await page.locator("img").all();
  console.log(`✅ Found ${images.length} images`);

  // Step 3: Extract src, alt, and validate accessibility
  const imageData: { src: string; alt: string; result: string }[] = [];

  for (const img of images) {
    const src = await img.getAttribute("src");
    const alt = await img.getAttribute("alt");
    const result = alt && alt.trim() ? "Pass" : "Fail";

    if (src) {
      imageData.push({ src, alt: alt || "Missing Alt", result });
    }
  }

  console.log("✅ Image data extracted:", imageData);

  // Step 4: Save Data to Excel File
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Image Accessibility");

  // Add headers
  sheet.addRow(["Image URL", "Alt Text", "Result"]);

  // Add extracted data
  imageData.forEach((img) => sheet.addRow([img.src, img.alt, img.result]));

  const filePath = "Image_Accessibility.xlsx";
  await workbook.xlsx.writeFile(filePath);
  console.log(`✅ Excel file saved: ${filePath}`);

  // Step 5: Assertions
  expect(imageData.length).toBeGreaterThan(0);
  console.log("✅ Image accessibility validation completed!");
});
