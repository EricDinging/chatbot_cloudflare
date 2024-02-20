# chatbot_cloudflare
- Configure npm environment
```
npm create cloudflare@latest
npm install openai
npx wrangler secret put OPENAI_API_KEY

# For local development
touch .dev.vars
echo "OPENAI_API_KEY=<key>" > .dev.vars
```

- Development
```
npx wrangler dev
```
## Reference
https://developers.cloudflare.com/workers/tutorials/openai-function-calls-workers/
https://platform.openai.com/docs/guides/function-calling?lang=node.js

