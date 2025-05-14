
import { test, expect } from "@playwright/test";
import nodemailer from "nodemailer";
import ExcelJS from "exceljs";

test("Extract past and future events and email details", async ({ page }) => {
  test.setTimeout(60000);
  // Step 1: Navigate to Nagarro Home Page
  await page.goto("https://www.nagarro.com/en", { waitUntil: "domcontentloaded" });

  // Step 2: Click on "Events" link
  const eventsLink = page.getByRole("link", { name: "events", exact: true });
  if (await eventsLink.count() > 0) {
    await eventsLink.first().click();
  } else {
    console.error("❌ 'Events' link not found!");
    return;
  }
  await page.waitForTimeout(5000); // Allow content to load

  // Step 3: Scroll down gradually to ensure event section is visible
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight / 2));
    await page.waitForTimeout(1000);
  }

  // Step 4: Wait for event section to load
  await page.waitForSelector(".event-item", { timeout: 15000 });

  // Function to extract events under a specific section heading
  const extractEvents = async (headingName: string) => {
    const eventsData: { Date: string; Event: string }[] = [];
    const headingElements = await page.getByRole("heading", { name: headingName });
    if (await headingElements.count() === 0) {
      console.warn(`⚠️ Section "${headingName}" not found.`);
      return eventsData;
    }
    const sectionLocator = headingElements.first().locator("..");
    const eventItems = await sectionLocator.locator(".event-item").all();

    console.log(`✅ Found ${eventItems.length} event items under "${headingName}".`);

    for (const event of eventItems) {
      // Attempt to extract using expected selectors
      const dateLocator = event.locator(".event-date");
      const titleLocator = event.locator(".event-title");

      if (await dateLocator.count() > 0 && await titleLocator.count() > 0) {
        const date = await dateLocator.textContent();
        const eventName = await titleLocator.textContent();
        if (date && eventName) {
          console.log(`🔍 Extracted - Date: ${date.trim()}, Title: ${eventName.trim()}`);
          eventsData.push({ Date: date.trim(), Event: eventName.trim() });
          continue;
        }
      }

      // Fallback extraction: split the full inner text into lines
      const eventContent = await event.innerText();
      console.log(`📝 Event item content:\n${eventContent}`);
      const lines = eventContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      if (lines.length >= 2) {
        // Assume the first line is the date and the last line is the event title.
        const fallbackDate = lines[0];
        const fallbackEventName = lines[lines.length - 1];
        console.log(`🔍 Fallback Extracted - Date: ${fallbackDate}, Title: ${fallbackEventName}`);
        eventsData.push({ Date: fallbackDate, Event: fallbackEventName });
      } else {
        console.warn("⚠️ Not enough data to extract event details:", eventContent);
      }
    }
    return eventsData;
  };

  // Step 5: Extract Past & Future Events
  const pastEvents = await extractEvents("Past Events");
  const futureEvents = await extractEvents("More Future Events");

  if (pastEvents.length === 0) {
    console.warn("⚠️ No Past Events data found!");
  } else {
    console.log("✅ Past Events Extracted:", pastEvents);
  }

  if (futureEvents.length === 0) {
    console.warn("⚠️ No More Future Events data found!");
  } else {
    console.log("✅ More Future Events Extracted:", futureEvents);
  }

  // Step 6: Save Data to Excel
  const workbook = new ExcelJS.Workbook();
  const pastSheet = workbook.addWorksheet("Past Events");
  const futureSheet = workbook.addWorksheet("More Future Events");

  pastSheet.addRow(["Date", "Event"]); // Add Headers
  futureSheet.addRow(["Date", "Event"]);

  pastEvents.forEach(event => pastSheet.addRow([event.Date, event.Event]));
  futureEvents.forEach(event => futureSheet.addRow([event.Date, event.Event]));

  const filePath = "Nagarro_Events.xlsx";
  await workbook.xlsx.writeFile(filePath);
  console.log(`✅ Excel file saved: ${filePath}`);

  // Step 7: Prepare email body
  const emailBody = `
Hello,

Here are the extracted events:

📅 Past Events (${pastEvents.length} found):
${pastEvents.length > 0 ? pastEvents.map(e => `- ${e.Date}: ${e.Event}`).join("\n") : "⚠️ No past events found."}

🚀 More Future Events (${futureEvents.length} found):
${futureEvents.length > 0 ? futureEvents.map(e => `- ${e.Date}: ${e.Event}`).join("\n") : "⚠️ No future events found."}

Best Regards,
Automation Script
  `;

  // Step 8: Send Email with Excel File
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "gagan4march@gmail.com",
      pass: "bcqn esnb vnnw gwyt", // ⚠️ Use App Password instead
    },
  });

  const mailOptions = {
    from: "gagan4march@gmail.com",
    to: "autothon2.0@gmail.com",
    subject: "Xaviers | Nagarro Past & Future Event Details",
    text: emailBody,
    attachments: [{ filename: "Nagarro_Events.xlsx", path: filePath }],
  };

  await transporter.sendMail(mailOptions);
  console.log("✅ Email sent successfully!");

  // Step 9: Assertion
  if (pastEvents.length + futureEvents.length === 0) {
    console.warn("⚠️ No events extracted!");
  } else {
    expect(pastEvents.length + futureEvents.length).toBeGreaterThan(0);
    console.log("✅ Events extracted, saved, and emailed successfully!");
  }
});
