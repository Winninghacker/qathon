Autothon 2.0 Automation Solution
Overview
This project automates the tasks outlined in the Autothon 2.0 problem statements using Playwright with TypeScript. It covers six automation scenarios involving web navigation, data extraction, JWT token decoding, accessibility compliance, PDF verification, and YouTube subtitle validation. The solution leverages Playwright for browser automation, ExcelJS for Excel file handling, Nodemailer for email sending, and other libraries for specific tasks like JWT decoding and PDF parsing.
Prerequisites

Node.js: Version 18.x or higher
npm: Version 8.x or higher
Playwright: Installed with browser binaries
Operating System: Windows, macOS, or Linux
Dependencies:
@playwright/test: For browser automation
exceljs: For Excel file creation
nodemailer: For sending emails
jsonwebtoken: For JWT token decoding
pdf-parse: For PDF content verification
qrcode-reader: For QR code scanning
typescript: For TypeScript support



Setup Instructions

Clone the Repository:
git clone https://github.com/Winninghacker/qathon.git
cd qathon


Install Dependencies:
npm install


Install Playwright Browsers:
npx playwright install


Configure Environment Variables:Create a .env file in the root directory and add the following:
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password


Compile TypeScript:
npx tsc



Running the Automation

Run All Scenarios:
npx playwright test


Run Specific Scenario:Update the test configuration to include only the desired scenario, then run:
npx playwright test


Output:

Excel files are saved in the output directory.
Emails are sent to autothon2.0@gmail.com for Problem Statement 3.
Console logs display results for each scenario.



Problem Statements and Implementation
Problem Statement 1: Navigate to a Website

Task: Scan a QR code, extract the URL, and navigate to the website.
Implementation:
Uses qrcode-reader to decode the QR code from an image.
Navigates to the extracted URL using Playwright.



Problem Statement 2: Verify Partners Section

Task: Navigate to "Digital Engineering" via the "Service" dropdown, scroll to the Partners section, decode a JWT token, and verify partner names.
Implementation:
Navigates to the "Digital Engineering" page.
Scrolls to the Partners section using Playwright's scrollIntoViewIfNeeded.
Decodes the JWT token using jsonwebtoken with the provided key.
Compares extracted partner names with the decoded token's brands field.



Problem Statement 3: Events Data Extraction

Task: Extract future and past events, store in an Excel file, and email it.
Implementation:
Navigates to the "Events" section.
Scrapes event data (date, event name) using Playwright selectors.
Stores data in two Excel sheets using exceljs.
Sends the Excel file via nodemailer to autothon2.0@gmail.com.



Problem Statement 4: Accessibility Compliance for Images

Task: Check <img> tags on the Nagarro homepage for accessibility compliance and save results in an Excel file.
Implementation:
Extracts src and alt attributes of all <img> tags.
Evaluates accessibility (Pass if alt is non-empty, Fail otherwise).
Saves results in an Excel file with exceljs.



Problem Statement 5: Privacy Notice Verification

Task: Click the "Applicant Privacy Notice" link, download the PDF, and verify its heading.
Implementation:
Clicks the link and downloads the PDF using Playwright.
Parses the PDF with pdf-parse to verify the heading "Applicant Privacy Notice (APN)".



Problem Statement 6: Validate YouTube Captions

Task: Compare YouTube subtitles and timestamps with an .srt file for a specific video.
Implementation:
Navigates to the YouTube video.
Extracts subtitles and timestamps using Playwright.
Parses the .srt file and compares content for consistency.



Troubleshooting

QR Code Scanning Fails: Ensure the QR code image is clear and accessible.
Email Sending Fails: Verify EMAIL_USER and EMAIL_PASS in .env.
PDF Download Issues: Check network stability and Playwright's download handling.
YouTube Subtitles Not Loading: Ensure the video has subtitles enabled.

Notes

The solution assumes the Nagarro website structure remains consistent.
The .srt file for Problem Statement 6 should be provided in the project directory.
Playwright tests run in headless mode by default. Use --headed for debugging:npx playwright test --headed



