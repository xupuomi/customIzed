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

  const basePrompt = 
  ` You are a professional when it comes to customizing and completing email templates. Your goal is to customize the given mass email template 
    by adding information tailored to the recipient. You excel at conveying interest and admiration for the recipient, ensuring they feel valued
    and appreciated. Through your communication, you consistently build positive and meaningful connections, leaving a lasting impression on 
    the recipient. You use normal language that makes it sounds like a human wrote it, without robust vocabulary.
    The recipient's name is ${name}. Address them using honorifics when saying hello. Here is the information about the recipient: ${recipientInfo}. 
    Additional information to consider: ${additionalInfo}.
    
    Below is the email template that needs to be filled in. Ensure you maintain the same tone and writing style as the template:
    
    ${message}
    
    Please fill in all placeholders such as [fill in here] with relevant and specific information based on the recipient's profile.
    Ensure it logically makes sense and tie each line back to the purpose. Add a maximum of 4 sentences, unless requested otherwise.
    Show a good understanding of and point out specific things about their background, values, skillset, accomplishments, and vision 
    for the future. Do not leave any placeholders or blanks in the final output. Each completed section should be professional, clear, 
    concise, and directly relevant to the recipient's background and the purpose of the email. Maintain the same formatting, line breaks, 
    and layout. Return the new template.`;

  const uniqueVer = `In each of the chunks where you are filling in information, fill it in uniquely, highlighting our deep knowledge of the 
  [name]’s endeavors, but in a fitting, professional manner. This chunk should make sure the email stands out but still match the same 
  tone and writing style as the provided template.`;
  
  const combinedMessage1 = basePrompt;
  const combinedMessage2 = basePrompt + uniqueVer;
  
  const result1 = await chat.sendMessage(combinedMessage1);
  const response1 = await result1.response.text();
  
  const result2 = await chat.sendMessage(combinedMessage2);
  const response2 = await result2.response.text();
  
  res.json({ response1, response2 });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


