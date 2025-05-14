import { test, expect } from "@playwright/test";
import fs from "fs";

test("Extract YouTube captions and save as .srt", async ({ browser }) => {
  const context = await browser.newContext({
    storageState: "chrome_profile.json",
  });
  const page = await context.newPage();

  // Step 1: Navigate to YouTube video
  await page.goto("https://www.youtube.com/watch?v=KcPzcb8bE1I", { waitUntil: "networkidle" });

  // Step 2: Enable captions
  await page.keyboard.press("c");
  await page.waitForTimeout(3000); // Wait for captions to load

  // Step 3: Scroll through video to trigger captions
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("ArrowRight"); // Skip forward
    await page.waitForTimeout(2000);
  }

  // Step 4: Check if captions are available
  const captionsExist = await page.locator(".ytp-caption-segment").count();
  if (captionsExist === 0) {
    console.error("⚠️ No subtitles found. Ensure the video has captions enabled.");
    return;
  }

  // Step 5: Extract captions from the video player
  const captions = await page.evaluate(() => {
    const subtitleElements = document.querySelectorAll(".ytp-caption-segment");
    return Array.from(subtitleElements).map((el, index) => ({
      index: index + 1,
      text: el.textContent?.trim(),
      timestamp: new Date().toISOString().substr(11, 12), // Dummy timestamp
    }));
  });

  // Step 6: Format as .srt
  let srtContent = "";
  captions.forEach((caption) => {
    srtContent += `${caption.index}\n00:00:00,000 --> 00:00:02,000\n${caption.text}\n\n`;
  });

  // Step 7: Save to .srt file
  const filePath = "youtube_captions.srt";
  fs.writeFileSync(filePath, srtContent, "utf-8");

  console.log(`✅ Subtitles saved to ${filePath}`);
});
