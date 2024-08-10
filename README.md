# customIzed
Personalize your mass email template to show your recipient you care! Paste your email template, the recipient's name & role, and the recipient's information; customIzed will take care of the rest! 

Some functionality includes:
- Generating two variations of the filled in email template
- Users can select a variant and regenerate to get two new templates, similar to the selected template

## Set up
1 . Install Node.js and npm by visiting https://nodejs.org/en/download/
   
2. Get your personal Gemini API key by visiting https://aistudio.google.com/app/apikey and edit the .env file to set `GOOGLE_GEN_AI_KEY = YOUR_API_KEY`

3. Install the following dependencies:```npm i express cors dotenv @google-generativeai```
   
## Run
First run ```npm run start:frontend``` and then run ```npm run start:backend```

***Enjoy your customized email!***
