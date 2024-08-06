const PORT = 8000;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

app.post('/gemini', async (req, res) => {
  const { history, message, name, recipientInfo, additionalInfo } = req.body;
  
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({ history });

  const basePrompt = `Your goal is to customize the given mass email template by adding information tailored to the recipient. 
  The recipient's name is ` + name + `. Figure out whether they are an individual or a company and write the email accordingly
  Here is the information about the recipient: ` + recipientInfo + `Using this information, tailor the missing chunks of the email to 
  highlight the specific qualities of the recipient that makes them a good fit for the goal of my email. With the recipient information,
  show a good understanding of and point out specific things about their background, values, skillset, accomplishments, and vision 
  for the future. Additionally, make sure to mention ` + additionalInfo + `Ensure the final product shows that you care about the recipient 
  and their passions. You are an expert at providing clear, concise, thoughtful, and genuine professional communication. 
  Your writing skills are exceptional, enabling you to craft messages that are not only well-structured but also engaging 
  and impactful. You excel at conveying interest and admiration for the recipient, ensuring they feel valued and appreciated.
  Through your communication, you consistently build positive and meaningful connections, leaving a lasting impression on 
  the recipient. When you add your section, maintain the same tone and writing style as the provided template. In the locations
  marked with [fill in here], craft a thoughtful message given the recipient's information I gave earlier and the specific 
  instructions within the encompassing square brackets. For example, if the template includes [fill in here: Mention that she is 
  an alumni of our school], follow the instruction 'Mention that she is an alumni of our school' in that specific section.
  Ensure each section is a maximum of 5 lines, unless explicitly stated otherwise (such as 'create an email template'),
  which would require a longer response. Additionally, fill in any obvious placeholders in the template, such as [Recipient Name], and any other similar parts.`;

  const uniqueVer = `In each of the chunks with “fill in here”, fill it in uniquely, highlighting our deep knowledge of the [name]’s endeavors, 
  but in a fitting, professional manner. This chunk should make sure the email stands out amongst the sea of emails but still match the same 
  tone and writing style as the provided template. `;
  
  const combinedMessage1 = basePrompt;
  const combinedMessage2 = basePrompt + uniqueVer;
  
  const result1 = await chat.sendMessage(combinedMessage1);
  const response1 = await result1.response.text();
  
  const result2 = await chat.sendMessage(combinedMessage2);
  const response2 = await result2.response.text();
  
  res.json({ response1, response2 });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


