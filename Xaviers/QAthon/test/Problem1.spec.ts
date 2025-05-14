import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { createCanvas, loadImage } from "canvas";
import jsQR from "jsqr";
 
test("Scan QR code from file and navigate to URL", async ({ page }) => {
  // Define a dynamic path relative to the project directory
  const qrImagePath = path.resolve(
    process.cwd(),
    "Screenshots",
    "qr-code.png"
  );
 
  // Verify that the QR code image exists
  if (!fs.existsSync(qrImagePath)) {
    throw new Error(`QR code image not found at: ${qrImagePath}`);
  }
 
  // Decode the QR code to extract the URL
  const qrURL = await decodeQRCode(qrImagePath);
 
  if (!qrURL) {
    throw new Error("Failed to decode QR code");
  }
 
  console.log("Extracted URL:", qrURL);
 
  // Navigate to the URL extracted from the QR code
  await page.goto(qrURL);
 
  // Verify that the navigation was successful
  await expect(page).toHaveURL(qrURL);
});
 
// Function to decode the QR code from an image file path
async function decodeQRCode(imagePath) {
  try {
    // Load the image
    const img = await loadImage(imagePath);
 
    // Create a canvas with the same dimensions as the image
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
 
    // Get the image data from the canvas
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
 
    // Decode the QR code using jsQR
    const code = jsQR(imageData.data, img.width, img.height);
 
    return code ? code.data : null;
  } catch (error) {
    console.error("Error decoding QR code:", error);
    return null;
  }
}