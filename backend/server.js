import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function scrapeWebsite(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    let text = $("body").text();
    text = text.replace(/\s+/g, " ").trim();

    return text.slice(0, 8000);
  } catch (err) {
    console.error("SCRAPE ERROR:", err);
    return "";
  }
}

async function summarizeCompanyText(rawText) {
  if (!rawText || rawText.length < 50) return "";

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
  You are summarizing company information for a sponsorship outreach email.
  Summarize the text below into a 6–10 sentence structured summary covering:
  - What the company builds
  - Their mission/values
  - Their main customer base
  - Their engineering focus areas
  - Any products relevant to student developers or hackathons

  Here is the scraped text:
  ${rawText}
  `;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

app.post("/gemini", async (req, res) => {
  const { message, name, recipientInfo, additionalInfo, websiteURL } =
    req.body;
  let scrapedSummary = "";
  if (websiteURL) {
    const raw = await scrapeWebsite(websiteURL);
    scrapedSummary = await summarizeCompanyText(raw);
  }
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const basePrompt = `
  You are an expert email-template customizer for corporate sponsorship outreach for HackIllinois, a top-tier university hackathon.

  Your job:
  - take the template below
  - fill in all company-specific placeholders
  - incorporate REAL insights from company info
  - keep tone human, friendly, professional
  - DO NOT add extra fluff or robotic language
  - never leave placeholders blank
  - VERY IMPORTANT — You must preserve ALL formatting from the user template exactly as written. 
    This includes:
    - line breaks
    - MUST keep the blank lines
    - indentation
    - bullet points
    - numbered lists
    - bold formatting **like this**
    - italic formatting *like this*
    - combined bold/italic formatting ***like this***

  Inputs to use:
  Recipient name/role: ${name}
  Company info from user: ${recipientInfo}
  Additional details: ${additionalInfo}
  Company website summary: ${scrapedSummary}

  Template to complete:
  ${message}

  Rules:
  - Keep formatting exactly the same.
  - Add max 4 new sentences unless necessary.
  - Focus on recruiting, brand exposure, developer engagement, product promotion, etc.
  - This is a sponsorship outreach email from HackIllinois 2026.

  Return ONLY the completed email.
  `;

  const uniquePrompt = basePrompt + `
  Additionally, make this version more personalized:
  - Reference more specific product or mission details (if available)
  - Show deeper alignment with HackIllinois benefits
  Keep it natural and professional.
  `;

  const r1 = await model.generateContent(basePrompt);
  const r2 = await model.generateContent(uniquePrompt);

  res.json({
    response1: r1.response.text(),
    response2: r2.response.text(),
  });
});

app.listen(8000, () => console.log("Backend running on port 8000"));
