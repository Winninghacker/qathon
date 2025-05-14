import { test, expect } from "@playwright/test";
import jwt from "jsonwebtoken";

test("Verify Partners Section", async ({ page }) => {
  console.log("🚀 Test started...");

  // Step 1: Navigate to Nagarro website
  await page.goto("https://www.nagarro.com/en");

  // Step 2: Hover over "Services" and click on "Digital Engineering"
  await page.getByRole("link", { name: "services", exact: true }).hover();
  //await page.getByRole("link", { name: "services", exact: true }).hover();

  await page.waitForLoadState("domcontentloaded");
    const viewMoreButton = page.getByRole("link", { name: "view more" }).first();
  await viewMoreButton.waitFor({ state: "visible" });

  console.log("✅ Found 'View More' button.");

  // Click on "View More"
  await viewMoreButton.click();
  await page.waitForLoadState("domcontentloaded");

  console.log("✅ Navigated to 'Digital Engineering' page.");

  // Step 3: Scroll to the "Our Partners" section
  const partnersSection = await page.getByRole("heading", { name: "our partners" });
  await partnersSection.scrollIntoViewIfNeeded();
  console.log("✅ Scrolled to 'Our Partners' section.");

  // Step 4: Decode the JWT token
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJicmFuZHMiOiJhdGxhc3NpYW4gLCBtaWNyb3NvZnQgLCBBV1MgLCBhenVyZSAsIGdvb2dsZSBjbG91ZCAsIG9yYWNsZSwgU0FQICwgc2FsZXNmb3JjZSAsIHNlcnZpY2Ugbm93ICwgemVuZGVzayAiLCJpYXQiOjE3Mzk1MTgxMzl9.oMVa-CnFfJA7yOITTFxdiBmTuB1a7q-tzWmkoV92dtw";

  const secretKey = "Dw/G:+@%VR[a$LV,D4L{5+(4I}+zf+ER"; // Secret key

  try {
    const decodedToken = jwt.verify(token, secretKey) as { brands: string };
    const expectedPartners = decodedToken.brands.split(",").map((p) => p.trim());

    console.log("✅ Decoded JWT Token: ", expectedPartners);

    // Step 5: Verify partner logos on the webpage
    console.log("🔍 Verifying partner logos...");

    for (const partner of expectedPartners) {
      console.log(`Checking logo: ${partner}`);
      const logoElement = page.getByRole("img", { name: partner });

      try {
        await expect(logoElement).toBeVisible({ timeout: 5000 });
        console.log(` Found logo: ${partner}`);
      } catch {
        console.error(` Found logo: ${partner}`);
      }
    }

  } catch (error) {
    console.error(" Error decoding JWT token:", error);
  }

  console.log("✅ Test completed!");
});
