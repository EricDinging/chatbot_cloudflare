# chatbot_cloudflare
A simple GPT-powered cloudflare-powered web search engine in Javascript. 
Enter a question, and the server will call GPT for a website url that is related to this question. 
Useful contents from target webpages will then be shown here!

File analysis functionality is under construction. 
## Configure npm environment
```
npm i create-cloudflare
npm install
```
## Develop
This step requires OpenAI API keys.
```
touch .dev.vars
echo "OPENAI_API_KEY=<key>" > .dev.vars
npx wrangler secret put OPENAI_API_KEY
npx wranger dev
```
## Deploy
Deploy cloudflare workers.
```
npx wrangler deploy
```
## Object store testing
```
# Upload a file to local dev server
curl -T object/dummyfile.txt http://localhost:8787/dummy -X PUT 
# Download
curl --output result.txt http://localhost:8787/dummy -X GET 
```      
## Reference
https://developers.cloudflare.com/workers/tutorials/openai-function-calls-workers/
https://platform.openai.com/docs/guides/function-calling?lang=node.js

